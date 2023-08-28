import { html, css, nothing } from 'lit';
import { downIcon, questionIcon } from './icons';
import { select, selectStyles, OptionParam } from './select';
import { inputStyles } from './styles/input';
import './currency-input';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import { PROJECTS } from './projects';

const buttonStyles = css`
  button.calculate {
    appearance: none;
    font-family: inherit;
    font-size: 16px;
    line-height: 28px;
    padding: 8px;
    background-color: var(--ra-embed-primary-button-background-color);
    border: 1px solid var(--ra-embed-primary-button-background-color);
    border-radius: 4px;
    font-weight: 600;
    margin: 4px 0 0 0;
    cursor: pointer;
    color: var(--ra-embed-primary-button-text-color);
    outline: 0;
    width: 100%;
  }

  button.calculate:hover {
    background-color: var(--ra-embed-primary-button-background-hover-color);
  }

  /* shoelace style overrides */
  sl-tooltip {
    --max-width: var(--ra-tooltip-max-width);
    --sl-tooltip-arrow-size: var(--ra-tooltip-arrow-size);
    --sl-tooltip-padding: var(--ra-tooltip-padding);
    --sl-tooltip-background-color: var(--ra-tooltip-background-color);
    --sl-tooltip-color: var(--ra-tooltip-color);
    --sl-tooltip-border-radius: var(--ra-tooltip-border-radius);
    --sl-tooltip-font-family: var(--ra-embed-font-family);
    --sl-tooltip-font-size: var(--ra-embed-font-size);
    --sl-tooltip-line-height: var(--ra-embed-line-height);
    --sl-tooltip-font-weight: var(--ra-embed-font-weight);
    --sl-z-index-tooltip: 10000;
  }

  sl-tooltip::part(body) {
    box-shadow: var(--ra-tooltip-box-shadow);
    border-radius: var(--sl-tooltip-border-radius);
    border: var(--ra-tooltip-border);
  }
`;

export const formStyles = [inputStyles, buttonStyles, selectStyles];

const OWNER_STATUS_OPTIONS: OptionParam[] = [
  { value: 'homeowner', label: 'Homeowner' },
  { value: 'renter', label: 'Renter' },
];

const TAX_FILING_OPTIONS: OptionParam[] = [
  { value: 'single', label: 'Single' },
  { value: 'joint', label: 'Married Filing Jointly' },
  { value: 'married_filing_separately', label: 'Married Filing Separately' },
  { value: 'hoh', label: 'Head of Household' },
];

const HOUSEHOLD_SIZE_OPTIONS: OptionParam[] = [1, 2, 3, 4, 5, 6, 7, 8].map(
  count => {
    return {
      label: `${count} ${count === 1 ? 'person' : 'people'}`,
      value: count.toString(),
    } as OptionParam;
  },
);

export const utilityFormTemplate = (
  utilityId: string,
  utilityOptions: OptionParam[],
  onChange: (utilityId: string) => void,
) => {
  return html`
    <form>
      <div>
        <label for="utility">
          Electric Utility
          <sl-tooltip
            content="Choose the company you pay your electric bill to."
            hoist
          >
            ${questionIcon(18, 18)}
          </sl-tooltip>
          <br />
          ${select({
            id: 'utility',
            required: true,
            options: utilityOptions,
            currentValue: utilityId,
            tabIndex: 0,
            onChange: event =>
              onChange((event.target as HTMLInputElement).value),
          })}
        </label>
      </div>
    </form>
  `;
};

export const formTemplate = (
  [
    project,
    zip,
    ownerStatus,
    householdIncome,
    taxFiling,
    householdSize,
  ]: Array<string>,
  showProjectField: boolean,
  onZipChange: (e: InputEvent) => void,
  onSubmit: (e: SubmitEvent) => void,
) => {
  const projectField = showProjectField
    ? html`<div>
        <label for="project">
          Project you're most interested in
          <sl-tooltip
            content="Select the project you're most interested in."
            hoist
            >${questionIcon(18, 18)}</sl-tooltip
          ><br />
          ${select({
            id: 'project',
            required: true,
            options: Object.entries(PROJECTS)
              .map(([value, data]) => ({ value, label: data.label }))
              .sort((a, b) => a.label.localeCompare(b.label)),
            currentValue: project,
            tabIndex: 0,
          })}
        </label>
      </div> `
    : nothing;

  return html`
    <form @submit=${onSubmit}>
      <div class="grid-3-2">
        ${projectField}
        <div>
          <label for="zip">
            Zip
            <sl-tooltip
              content="Your zip code helps determine the amount of discounts and tax credits you qualify for."
              hoist
              >${questionIcon(18, 18)}</sl-tooltip
            ><br />
            <input
              tabindex="0"
              id="zip"
              placeholder="12345"
              name="zip"
              required
              type="text"
              value="${zip}"
              minlength="5"
              maxlength="5"
              inputmode="numeric"
              pattern="[0-9]{5}"
              @change=${onZipChange}
            />
          </label>
        </div>
        <div>
          <label for="owner_status">
            Homeowners Status
            <sl-tooltip
              content="Homeowners and renters qualify for different incentives."
              hoist
              >${questionIcon(18, 18)}</sl-tooltip
            ><br />
            ${select({
              id: 'owner_status',
              required: true,
              options: OWNER_STATUS_OPTIONS,
              currentValue: ownerStatus,
              tabIndex: 0,
            })}
          </label>
        </div>
        <div>
          <label for="household_income">
            Household Income
            <sl-tooltip
              content="Enter your gross income (income before taxes). Include wages and salary plus other forms of income, including pensions, interest, dividends, and rental income. If you are married and file jointly, include your spouse's income"
              hoist
              >${questionIcon(18, 18)}</sl-tooltip
            ><br />
            <ra-currency-input
              id="household_income"
              placeholder="$60,000"
              name="household_income"
              required
              value=${householdIncome}
              min="0"
              max="100000000"
            ></ra-currency-input>
          </label>
        </div>
        <div>
          <label for="tax_filing">
            Tax Filing
            <sl-tooltip hoist
              ><div slot="content">
                Select "Head of Household" if you have a child or relative
                living with you, and you pay more than half the costs of your
                home. Select "Joint" if you file your taxes as a married
                couple."
              </div>
              ${questionIcon(18, 18)}</sl-tooltip
            ><br />
            ${select({
              id: 'tax_filing',
              required: true,
              options: TAX_FILING_OPTIONS,
              currentValue: taxFiling,
              tabIndex: 0,
            })}
          </label>
        </div>
        <div>
          <label for="household_size">
            Household Size
            <sl-tooltip
              content="Include anyone you live with who you claim as a dependent on your taxes, and your spouse or partner if you file taxes together."
              hoist
              >${questionIcon(18, 18)}</sl-tooltip
            ><br />
            ${select({
              id: 'household_size',
              required: true,
              options: HOUSEHOLD_SIZE_OPTIONS,
              currentValue: householdSize,
              tabIndex: 0,
            })}
          </label>
        </div>
        <div>
          <button class="calculate" type="submit">
            Calculate! ${downIcon(18, 18)}
          </button>
        </div>
      </div>
    </form>
  `;
};
