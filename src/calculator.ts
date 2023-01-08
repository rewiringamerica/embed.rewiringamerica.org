import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { cardStyles, gridStyles, selectStyles, fontStyles } from './styles.ts';
import './calculator-result'
import { formStyles } from './styles';

const icons = {
  down: (w: number, h: number) => html`<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" style="width: ${w}px; height: ${h}px; opacity: 0.5; fill: currentColor; vertical-align: text-top;">
    <svg viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.90137 1.92651L8.98672 7.62669C9.0241 7.65676 9.07756 7.65605 9.11413 7.62499L15.8241 1.92651" stroke="black" stroke-width="2" stroke-linecap="round"></path>
      <path d="M1.90137 7.67859L8.98672 13.3788C9.0241 13.4088 9.07756 13.4081 9.11413 13.3771L15.8241 7.67859" stroke="black" stroke-width="2" stroke-linecap="round"></path>
    </svg>
  </svg>`
}

@customElement('rewiring-america-calculator')
export class RewiringAmericaCalculator extends LitElement {
  // TODO: shared styles
  static styles = [
    fontStyles,
    cardStyles,
    gridStyles,
    selectStyles,
    formStyles,
  ];

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
            Zip:<br>
            <input id="zip" placeholder="12345" name="zip" required="required" type="text" value="${this.zip}">
          </label>
        </div>
        <div>
          <label for="owner_status">
            Owner status:<br>
            <div class="select">
              <select id="owner_status" placeholder="Owner status..." name="owner_status" required="required">
                <option value="homeowner" ${this.ownerStatus == 'homeowner' && 'selected'}>Homeowner</option>
                <option value="renter" ${this.ownerStatus == 'renter' && 'selected'}>Renter</option>
              </select>
              <span class="focus"></span>
            </div>
          </label>
        </div>
        <div>
          <label for="household_income">
            Household income:<br>
            <input id="household_income" placeholder="50000" name="household_income" required="required" type="text" value="${this.householdIncome}">
          </label>
        </div>
        <div>
          <label for="tax_filing">
            Tax filing:<br>
            <div class="select">
              <select id="tax_filing" placeholder="Tax filing..." name="tax_filing" required="required">
                <option value="single" ${this.taxFiling == 'single' && 'selected'}>Single</option>
                <option value="joint" ${this.taxFiling == 'joint' && 'selected'}>Joint</option>
                <option value="hoh" ${this.taxFiling == 'hoh' && 'selected'}>Head of Household</option>
              </select>
              <span class="focus"></span>
            </div>
          </label>
        </div>
        <div>
          <label for="household_size">
            Household size:<br>
            <div class="select">
              <select id="household_size" placeholder="Household size..." name="household_size" required="required">
                <option value="1" ${this.householdSize == '1' && 'selected'}>1 person</option>
                <option value="2" ${this.householdSize == '2' && 'selected'}>2 people</option>
                <option value="3" ${this.householdSize == '3' && 'selected'}>3 people</option>
                <option value="4" ${this.householdSize == '4' && 'selected'}>4 people</option>
                <option value="5" ${this.householdSize == '5' && 'selected'}>5 people</option>
                <option value="6" ${this.householdSize == '6' && 'selected'}>6 people</option>
                <option value="7" ${this.householdSize == '7' && 'selected'}>7 people</option>
                <option value="8" ${this.householdSize == '8' && 'selected'}>8 people</option>
              </select>
              <span class="focus"></span>
            </div>
          </label>
        </div>
        <div>
          <button type="submit">Calculate! ${icons.down(18, 18)}</button>
        </div>
      </div>
    </form>
  </div>
  <rewiring-america-calculator-result zip="80212" owner-status="homeowner" household-income="60000" tax-filing="single"
  household-size="4"></rewiring-america-calculator-result>
  `
  }
}
