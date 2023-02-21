import { html, css } from 'lit';
import { tooltip, tooltipStyles } from './tooltip';
import { downIcon } from './icons';
import { select, selectStyles, OptionParam } from './select';

const inputStyles = css`
/* TODO: use a CSS reset? */
button {
  appearance: none;
  border: none;
  padding: 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  outline: 0;
}

input {
  padding: 8px;
  font-size: 16px;
  line-height: 28px;
  border: var(--input-border);
  border-radius: 4px;
  width: 100%;
  margin-top: 4px;
  margin-left: 0;
  margin-right: 0;
}

input:focus {
  box-shadow: 0 0 0 2px var(--select-focus) inset;
  outline: none;
}

button {
  padding: 8px;
  font-size: 16px;
  line-height: 28px;
  background-color: var(--ra-embed-primary-button-background-color);
  border: 1px solid var(--ra-embed-primary-button-background-color);
  border-radius: 4px;
  font-weight: 600;
  margin-top: 4px;
  cursor: pointer;
  color: var(--ra-embed-primary-button-text-color);
}

button:hover {
  background-color: var(--ra-embed-primary-button-background-hover-color);
}
`;

export const formStyles = [inputStyles, selectStyles, tooltipStyles];

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

export const formTemplate = ([zip,
  ownerStatus,
  householdIncome,
  taxFiling,
  householdSize]: Array<string>, onSubmit: Function) => html`
<div class="card card-content">
  <h1>How much money will you get with the Inflation Reduction Act?</h1>
  <form @submit=${onSubmit}>
    <div class="grid-3-2">
      <div>
        <label for="zip">
          Zip ${tooltip('Your zip code helps determine the amount of discounts and tax credits you qualify for.', 18, 18)}<br>
          <input tabindex="0" id="zip" placeholder="12345" name="zip" required type="text" value="${zip}" minlength="5" maxlength="5" inputmode="numeric" pattern="[0-9]{5}">
        </label>
      </div>
      <div>
        <label for="owner_status">
          Homeowners Status ${tooltip('Homeowners and renters qualify for different incentives.', 18, 18, 'middle')}<br>
          ${select({ id: 'owner_status', required: true, options: OWNER_STATUS_OPTIONS, currentValue: ownerStatus, tabIndex: 0 })}
        </label>
      </div>
      <div>
        <label for="household_income">
          Household Income ${tooltip('Enter your gross income (income before taxes). Include wages and salary plus other forms of income, including pensions, interest, dividends, and rental income. If you are married and file jointly, include your spouse\'s income', 18, 18, 'right')}<br>
          <input tabindex="0" id="household_income" placeholder="50000" name="household_income" required type="text" value="${householdIncome}" minlength="1" maxlength="9" inputmode="numeric" pattern="([1-9][0-9]*|0)">
        </label>
      </div>
      <div>
        <label for="tax_filing">
          Tax Filing ${tooltip('Select "Head of Household" if you have a child or relative living with you, and you pay more than half the costs of your home. Select "Joint" if you file your taxes as a married couple.', 18, 18)}<br>
          ${select({ id: 'tax_filing', required: true, options: TAX_FILING_OPTIONS, currentValue: taxFiling, tabIndex: 0 })}
        </label>
      </div>
      <div>
        <label for="household_size">
          Household Size ${tooltip('Include anyone you live with who you claim as a dependent on your taxes, and your spouse or partner if you file taxes together.', 18, 18, 'middle')}<br>
          ${select({ id: 'household_size', required: true, options: HOUSEHOLD_SIZE_OPTIONS, currentValue: householdSize, tabIndex: 0 })}
        </label>
      </div>
      <div>
        <button type="submit">Calculate! ${downIcon(18, 18)}</button>
      </div>
    </div>
  </form>
</div>
`;
