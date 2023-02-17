import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task } from '@lit-labs/task';
import { cardStyles, baseStyles, tableStlyes } from './styles';
import { calculatorTableIcon, lightningBolt } from './components/icons';

const numberStyles = css`
  .summary-numbers {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }
  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    .summary-numbers {
      grid-template-columns: unset;
      grid-template-rows: min-content;
    }
  }
  .summary-number__border {
    border-left: 5px solid var(--rewiring-yellow);
    padding-left: 11px;
  }
  .summary-number__border--fancy {
    border-left: 5px solid var(--rewiring-purple);
    padding-left: 11px;
  }
  .summary-number__label {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    text-transform: uppercase;
    max-width: 10em; /* optical */
    margin-bottom: 8px;
  }
  .summary-number__value {
    font-size: 32px;
    line-height: 32px;
    font-weight: 700;
  }
  .summary-number__detail {
    padding-left: 16px;
    padding-top: 4px;
    margin-top: 8px;
  }
  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    .summary-number__detail {
      margin: 0;
    }
  }

  .summary-number--total {
    display: grid;
    grid-template-columns: max-content max-content;
    align-items: baseline;
    gap: 16px;
  }
  .summary-number--total__value, .summary-number--total__label {
    font-size: 48px;
    line-height: 64px;
    font-weight: 500;
  }
  .summary-number--total__label__detail {
    display: none;
  }
  .summary-number--total__icon {
    vertical-align: middle;
    margin-left: 16px;
  }

  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    .summary-number--total__icon {
      display: none;
    }
    .summary-number--total__label__detail {
      display: inline;
    }
    .summary-number--total__disclaimer {
      display: none;
    }
    .summary-number--total {
      border-left: 5px solid var(--rewiring-yellow);
      padding-left: 11px;
      display: block;
      grid-template-columns: unset;
      align-items: unset;
      gap: unset;
    }
    .summary-number--total__label {
      font-size: 16px;
      line-height: 16px;
      font-weight: 400;
      text-transform: uppercase;
    }
  }
`;

const linkStyles = css`
  a.more-info-button, a.more-info-button:link, a.more-info-button:visited {
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
  a.more-info-button:hover, a.more-info-button:active {
    background-color: rgb(218, 218, 218);
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

  a.more-info-link, a.more-info-link:link, a.more-info-link:visited {
    text-decoration: none;
    color: black;
  }

  /* Extra small devices */
  @media only screen and (max-width: 768px) {
    .hide-on-mobile {
      display:none;
    }
    a.more-info-link, a.more-info-link:link, a.more-info-link:visited {
      text-decoration: underline;
      color: unset;
    }
  }
`;

const numberTemplate = (label: string, value: number, fancy?: boolean, extra?: TemplateResult) => html`
  <div class="summary-number">
    <div class=${fancy ? "summary-number__border--fancy" : "summary-number__border"}>
      <div class="summary-number__label">${label}</div>
      <div class="summary-number__value">$${value.toLocaleString()}</div>
    </div>
    ${extra || nothing}
  </div>
`;

function nearestFifty(dollars: number) {
  return Math.round(dollars / 50) * 50;
}

function formatAmount(amount: number, amount_type: string) {
  if (amount_type == 'percent') {
    return `${Math.round(amount * 100)}%`;
  } else if (amount_type == 'dollar_amount') {
    if (amount == 0) {
      return 'N/A';
    } else {
      return `$${amount.toLocaleString()}`;
    }
  } else {
    return amount.toString();
  }
}

function formatStartDate(start_date: number, type: string) {
  if (start_date == 2022) {
    return html`<em>Available Now!</em>`;
  } else if (start_date == 2023) {
    if (type == 'pos_rebate') {
      return html`Late 2023`;
    } else {
      return html`<em>Available Now!</em>`;
    }
  } else {
    return html`${start_date.toString()}`;
  }
}

const detailRow = (incentive) => html`
  <tr class="${incentive.eligible ? nothing : "row--dimmed"}">
    <td><a class="more-info-link" href="https://www.rewiringamerica.org/${incentive.more_info_url}">${incentive.item}</a></td>
    <td class="cell--right">${formatAmount(incentive.amount, incentive.amount_type)}</td>
    <td class="cell--right">${formatStartDate(incentive.start_date, incentive.type)}</td>
    <td class="cell--right hide-on-mobile"><a class="more-info-button" href="https://www.rewiringamerica.org/${incentive.more_info_url}">More Info</a></td>
  </tr>
`;

const detailsTable = (incentives) => html`
  <table>
    <thead>
      <tr>
        <th class="cell--primary">Item</th>
        <th class="cell--right">Amount</th>
        <th class="cell--right">Timeline</th>
        <th class="hide-on-mobile"></th>
      </tr>
    </thead>
    <tbody>
      ${incentives && incentives.map(item => detailRow(item))}
    </tbody>
  </table>
`;

const detailsTemplate = (results: any) => html`
  <div class="card">
    <div class="card__heading--intense">
      <div class="card__heading__icon-grid">
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

const upfrontDiscountLabel = ({ is_under_150_ami, is_under_80_ami }) => {
  if (is_under_150_ami && !is_under_80_ami) {
    return html`
      <div class="summary-number__detail">Covers up to 50% of costs</div>
      <!-- TODO: tooltip! -->
      <!-- Electrification rebates for your income bracket can be used to cover up to 50% of your total costs. For example, if your total project cost is $10,000, you can receive an electrification rebate of $5,000. -->
    `;
  } else {
    // Covers up to 100% of costs
    // Electrification rebates for your income bracket can be used to cover 100% of your total costs. For example, if your total project cost is $10,000, you can receive an electrification rebate of $10,000.
    return nothing;
  }
};

const summaryTemplate = (results: any) => html`
  <div class="card">
    <div class="card__heading">
      <h1>Your Personalized Incentives</h1>
      These are available to American homeowners and renters over the next 10 years.
    </div>
    <div class="card-content">
      <div class="summary-numbers">
        ${numberTemplate('Upfront Discounts', nearestFifty(results.pos_savings), false, upfrontDiscountLabel(results))}
        <!-- TODO: add disclaimer here about 50 or 100% of costs -->
        ${numberTemplate('Available Tax Credits', nearestFifty(results.tax_savings))}
        <!-- TODO: purple style -->
        ${numberTemplate('Estimated Bill Savings Per Year', nearestFifty(results.estimated_annual_savings), true)}
      </div>
      <div>
        <div class="summary-number--total">
          <div class="summary-number--total__label">Total Incentives <span class="summary-number--total__label__detail">(Estimated)</span></div>
          <div class="summary-number--total__value">$${nearestFifty(results.pos_savings + results.tax_savings).toLocaleString()}<span class="summary-number--total__icon">${lightningBolt()}</span></div>
        </div>
        <p class="summary-number--total__disclaimer">
          Disclaimer: This is an estimate. We do not yet know how or when electrification rebates will be implemented in each state, so we cannot guarantee final amounts or timeline.
        </p>
      </div>
      <!-- TODO: Based on your household income, you may not qualify for tax credits, but you can take full advantage of the electrification rebates. Check out this relevant case study! -->
    </div>
  </div>
`;

const loadedTemplate = (results: any, showDetails: boolean, showSummary: boolean) => html`
    ${showSummary && summaryTemplate(results)}
    ${showDetails && detailsTemplate(results)}
`;

const loadingTemplate = () => html`
  <div class="card card-content">Loading...</div>
`;

const errorTemplate = (error: any) => html`
  <div class="card card-content">${error.message || 'Error loading incentives.'}</div>
`;

const RA_API_BASE: string = 'https://api.rewiringamerica.org';
const CALCULATOR_PATH: string = '/api/v0/calculator';

@customElement('rewiring-america-calculator-result')
export class RewiringAmericaCalculatorResult extends LitElement {
  static styles = [baseStyles, cardStyles, numberStyles, tableStlyes, linkStyles];

  @property({ type: Boolean, attribute: 'show-summary' })
  showSummary: boolean = true;

  @property({ type: Boolean, attribute: 'show-details' })
  showDetails: boolean = true;

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
      ${this._task.render({
      pending: loadingTemplate,
      complete: (results) => loadedTemplate(results, this.showDetails, this.showSummary),
      error: errorTemplate
    })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "rewiring-america-calculator-result": RewiringAmericaCalculatorResult;
  }
}
