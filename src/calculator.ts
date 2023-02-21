import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task, initialState } from '@lit-labs/task';
import { baseStyles, cardStyles, gridStyles } from './styles';
import { formTemplate, formStyles } from './calculator-form';
import { detailsStyles, detailsTemplate } from './incentive-details';
import { summaryStyles, summaryTemplate } from './incentive-summary'
import { FilingStatus, OwnerStatus } from './calculator-types';

const loadedTemplate = (results: any, hideDetails: boolean, hideSummary: boolean) => html`
    ${hideSummary ? nothing : summaryTemplate(results)}
    ${hideDetails ? nothing : detailsTemplate(results)}
`;

const loadingTemplate = () => html`
  <div class="card card-content">Loading...</div>
`;

const errorTemplate = (error: any) => html`
  <div class="card card-content">${error.message || 'Error loading incentives.'}</div>
`;

const DEFAULT_CALCULATOR_API_PATH: string = 'https://api.rewiringamerica.org/api/v0/calculator';

@customElement('rewiring-america-calculator')
export class RewiringAmericaCalculator extends LitElement {
  static override styles = [
    baseStyles,
    cardStyles,
    gridStyles,
    ...formStyles,
    summaryStyles,
    ...detailsStyles
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

  @property({ type: String, attribute: 'api-path' })
  apiPath: string = DEFAULT_CALCULATOR_API_PATH;

  /* supported properties to allow pre-filling the form */

  @property({ type: String, attribute: 'zip' })
  zip: string = '';

  @property({ type: String, attribute: 'owner-status' })
  ownerStatus: OwnerStatus = 'homeowner';

  @property({ type: String, attribute: 'household-income' })
  householdIncome: string = '';

  @property({ type: String, attribute: 'tax-filing' })
  taxFiling: FilingStatus = 'single';

  @property({ type: String, attribute: 'household-size' })
  householdSize: string = '1';

  submit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    this.zip = formData.get('zip') as string || '';
    this.ownerStatus = formData.get('owner_status') as OwnerStatus || '';
    this.householdIncome = formData.get('household_income') as string || '';
    this.taxFiling = formData.get('tax_filing') as FilingStatus || '';
    this.householdSize = formData.get('household_size') as string || '';
  }

  get hideResult() {
    return !(this.zip && this.ownerStatus && this.taxFiling && this.householdIncome && this.householdSize);
  }

  private _task = new Task(
    this,
    async ([zip, ownerStatus, householdIncome, taxFiling, householdSize]) => {
      if (this.hideResult) {
        return initialState;
      }
      const query = new URLSearchParams({
        zip: zip,
        owner_status: ownerStatus,
        household_income: householdIncome,
        tax_filing: taxFiling,
        household_size: householdSize,
      });
      const url = new URL(`${this.apiPath}?${query}`);
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      if (response.status >= 400) {
        console.error(response);
        throw new Error(response.statusText);
      }
      return response.json();
    },
    () => [this.zip, this.ownerStatus, this.householdIncome, this.taxFiling, this.householdSize]
  );

  override render() {
    return html`
      ${this.hideForm ? nothing : formTemplate([this.zip, this.ownerStatus, this.householdIncome, this.taxFiling, this.householdSize], (event: SubmitEvent) => this.submit(event))}
      ${this.hideResult ? nothing : html`
        ${this._task.render({
      pending: loadingTemplate,
      complete: (results) => loadedTemplate(results, this.hideDetails, this.hideSummary),
      error: errorTemplate
    })}
      `}
      <div class="footer">
        <p>Calculator by <a target="_blank" href="https://www.rewiringamerica.org">Rewiring America</a> • <a target="_blank" href="https://content.rewiringamerica.org/view/privacy-policy.pdf">Privacy Policy</a> • <a target="_blank" href="https://content.rewiringamerica.org/api/terms.pdf">Terms</a></p>
      </div>
  `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "rewiring-america-calculator": RewiringAmericaCalculator;
  }
}
