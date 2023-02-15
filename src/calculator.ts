import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { baseStyles, cardStyles, gridStyles, selectStyles, tooltipStyles } from './styles.ts';
import './calculator-result'
import { formStyles } from './styles';

const icons = {
  // FIXME: does this need to be nested like this?
  down: (w: number, h: number) => html`<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" style="width: ${w}px; height: ${h}px; opacity: 0.5; fill: currentColor; vertical-align: text-top;">
    <svg viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.90137 1.92651L8.98672 7.62669C9.0241 7.65676 9.07756 7.65605 9.11413 7.62499L15.8241 1.92651" stroke="black" stroke-width="2" stroke-linecap="round"></path>
      <path d="M1.90137 7.67859L8.98672 13.3788C9.0241 13.4088 9.07756 13.4081 9.11413 13.3771L15.8241 7.67859" stroke="black" stroke-width="2" stroke-linecap="round"></path>
    </svg>
  </svg>`,
  question: (w: number, h: number) => html`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" opacity="0.5" style="vertical-align:text-top;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>`
}

interface OptionParam {
  label: string,
  value: string
}

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

const option = ({ label, value }: OptionParam, selected: boolean) => html`
  <option value="${value}" ${selected && 'selected'}>${label}</option>
`;

interface SelectParam {
  id: string;
  placeholder: string;
  required: boolean;
  options: OptionParam[];
  currentValue: string;
}

const select = ({
  id,
  placeholder,
  required,
  options,
  currentValue
}: SelectParam) => {
  return html`
    <div class="select">
      <select id="${id}" placeholder="${placeholder}" name="${id}" ${required && 'required'}>
        ${options.map(o => option(o, o.value == currentValue))}
      </select>
      <span class="focus"></span>
    </div>
  `;
};

// TODO: maybe more like https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role ?
const tooltip = (text: string, w: number, h: number, align: string = 'left') => html`
  <span data-tooltip="${text}" data-tooltip-align="${align}">${icons.question(w, h)}</span>
`;

@customElement('rewiring-america-calculator')
export class RewiringAmericaCalculator extends LitElement {
  // TODO: shared styles
  static styles = [
    baseStyles,
    cardStyles,
    gridStyles,
    selectStyles,
    formStyles,
    tooltipStyles,
  ];

  @property({ type: String, attribute: 'api-key' })
  apiKey: string = '';

  @state()
  zip: string = '';

  @state()
  ownerStatus: string = '';

  @state()
  householdIncome: string = '';

  @state()
  taxFiling: string = '';

  @state()
  householdSize: string = '';

  override render() {
    return html`
    <div class="card">
      <h1>How much money will you get with the Inflation Reduction Act?</h1>
      <form>
      <div class="grid-3-2">
        <div>
          <label for="zip">
            Zip ${tooltip('Your zip code helps determine the amount of discounts and tax credits you qualify for.', 18, 18)}<br>
            <input id="zip" placeholder="12345" name="zip" required="required" type="text" value="${this.zip}">
          </label>
        </div>
        <div>
          <label for="owner_status">
            Homeowners Status ${tooltip('Homeowners and renters qualify for different incentives.', 18, 18, 'middle')}<br>
            ${select({ id: 'owner_status', placeholder: 'Owner status...', required: true, options: OWNER_STATUS_OPTIONS, currentValue: this.ownerStatus })}
          </label>
        </div>
        <div>
          <label for="household_income">
            Household Income ${tooltip('Enter your gross income (income before taxes). Include wages and salary plus other forms of income, including pensions, interest, dividends, and rental income. If you are married and file jointly, include your spouse\'s income', 18, 18, 'right')}<br>
            <input id="household_income" placeholder="50000" name="household_income" required="required" type="text" value="${this.householdIncome}">
          </label>
        </div>
        <div>
          <label for="tax_filing">
            Tax Filing ${tooltip('Select "Head of Household" if you have a child or relative living with you, and you pay more than half the costs of your home. Select "Joint" if you file your taxes as a married couple.', 18, 18)}<br>
            ${select({ id: 'tax_filing', placeholder: 'Tax filing...', required: true, options: TAX_FILING_OPTIONS, currentValue: this.taxFiling })}
          </label>
        </div>
        <div>
          <label for="household_size">
            Household Size ${tooltip('Include anyone you live with who you claim as a dependent on your taxes, and your spouse or partner if you file taxes together.', 18, 18, 'middle')}<br>
            ${select({ id: 'household_size', placeholder: 'Household size...', required: true, options: HOUSEHOLD_SIZE_OPTIONS, currentValue: this.householdSize })}
          </label>
        </div>
        <div>
          <button type="submit">Calculate! ${icons.down(18, 18)}</button>
        </div>
      </div>
    </form>
  </div>
  ${(this.zip && this.ownerStatus && this.taxFiling && this.householdIncome && this.householdSize) && html`
    <rewiring-america-calculator-result
      api-key="${this.apiKey}"
      zip="${this.zip}"
      owner-status="${this.ownerStatus}"
      household-income="${this.householdIncome}"
      tax-filing="${this.taxFiling}"
      household-size="4">
    </rewiring-america-calculator-result>
  `}
  `
  }
}
