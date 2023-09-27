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

  /**
   * Property to customize the calculator for a particular state. Must be the
   * two-letter code, uppercase (example: "NY").
   *
   * Currently the only customization is to display the name of the state.
   * TODO: Have a nice error message if you enter a zip/address outside this
   * state, if it's defined.
   */
  @property({ type: String, attribute: 'state' })
  state: string = '';

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

  @property({ type: Array })
  projects: Project[] = [];

  @property({ type: String })
  selectedProjectTab: Project | undefined;

  @property({ type: String })
  selectedOtherTab: Project = 'battery';

  submit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prevZip = this.zip;
    this.zip = (formData.get('zip') as string) || '';
    this.ownerStatus = (formData.get('owner_status') as OwnerStatus) || '';
    this.householdIncome = (formData.get('household_income') as string) || '';
    this.taxFiling = (formData.get('tax_filing') as FilingStatus) || '';
    this.householdSize = (formData.get('household_size') as string) || '';
    this.projects = (formData.getAll('projects') as Project[]) || '';

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
      this.projects
    );
  }

  private _utilitiesTask = new Task(this, {
    autoRun: false,
    task: async () => {
      const query = new URLSearchParams({
        'location[zip]': this.zip,
      });
      const utilityMap = await fetchApi(
        this.apiKey,
        this.apiHost,
        '/api/v1/utilities',
        query,
      );

      return Object.keys(utilityMap).map(id => ({
        value: id,
        label: utilityMap[id].name,
      }));
    },
    onComplete: options => {
      // Preserve the previous utility selection if it's still available.
      if (!options.map(o => o.value).includes(this.utility)) {
        this.utility = options[0].value;
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
      query.append('authority_types', 'federal');
      query.append('authority_types', 'state');
      query.append('authority_types', 'utility');
      query.set('utility', this.utility);

      return await fetchApi(
        this.apiKey,
        this.apiHost,
        '/api/v1/calculator',
        query,
      );
    },
  });

  override render() {
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
                this.projects,
                true,
                (event: SubmitEvent) => this.submit(event),
                'grid-3-2-1',
              )}
        </div>
        ${this._utilitiesTask.render({
          pending: loadingTemplate,
          complete: options =>
            utilitySelectorTemplate(
              STATES[this.state],
              this.utility,
              options,
              newUtility => {
                this.utility = newUtility;
                this._task.run();
              },
            ),
          error: errorTemplate,
        })}
        ${this._task.status !== TaskStatus.INITIAL &&
        this._utilitiesTask.status === TaskStatus.COMPLETE
          ? html`<div class="separator"></div>`
          : nothing}
        ${this._task.render({
          pending: loadingTemplate,
          complete: results =>
            this._utilitiesTask.status !== TaskStatus.COMPLETE
              ? nothing
              : stateIncentivesTemplate(
                results,
                this.projects,
                newOtherSelection =>
                  (this.selectedOtherTab = newOtherSelection),
                newSelection => (this.selectedProjectTab = newSelection),
                this.selectedOtherTab,
                this.selectedProjectTab,
              ),
          error: errorTemplate,
        })}
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
