import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task } from '@lit-labs/task';
import { cardStyles, fontStyles } from './styles';

function formatCurrency(value) {
  const commaSeparated = value.toLocaleString();
  return `$${commaSeparated}`;
}

const numberStyles = css`
  .summary-number {
    border-left: 5px solid var(--rewiring-yellow);
    padding-left: 11px;
    margin-bottom: 8px;
  }
  .summary-number--label {
    font-size: 16px;
    line-height: 16px;
    font-weight: 400;
    text-transform: uppercase;
  }
  .summary-number--value {
    font-size: 32px;
    line-height: 32px;
    font-weight: 700;
  }
`;

const numberTemplate = (label, value) => html`
  <div class="summary-number">
    <div class="summary-number--label">${label}</div>
    <div class="summary-number--value">${formatCurrency(value)}</div>
  </div>
`;

const loadedTemplate = (results: any) => html`
  ${numberTemplate('Upfront Discounts', results.pos_savings)}
  ${numberTemplate('Tax Credits', results.tax_savings)}
  ${numberTemplate('Estimated Bill Savings Per Year', results.performance_rebate_savings)}
  ${numberTemplate('Total Incentives (Estimated)', results.estimated_annual_savings)}
  <div class="logo"><img src="https://www.rewiringamerica.org/images/logo-rewiring-america.png" width="160"></div>
`;

const RA_API_BASE: string = 'https://api.rewiringamerica.org';
const CALCULATOR_PATH: string = '/api/v0/calculator';
const RA_API_TOKEN: string = 'zpka_55fe0949f2df43b58bf973931d15c638_00913a90'

@customElement('rewiring-america-calculator-result')
export class RewiringAmericaCalculatorResult extends LitElement {
  static styles = [fontStyles, cardStyles, numberStyles];

  @property({ type: String })
  zip: string = '';

  @property({ type: String, attribute: 'owner-status' })
  ownerStatus: string = '';

  @property({ type: String, attribute: 'household-income' })
  householdIncome: string = '';

  @property({ type: String, attribute: 'tax-filing' })
  taxFiling: string = '';

  @property({ type: String, attribute: 'household-size' })
  householdSize: string = '';

  private _task = new Task(
    this,
    async ([zip, ownerStatus, householdIncome, taxFiling, householdSize]) => {
      const query = new URLSearchParams({
        zip: zip,
        owner_status: ownerStatus,
        household_income: householdIncome,
        tax_filing: taxFiling,
        household_size: householdSize,
      });
      const url = new URL(`${RA_API_BASE}${CALCULATOR_PATH}?${query}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${RA_API_TOKEN}`
        }
      });
      return response.json();
    },
    () => [this.zip, this.ownerStatus, this.householdIncome, this.taxFiling, this.householdSize]
  );

  override render() {
    return html`
      <div class="card">
        ${this._task.render({
      pending: () => html`Loading...`,
      complete: loadedTemplate
    })}
      </div>
    `;
  }
}
