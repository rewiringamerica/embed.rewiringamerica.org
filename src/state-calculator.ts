import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task, TaskStatus, initialState } from '@lit-labs/task';
import { baseStyles } from './styles';
import { formTemplate, formStyles } from './calculator-form';
import { FilingStatus, OwnerStatus } from './calculator-types';
import { CALCULATOR_FOOTER } from './calculator-footer';
import { fetchApi } from './api/fetch';
import {
  stateIncentivesTemplate,
  stateIncentivesStyles,
  cardStyles,
  separatorStyles,
} from './state-incentive-details';
import { Project } from './projects';
import {
  utilitySelectorStyles,
  utilitySelectorTemplate,
} from './utility-selector';
import { iconTabBarStyles } from './icon-tab-bar';

import '@shoelace-style/shoelace/dist/components/spinner/spinner';
import { STATES } from './states';
import { authorityLogosStyles } from './authority-logos';
import { APIResponse, APIUtilitiesResponse } from './api/calculator-types-v1';

const loadingTemplate = () => html`
  <div class="card card-content">
    <div class="loading">
      <sl-spinner></sl-spinner>
    </div>
  </div>
`;

const errorTemplate = (error: unknown) => html`
  <div class="card card-content">
    ${typeof error === 'object' && error && 'message' in error && error.message
      ? error.message
      : 'Error loading incentives.'}
  </div>
`;

const DEFAULT_CALCULATOR_API_HOST: string = 'https://api.rewiringamerica.org';

@customElement('rewiring-america-state-calculator')
export class RewiringAmericaStateCalculator extends LitElement {
  static override styles = [
    baseStyles,
    cardStyles,
    ...formStyles,
    stateIncentivesStyles,
    utilitySelectorStyles,
    separatorStyles,
    iconTabBarStyles,
    authorityLogosStyles,
  ];

  /* supported properties to control showing/hiding of each card in the widget */

  @property({ type: Boolean, attribute: 'hide-form' })
  hideForm: boolean = false;

  @property({ type: Boolean, attribute: 'hide-details' })
  hideDetails: boolean = false;

  /* supported properties to control which API path and key is used to load the calculator results */

  @property({ type: String, attribute: 'api-key' })
  apiKey: string = '';

  @property({ type: String, attribute: 'api-host' })
  apiHost: string = DEFAULT_CALCULATOR_API_HOST;

  /* supported properties to allow pre-filling the form */

  @property({ type: String, attribute: 'zip' })
  zip: string = '';

  @property({ type: String, attribute: 'owner-status' })
  ownerStatus: OwnerStatus = 'homeowner';

  @property({ type: String, attribute: 'household-income' })
  householdIncome: string = '0';

  @property({ type: String, attribute: 'tax-filing' })
  taxFiling: FilingStatus = 'single';

  @property({ type: String, attribute: 'household-size' })
  householdSize: string = '1';

  @property({ type: String })
  utility: string = '';

  @property({ type: String })
  selectedProject: Project = 'hvac';

  @property({ type: String })
  selectedOtherTab: Project = 'heat_pump_clothes_dryer';

  /**
   * This is a hack to deal with a quirk of the UI.
   *
   * Specifically:
   *
   * - Rendering the utility selector / map outline requires knowing what state
   *   the user is in, to know which outline to show.
   * - That state is unknown until the /calculator response is available.
   * - When the user changes the utility selector, the /calculator response is
   *   unavailable while it's loading. But we want to continue showing the
   *   utility selector / map outline.
   *
   * This property thus temporarily remembers the state from the last completed
   * /calculator response, when the utility selector is changed. It's cleared
   * when the /calculator response arrives.
   */
  tempState: string | null = null;

  submit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prevZip = this.zip;
    this.zip = (formData.get('zip') as string) || '';
    this.ownerStatus = (formData.get('owner_status') as OwnerStatus) || '';
    this.householdIncome = (formData.get('household_income') as string) || '';
    this.taxFiling = (formData.get('tax_filing') as FilingStatus) || '';
    this.householdSize = (formData.get('household_size') as string) || '';
    this.selectedProject = (formData.get('project') as Project) || '';

    // Zip is the only thing that determines what utilities are available, so
    // only fetch utilities if zip has changed since last calculation, or if
    // utilities haven't been fetched yet at all.
    if (
      this.zip !== prevZip ||
      this._utilitiesTask.status !== TaskStatus.COMPLETE
    ) {
      // This will run _task when it's done.
      this._utilitiesTask.run();
    } else {
      this._task.run();
    }
  }

  isFormComplete() {
    return !!(
      this.zip &&
      this.ownerStatus &&
      this.taxFiling &&
      this.householdIncome &&
      this.householdSize &&
      this.selectedProject
    );
  }

  private _utilitiesTask = new Task(this, {
    autoRun: false,
    task: async () => {
      const query = new URLSearchParams({
        'location[zip]': this.zip,
      });

      try {
        const utilityMap = await fetchApi<APIUtilitiesResponse>(
          this.apiKey,
          this.apiHost,
          '/api/v1/utilities',
          query,
        );

        return Object.keys(utilityMap).map(id => ({
          value: id,
          label: utilityMap[id].name,
        }));
      } catch (_) {
        // Just use an empty utilities list if there's an error.
        return [];
      }
    },
    onComplete: options => {
      if (options.length === 0) {
        this.utility = '';
      } else {
        // Preserve the previous utility selection if it's still available.
        // Select the first option in the list otherwise.
        if (!options.map(o => o.value).includes(this.utility)) {
          this.utility = options[0].value;
        }
      }
      this._task.run();
    },
  });

  private _task = new Task(this, {
    autoRun: false,
    task: async () => {
      if (!this.isFormComplete()) {
        // this is a special response type provided by Task to keep it in the INITIAL state
        return initialState;
      }

      const query = new URLSearchParams({
        'location[zip]': this.zip,
        owner_status: this.ownerStatus,
        household_income: this.householdIncome,
        tax_filing: this.taxFiling,
        household_size: this.householdSize,
      });
      if (this.utility) {
        query.set('utility', this.utility);
      }

      return fetchApi<APIResponse>(
        this.apiKey,
        this.apiHost,
        '/api/v1/calculator',
        query,
      );
    },
    onComplete: () => {
      this.tempState = null;
    },
  });

  override render() {
    // If we have incentives loaded, use coverage.state from that to determine
    // which state outline to show. Otherwise, look at the "tempState" override,
    // which is set when the utility selector is changed.
    const highlightedState =
      this._task.status === TaskStatus.COMPLETE
        ? this._task.value?.coverage.state
        : this.tempState;

    // Show the following elements below the form:
    //
    // - The utility selector/map, if we know what state the user's ZIP is
    //   located in, we have an outline map of that state, and the options for
    //   utilities are finished loading.
    //
    // - The incentive results with a separator line above, if both the
    //   incentives and utilities are finished loading.
    //
    // - The loading spinner, if either utilities or incentives are still
    //   loading.

    const showLoading =
      this._utilitiesTask.status === TaskStatus.PENDING ||
      this._task.status === TaskStatus.PENDING;

    return html`
      <div class="calculator">
        <div class="card card-content">
          <h1>Your household info</h1>
          ${this.hideForm
            ? nothing
            : formTemplate(
                [
                  this.selectedProject,
                  this.zip,
                  this.ownerStatus,
                  this.householdIncome,
                  this.taxFiling,
                  this.householdSize,
                ],
                true,
                (event: SubmitEvent) => this.submit(event),
                'grid-3-2-1',
              )}
        </div>
        ${
          // This is defensive against the possibility that the backend and
          // frontend have support for different sets of states. (Backend support
          // means knowing utilities and incentives for a state; frontend support
          // means having an outline map and name for a state.)
          this._utilitiesTask.status === TaskStatus.COMPLETE &&
          this._utilitiesTask.value!.length > 0 &&
          highlightedState &&
          highlightedState in STATES
            ? utilitySelectorTemplate(
                STATES[highlightedState],
                this.utility,
                this._utilitiesTask.value!,
                newUtility => {
                  this.utility = newUtility;
                  this.tempState = highlightedState;
                  this._task.run();
                },
              )
            : nothing
        }
        ${this._utilitiesTask.status === TaskStatus.COMPLETE &&
        this._task.status === TaskStatus.COMPLETE
          ? [
              html`<div class="separator"></div>`,
              stateIncentivesTemplate(
                this._task.value!,
                this.selectedProject,
                this.selectedOtherTab,
                newSelection => (this.selectedOtherTab = newSelection),
              ),
            ]
          : nothing}
        ${showLoading ? loadingTemplate() : nothing}
        ${this._task.status === TaskStatus.ERROR && !showLoading
          ? errorTemplate(this._task.error)
          : nothing}
        ${CALCULATOR_FOOTER}
      </div>
    `;
  }
}

/**
 * Tell TypeScript that the HTML tag's type signature corresponds to the
 * class's type signature.
 */
declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-state-calculator': RewiringAmericaStateCalculator;
  }
}
