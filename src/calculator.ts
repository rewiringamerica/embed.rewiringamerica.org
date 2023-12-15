import { Task, initialState } from '@lit-labs/task';
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fetchApi } from './api/fetch';
import { CALCULATOR_FOOTER } from './calculator-footer';
import { formStyles, formTemplate } from './calculator-form';
import {
  FilingStatus,
  ICalculatedIncentiveResults,
  OwnerStatus,
} from './calculator-types';
import { downIcon } from './icons';
import { detailsStyles, detailsTemplate } from './incentive-details';
import { summaryStyles, summaryTemplate } from './incentive-summary';
import { baseStyles, cardStyles, gridStyles } from './styles';

const loadedTemplate = (
  results: ICalculatedIncentiveResults,
  hideDetails: boolean,
  hideSummary: boolean,
) => html`
  ${hideSummary ? nothing : summaryTemplate(results)}
  ${hideDetails ? nothing : detailsTemplate(results)}
`;

const loadingTemplate = () => html`
  <div class="card card-content">Loading...</div>
`;

const errorTemplate = (error: unknown) => html`
  <div class="card card-content">
    ${typeof error === 'object' && error && 'message' in error && error.message
      ? error.message
      : 'Error loading incentives.'}
  </div>
`;

const DEFAULT_CALCULATOR_API_HOST: string = 'https://api.rewiringamerica.org';

@customElement('rewiring-america-calculator')
export class RewiringAmericaCalculator extends LitElement {
  static override styles = [
    baseStyles,
    cardStyles,
    gridStyles,
    ...formStyles,
    summaryStyles,
    ...detailsStyles,
  ];

  /* supported properties to control showing/hiding of each card in the widget */

  @property({ type: Boolean, attribute: 'hide-form' })
  hideForm: boolean = false;

  @property({ type: Boolean, attribute: 'hide-summary' })
  hideSummary: boolean = false;

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

  submit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    this.zip = (formData.get('zip') as string) || '';
    this.ownerStatus = (formData.get('owner_status') as OwnerStatus) || '';
    this.householdIncome = (formData.get('household_income') as string) || '';
    this.taxFiling = (formData.get('tax_filing') as FilingStatus) || '';
    this.householdSize = (formData.get('household_size') as string) || '';
  }

  get hideResult() {
    return !(
      this.zip &&
      this.ownerStatus &&
      this.taxFiling &&
      this.householdIncome &&
      this.householdSize
    );
  }

  private _task = new Task(this, {
    // this array of parameters is generated by the `args` function below
    // it's formatted with snake_case to make it really easy to throw into URLSearchParams
    task: async ([
      zip,
      owner_status,
      household_income,
      tax_filing,
      household_size,
    ]) => {
      if (this.hideResult) {
        // this is a special response type provided by Task to keep it in the INITIAL state
        return initialState;
      }
      const query = new URLSearchParams({
        zip,
        owner_status,
        household_income,
        tax_filing,
        household_size,
      });
      return await fetchApi<ICalculatedIncentiveResults>(
        this.apiKey,
        this.apiHost,
        '/api/v0/calculator',
        query,
      );
    },
    // if the args array changes then the task will run again
    args: () => [
      this.zip,
      this.ownerStatus,
      this.householdIncome,
      this.taxFiling,
      this.householdSize,
    ],
  });

  override render() {
    const calculateButtonContent = html`Calculate! ${downIcon(18, 18)}`;

    return html`
      <div class="calculator">
        <div class="card card-content">
          <h1>How much money will you get with the Inflation Reduction Act?</h1>
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
                [],
                {
                  tooltipSize: 18,
                  showProjectField: false,
                  calculateButtonContent,
                },
                (event: SubmitEvent) => this.submit(event),
              )}
        </div>
        ${this.hideResult
          ? nothing
          : html`
              ${this._task.render({
                pending: loadingTemplate,
                complete: results =>
                  loadedTemplate(results, this.hideDetails, this.hideSummary),
                error: errorTemplate,
              })}
            `}
      </div>
      ${CALCULATOR_FOOTER()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-calculator': RewiringAmericaCalculator;
  }
}
