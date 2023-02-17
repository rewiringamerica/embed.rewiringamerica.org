import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles, cardStyles, gridStyles } from './styles';
import { tooltip, tooltipStyles } from './components/tooltip';
import { downIcon } from './components/icons';
import { select, selectStyles, OptionParam } from './components/forms/select';
import { formStyles } from './styles';
import './calculator-result'

const OWNER_STATUS_OPTIONS: OptionParam[] = [
  { value: 'homeowner', label: 'Homeowner' },
  { value: 'renter', label: 'Renter' },
];

const TAX_FILING_OPTIONS: OptionParam[] = [
  { value: 'single', label: 'Single' },
  { value: 'joint', label: 'Joint' },
  { value: 'hoh', label: 'Head of Household' }
];

const HOUSEHOLD_SIZE_OPTIONS: OptionParam[] = [1, 2, 3, 4, 5, 6, 7, 8].map(count => {
  return {
    label: `${count} ${count == 1 ? 'person' : 'people'}`,
    value: count.toString()
  } as OptionParam
});

const formTemplate = (calculator: RewiringAmericaCalculator) => html`
<div class="card card-content">
  <h1>How much money will you get with the Inflation Reduction Act?</h1>
  <form @submit=${calculator.submit}>
    <div class="grid-3-2">
      <div>
        <label for="zip">
          Zip ${tooltip('Your zip code helps determine the amount of discounts and tax credits you qualify for.', 18, 18)}<br>
          <input tabindex="0" id="zip" placeholder="12345" name="zip" required type="text" value="${calculator.zip}" minlength="5" maxlength="5" inputmode="numeric" pattern="[0-9]{5}">
        </label>
      </div>
      <div>
        <label for="owner_status">
          Homeowners Status ${tooltip('Homeowners and renters qualify for different incentives.', 18, 18, 'middle')}<br>
          ${select({ id: 'owner_status', required: true, options: OWNER_STATUS_OPTIONS, currentValue: calculator.ownerStatus, tabIndex: 0 })}
        </label>
      </div>
      <div>
        <label for="household_income">
          Household Income ${tooltip('Enter your gross income (income before taxes). Include wages and salary plus other forms of income, including pensions, interest, dividends, and rental income. If you are married and file jointly, include your spouse\'s income', 18, 18, 'right')}<br>
          <input tabindex="0" id="household_income" placeholder="50000" name="household_income" required type="text" value="${calculator.householdIncome}" minlength="1" maxlength="9" inputmode="numeric" pattern="([1-9][0-9]*|0)">
        </label>
      </div>
      <div>
        <label for="tax_filing">
          Tax Filing ${tooltip('Select "Head of Household" if you have a child or relative living with you, and you pay more than half the costs of your home. Select "Joint" if you file your taxes as a married couple.', 18, 18)}<br>
          ${select({ id: 'tax_filing', required: true, options: TAX_FILING_OPTIONS, currentValue: calculator.taxFiling, tabIndex: 0 })}
        </label>
      </div>
      <div>
        <label for="household_size">
          Household Size ${tooltip('Include anyone you live with who you claim as a dependent on your taxes, and your spouse or partner if you file taxes together.', 18, 18, 'middle')}<br>
          ${select({ id: 'household_size', required: true, options: HOUSEHOLD_SIZE_OPTIONS, currentValue: calculator.householdSize, tabIndex: 0 })}
        </label>
      </div>
      <div>
        <button type="submit">Calculate! ${downIcon(18, 18)}</button>
      </div>
    </div>
  </form>
</div>
`;

@customElement('rewiring-america-calculator')
export class RewiringAmericaCalculator extends LitElement {
  static styles = [
    baseStyles,
    cardStyles,
    gridStyles,
    selectStyles,
    formStyles,
    tooltipStyles,
  ];

  @property({ type: Boolean, attribute: 'show-form' })
  showForm: boolean = true;

  @property({ type: Boolean, attribute: 'show-summary' })
  showSummary: boolean = true;

  @property({ type: Boolean, attribute: 'show-details' })
  showDetails: boolean = true;

  @property({ type: String, attribute: 'api-key' })
  apiKey: string = '';

  @property({ type: String, attribute: 'zip' })
  zip: string = '';

  @property({ type: String, attribute: 'owner-status' })
  ownerStatus: string = 'homeowner';

  @property({ type: String, attribute: 'household-income' })
  householdIncome: string = '';

  @property({ type: String, attribute: 'tax-filing' })
  taxFiling: string = 'single';

  @property({ type: String, attribute: 'household-size' })
  householdSize: string = '1';

  submit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    this.zip = formData.get('zip') as string || '';
    this.ownerStatus = formData.get('owner_status') as string || '';
    this.householdIncome = formData.get('household_income') as string || '';
    this.taxFiling = formData.get('tax_filing') as string || '';
    this.householdSize = formData.get('household_size') as string || '';
  }

  get showResult() {
    return (this.zip && this.ownerStatus && this.taxFiling && this.householdIncome && this.householdSize);
  }

  override render() {
    return html`
  ${this.showForm && formTemplate(this)}
  ${this.showResult && html`
    <rewiring-america-calculator-result
      show-summary=${this.showSummary}
      show-details=${this.showDetails}
      api-key="${this.apiKey}"
      zip="${this.zip}"
      owner-status="${this.ownerStatus}"
      household-income="${this.householdIncome}"
      tax-filing="${this.taxFiling}"
      household-size="${this.householdSize}">
    </rewiring-america-calculator-result>
  `}
  <div class="footer">
    <p>Calculator by <a href="https://www.rewiringamerica.org">Rewiring America</a> • <a href="https://content.rewiringamerica.org/view/privacy-policy.pdf">Privacy Policy</a> • <a href="https://content.rewiringamerica.org/api/terms.pdf">Terms</a></p>
  </div>
  `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "rewiring-america-calculator": RewiringAmericaCalculator;
  }
}
