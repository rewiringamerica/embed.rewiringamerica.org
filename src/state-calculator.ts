import { LitElement, css, html, nothing } from 'lit';
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
import { submitEmailSignup, wasEmailSubmitted } from './email-signup';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import { safeLocalStorage } from './safe-local-storage';

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

/**
 * We need to add event listeners to handle the tab down keyboard event in
 * order to gracefully jump out of an open SlSelect dropdown. There are two
 * different scenarios in which we have to add an event listener:
 *
 * 1) When any select is open and the dropdown appears, but without having
 *    clicked on any of the options
 * 2) When a multiselect is open and the dropdown appears, and option(s)
 *    have been selected or de-selected
 *
 * In both cases, we have to find the parent SlSelect node that the event is
 * triggered against. In the first case, the target is the first select option
 * which is highlighted, so the SlSelect node is simply the parent node of
 * the target. In the second case, the target is the input element, which is
 * nested under a shadow root, which itself is a child of the SlSelect node.
 */
const handleTabDown = (e: KeyboardEvent) => {
  const target = e.target as Node;
  const selectTarget = target.parentNode as SlSelect;
  const comboTarget = target.getRootNode() as ShadowRoot;
  const comboSelectTarget = comboTarget.host as SlSelect;

  const select =
    selectTarget instanceof SlSelect ? selectTarget : comboSelectTarget;
  if (e.key === 'Tab' && select.open) {
    e.preventDefault();
    e.stopPropagation();
    select.hide();
    select.displayInput.focus({ preventScroll: true });
  }
};

const DEFAULT_CALCULATOR_API_HOST: string = 'https://api.rewiringamerica.org';
const DEFAULT_ZIP = '';
const DEFAULT_OWNER_STATUS: OwnerStatus = 'homeowner';
const DEFAULT_TAX_FILING: FilingStatus = 'single';
const DEFAULT_HOUSEHOLD_INCOME = '0';
const DEFAULT_HOUSEHOLD_SIZE = '1';

const FORM_VALUES_LOCAL_STORAGE_KEY = 'RA-calc-form-values';
type SavedFormValues = Partial<{
  zip: string;
  ownerStatus: OwnerStatus;
  householdIncome: string;
  householdSize: string;
  taxFiling: FilingStatus;
  projects: Project[];
}>;

const formTitleStyles = css`
  .form-title {
    display: flex;
    justify-content: space-between;
  }

  .form-title__reset {
    border: none;
    background-color: transparent;
    cursor: pointer;

    color: var(--rewiring-purple);
    font-family: inherit;
    font-size: 1rem;
    font-weight: 500;
    line-height: 125%;
  }
`;

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
    formTitleStyles,
  ];

  /* supported properties to control showing/hiding of each card in the widget */

  @property({ type: Boolean, attribute: 'hide-form' })
  hideForm: boolean = false;

  @property({ type: Boolean, attribute: 'hide-details' })
  hideDetails: boolean = false;

  /* supported property to show the email signup field */

  @property({ type: Boolean, attribute: 'show-email' })
  showEmail: boolean = false;

  /* supported properties to control which API path and key is used to load the calculator results */

  @property({ type: String, attribute: 'api-key' })
  apiKey: string = '';

  @property({ type: String, attribute: 'api-host' })
  apiHost: string = DEFAULT_CALCULATOR_API_HOST;

  /* supported property to allow restricting the calculator to ZIPs in a specific state */
  @property({ type: String, attribute: 'state' })
  state: string = '';

  /* supported properties to allow pre-filling the form
   *
   * These can be overridden by values stored in local storage, which is why
   * they can't use the "attribute" property in the decorator.
   */

  @property({ type: String }) // attribute: 'zip'
  zip: string = DEFAULT_ZIP;

  @property({ type: String }) // attribute: 'owner-status'
  ownerStatus: OwnerStatus = DEFAULT_OWNER_STATUS;

  @property({ type: String }) // attribute: 'household-income'
  householdIncome: string = DEFAULT_HOUSEHOLD_INCOME;

  @property({ type: String }) // attribute: 'tax-filing'
  taxFiling: FilingStatus = DEFAULT_TAX_FILING;

  @property({ type: String }) // attribute: 'household-size'
  householdSize: string = DEFAULT_HOUSEHOLD_SIZE;

  /* internal properties */

  @property({ type: String })
  utility: string = '';

  @property({ type: Array })
  projects: Project[] = [];

  @property({ type: String })
  selectedProjectTab: Project | undefined;

  @property({ type: String })
  selectedOtherTab: Project | undefined;

  @property({ type: Boolean })
  wasEmailSubmitted: boolean = wasEmailSubmitted();

  /**
   * Called when the component is added to the DOM. At this point the values of
   * the HTML attributes are available, so we can initialize the properties
   * representing form values.
   */
  override connectedCallback(): void {
    super.connectedCallback();
    this.initFormProperties();
  }

  /**
   * Populate the properties that hold form values from saved values if
   * available, then from HTML attributes if defined, and default values
   * otherwise.
   */
  initFormProperties(): void {
    const formValues = safeLocalStorage.getItem<SavedFormValues>(
      FORM_VALUES_LOCAL_STORAGE_KEY,
    );
    const attr = (k: string) => this.attributes.getNamedItem(k)?.value;

    this.zip = formValues?.zip ?? attr('zip') ?? DEFAULT_ZIP;
    this.ownerStatus =
      formValues?.ownerStatus ??
      (attr('owner-status') as OwnerStatus) ??
      DEFAULT_OWNER_STATUS;
    this.householdIncome =
      formValues?.householdIncome ??
      attr('household-income') ??
      DEFAULT_HOUSEHOLD_INCOME;
    this.householdSize =
      formValues?.householdSize ??
      attr('household-size') ??
      DEFAULT_HOUSEHOLD_SIZE;
    this.taxFiling =
      formValues?.taxFiling ??
      (attr('tax-filing') as FilingStatus) ??
      DEFAULT_TAX_FILING;
    this.projects = formValues?.projects ?? [];
  }

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

    this.saveFormValues();

    const email = (formData.get('email') || '') as string;
    if (email && !this.wasEmailSubmitted) {
      submitEmailSignup(this.apiHost, this.apiKey, email, this.zip);
      // This hides the email field
      this.wasEmailSubmitted = true;
    }

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

  saveFormValues() {
    safeLocalStorage.setItem<SavedFormValues>(FORM_VALUES_LOCAL_STORAGE_KEY, {
      zip: this.zip,
      ownerStatus: this.ownerStatus,
      householdIncome: this.householdIncome,
      householdSize: this.householdSize,
      taxFiling: this.taxFiling,
      projects: this.projects,
    });
  }

  resetFormValues() {
    safeLocalStorage.removeItem(FORM_VALUES_LOCAL_STORAGE_KEY);
    this.initFormProperties();
  }

  override async updated() {
    await new Promise(r => setTimeout(r, 0));
    if (!this.renderRoot) {
      return;
    }
    this.renderRoot.querySelectorAll('sl-select').forEach(currSelect => {
      const combobox = currSelect.renderRoot.querySelector(
        'div.select__combobox',
      ) as HTMLElement;

      currSelect.addEventListener('keydown', handleTabDown);
      combobox?.addEventListener('keydown', handleTabDown);
    });

    const multiselect = this.renderRoot.querySelector(
      '.multiselect-prefix-icon-tag',
    ) as SlSelect;

    if (multiselect) {
      multiselect.getTag = option => {
        const src = option
          .querySelector('sl-icon[slot="prefix"]')
          ?.getAttribute('src');

        return `
          <sl-tag removable>
            <sl-icon src="${src}" style="padding-inline-end: .5rem;"></sl-icon>
            ${option.getTextLabel()}
          </sl-tag>
        `;
      };
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

      const response = await fetchApi<APIUtilitiesResponse>(
        this.apiKey,
        this.apiHost,
        '/api/v1/utilities',
        query,
      );

      // If our "state" attribute is set, enforce that the entered location is
      // in that state.
      if (this.state && this.state !== response.location.state) {
        // Throw to put the task into the ERROR state for rendering.
        throw new Error(
          `That ZIP code is not in ${STATES[this.state]?.name ?? this.state}.`,
        );
      }

      return response;
    },
    onComplete: response => {
      const ids = Object.keys(response.utilities);
      if (ids.length === 0) {
        this.utility = '';
      } else {
        // Preserve the previous utility selection if it's still available.
        // Select the first option in the list otherwise.
        if (!ids.includes(this.utility)) {
          this.utility = ids[0];
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
  });

  override render() {
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
    //
    // - An error message, if nothing is currently loading and either fetch
    //   errored out.

    const showLoading =
      this._utilitiesTask.status === TaskStatus.PENDING ||
      this._task.status === TaskStatus.PENDING;

    const calculateButtonContent = html`Calculate`;

    return html`
      <div class="calculator">
        <div class="card card-content">
          <div class="form-title">
            <h1 class="form-title__text">Your household info</h1>
            <div>
              <button
                class="form-title__reset"
                @click=${() => this.resetFormValues()}
              >
                Reset calculator
              </button>
            </div>
          </div>
          ${this.hideForm
            ? nothing
            : formTemplate(
                [
                  this.zip,
                  this.ownerStatus,
                  this.householdIncome,
                  this.taxFiling,
                  this.householdSize,
                ],
                this.projects,
                {
                  showEmailField: this.showEmail && !this.wasEmailSubmitted,
                  showProjectField: true,
                  tooltipSize: 13,
                  calculateButtonContent,
                },
                (event: SubmitEvent) => this.submit(event),
                'grid-2-2-1',
              )}
        </div>
        ${
          // This is defensive against the possibility that the backend and
          // frontend have support for different sets of states. (Backend support
          // means knowing utilities and incentives for a state; frontend support
          // means having an outline map and name for a state.)
          this._utilitiesTask.status === TaskStatus.COMPLETE &&
          this._utilitiesTask.value &&
          Object.keys(this._utilitiesTask.value.utilities).length > 0 &&
          this._utilitiesTask.value.location.state in STATES
            ? utilitySelectorTemplate(
                STATES[this._utilitiesTask.value.location.state],
                this.utility,
                this._utilitiesTask.value.utilities,
                newUtility => {
                  this.utility = newUtility;
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
                this.projects,
                newOtherSelection =>
                  (this.selectedOtherTab = newOtherSelection),
                newSelection => (this.selectedProjectTab = newSelection),
                this.selectedOtherTab,
                this.selectedProjectTab,
              ),
            ]
          : nothing}
        ${showLoading ? loadingTemplate() : nothing}
        ${showLoading
          ? nothing
          : this._utilitiesTask.status === TaskStatus.ERROR
          ? errorTemplate(this._utilitiesTask.error)
          : this._task.status === TaskStatus.ERROR
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
