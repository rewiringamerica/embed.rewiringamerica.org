import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task } from '@lit-labs/task';
import { cardStyles, baseStyles, tableStlyes } from './styles';
import { calculatorTableIcon } from './components/icons';

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

const linkStyles = css`
  a.more-info-button {
    display: inline-block;
    text-decoration: none;
    color: black;
    background-color: rgb(238, 238, 238);
    border-radius: 4px;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    position: relative;
    padding: 8px 40px 8px 16px;
  }
  a.more-info-button::after {
    content: "";
    display: inline-block;
    position: absolute;
    border-color: black;
    border-style: solid;
    border-top-width: 0px;
    border-right-width: 1px;
    border-bottom-width: 1px;
    border-left-width: 0px;
    width: 10px;
    height: 10px;
    right: 16px;
    transform: rotate(316deg);
    margin-top: 8px;
  }
`;

const numberTemplate = (label: string, value: number) => html`
  <div class="summary-number">
    <div class="summary-number--label">${label}</div>
    <div class="summary-number--value">$${value.toLocaleString()}</div>
  </div>
`;

function nearestFifty(dollars: number) {
  return Math.round(dollars / 50) * 50;
}

function formatAmount(amount: number, amount_type: string) {
  if (amount_type == 'percent') {
    return `${Math.round(amount * 100)}%`;
  } else if (amount_type == 'dollar_amount') {
    return `$${amount.toLocaleString()}`;
  } else {
    return amount.toString();
  }
}

function formatStartDate(start_date: number, type: string) {
  if (start_date == 2022) {
    return 'Available now!';
  } else if (start_date == 2023) {
    if (type == 'pos_rebate') {
      return 'Late 2023'
    } else {
      return 'Available now!';
    }
  } else {
    return start_date.toString();
  }
}

const detailRow = (incentive) => html`
  <tr>
  <td>${incentive.item}</td>
  <td class="cell--right">${formatAmount(incentive.amount, incentive.amount_type)}</td>
  <td class="cell--right">${formatStartDate(incentive.start_date, incentive.type)}</td>
  <td class="cell--right"><a class="more-info-button" href="https://www.rewiringamerica.org/${incentive.more_info_url}">More Info</a></td>
  </tr>
`;

const detailsTable = (incentives) => html`
  <table>
    <thead>
      <tr><th>Item</th><th class="cell--right">Amount</th><th class="cell--right">Timeline</th><th>&nbsp;</th></tr>
    </thead>
    <tbody>
      ${incentives && incentives.map(item => detailRow(item))}
    </tbody>
  </table>
`;

const detailsTemplate = (results: any) => html`
  <div class="card">
    <div class="card-title--intense">
      <div class="card-title__icon-grid">
        ${calculatorTableIcon()}
        <div>
          <h2>Household Electrification Incentives</h2>
          <p>All the savings you may be eligible for!<p>
        </div>
      </div>
    </div>
    <div class="card-content--full-bleed">
      <h1 class="card-content--full-bleed__title">Electrification Rebates</h1>
      ${detailsTable(results.pos_rebate_incentives)}
      <h1 class="card-content--full-bleed__title">Tax Credits</h1>
      ${detailsTable(results.tax_credit_incentives)}
    </div>
  </div>
`;

const loadedTemplate = (results: any, showDetails: boolean = true) => html`
  <div class="card">
    <div class="card-title">
      <h1>Your Personalized Incentives</h1>
      These are available to American homeowners and renters over the next 10 years.
    </div>
    <div class="card-content">
      ${numberTemplate('Upfront Discounts', nearestFifty(results.pos_savings))}
      <!-- TODO: add disclaimer here about 50 or 100% of costs -->
      ${numberTemplate('Tax Credits', nearestFifty(results.tax_savings))}
      ${numberTemplate('Estimated Bill Savings Per Year', nearestFifty(results.estimated_annual_savings))}
      ${numberTemplate('Total Incentives (Estimated)', nearestFifty(results.pos_savings + results.tax_savings))}
    </div>
  </div>
  ${showDetails && detailsTemplate(results)}
  <div class="logo"><img src="https://www.rewiringamerica.org/images/logo-rewiring-america.png" width="160"></div>
`;

const loadingTemplate = () => html`
  <div class="card-content">Loading...</div>
`;

const errorTemplate = (error: any) => html`
  <div class="card-content">${error.message || 'Error loading incentives.'}</div>
`;

const RA_API_BASE: string = 'https://api.rewiringamerica.org';
const CALCULATOR_PATH: string = '/api/v0/calculator';

@customElement('rewiring-america-calculator-result')
export class RewiringAmericaCalculatorResult extends LitElement {
  static styles = [baseStyles, cardStyles, numberStyles, tableStlyes, linkStyles];

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

  @property({ type: String, attribute: 'api-key' })
  apiKey: string = '';

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
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      if (response.status >= 400) {
        console.log(response);
        throw new Error(response.statusText);
      }
      return response.json();
    },
    () => [this.zip, this.ownerStatus, this.householdIncome, this.taxFiling, this.householdSize]
  );

  override render() {
    return html`
      ${this._task.render({ pending: loadingTemplate, complete: loadedTemplate, error: errorTemplate })}
    `;
  }
}
