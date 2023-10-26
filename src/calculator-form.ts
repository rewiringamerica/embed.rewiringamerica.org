import { html, css, unsafeCSS, nothing, TemplateResult } from 'lit';
import { live } from 'lit/directives/live';
import { questionIcon } from './icons';
import { select, multiselect, selectStyles, OptionParam } from './select';
import { inputStyles } from './styles/input';
import './currency-input';
import shoelaceTheme from 'bundle-text:@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import { PROJECTS } from './projects';

const buttonStyles = css`
  button.primary {
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

  button.primary:hover {
    background-color: var(--ra-embed-primary-button-background-hover-color);
  }

  .grid-right-column {
    grid-column: -2 / -1;
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
    text-transform: none;
    letter-spacing: normal;
  }

  sl-tooltip::part(body) {
    box-shadow: var(--ra-tooltip-box-shadow);
    border-radius: var(--sl-tooltip-border-radius);
    border: var(--ra-tooltip-border);
  }
`;

const tooltipStyles = css`
  ${unsafeCSS(shoelaceTheme)}
`;

export const formStyles = [
  tooltipStyles,
  inputStyles,
  buttonStyles,
  selectStyles,
];

const OWNER_STATUS_OPTIONS: OptionParam[] = [
  { value: 'homeowner', label: 'Homeowner' },
  { value: 'renter', label: 'Renter' },
];

const TAX_FILING_OPTIONS: OptionParam[] = [
  { value: 'single', label: 'Single' },
  { value: 'joint', label: 'Married filing jointly' },
  { value: 'married_filing_separately', label: 'Married filing separately' },
  { value: 'hoh', label: 'Head of household' },
];

const HOUSEHOLD_SIZE_OPTIONS: OptionParam[] = [1, 2, 3, 4, 5, 6, 7, 8].map(
  count => {
    return {
      label: `${count} ${count === 1 ? 'person' : 'people'}`,
      value: count.toString(),
    } as OptionParam;
  },
);

type FormOptions = {
  showEmailField?: boolean;
  showProjectField: boolean;
  tooltipSize: number;
  calculateButtonContent: TemplateResult;
};

export const label = (
  labelText: string,
  tooltipText: string,
  tooltipSize: number,
) => {
  return html`<label slot="label">
    ${labelText}
    <sl-tooltip content="${tooltipText}" hoist
      >${questionIcon(tooltipSize, tooltipSize)}</sl-tooltip
    >
  </label>`;
};

export const formTemplate = (
  [zip, ownerStatus, householdIncome, taxFiling, householdSize]: Array<string>,
  projects: Array<string>,
  {
    showEmailField,
    showProjectField,
    tooltipSize,
    calculateButtonContent,
  }: FormOptions,
  onSubmit: (e: SubmitEvent) => void,
  gridClass: string = 'grid-3-2',
) => {
  const projectsLabelSlot = label(
    'Projects you’re most interested in',
    'Select the projects you’re most interested in.',
    tooltipSize,
  );

  const projectField = showProjectField
    ? html`<div>
        ${multiselect({
          id: 'projects',
          labelSlot: projectsLabelSlot,
          required: true,
          options: Object.entries(PROJECTS)
            .map(([value, data]) => ({
              value,
              label: data.label,
              iconFileName: data.iconFileName,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
          currentValues: projects,
          placeholder: 'None selected',
          maxOptionsVisible: 1,
          placement: 'top',
          iconPath: '/assets/icons/',
        })}
      </div>`
    : nothing;

  const emailField = showEmailField
    ? html`<div>
        <label for="email"> Email address (optional) </label>
        <input
          tabindex="0"
          id="email"
          placeholder="you@example.com"
          name="email"
          type="email"
          autocomplete="email"
        />
      </div>`
    : nothing;

  const ownersLabelSlot = label(
    'Rent or own',
    'Homeowners and renters qualify for different incentives.',
    tooltipSize,
  );

  const taxFilingLabelSlot = label(
    'Tax filing',
    'Select "Head of Household" if you have a child or relative living with you, and you pay more than half the costs of your home. Select "Joint" if you file your taxes as a married couple.',
    tooltipSize,
  );

  const householdSizeLabelSlot = label(
    'Household size',
    'Include anyone you live with who you claim as a dependent on your taxes, and your spouse or partner if you file taxes together.',
    tooltipSize,
  );

  return html`
    <form @submit=${onSubmit}>
      <div class="${gridClass}">
        ${projectField}
        <div>
          <label for="zip">
            Zip
            <sl-tooltip
              content="Your zip code helps determine the amount of discounts and tax credits you qualify for."
              hoist
              >${questionIcon(tooltipSize, tooltipSize)}</sl-tooltip
            >
          </label>

          <input
            tabindex="0"
            id="zip"
            placeholder="12345"
            name="zip"
            required
            type="text"
            .value=${live(zip)}
            minlength="5"
            maxlength="5"
            inputmode="numeric"
            pattern="[0-9]{5}"
            autocomplete="postal-code"
          />
        </div>
        <div>
          ${select({
            id: 'owner_status',
            labelSlot: ownersLabelSlot,
            required: true,
            options: OWNER_STATUS_OPTIONS,
            currentValue: ownerStatus,
          })}
        </div>
        <div>
          <label for="household_income">
            Household income
            <sl-tooltip
              content="Enter your gross income (income before taxes). Include wages and salary plus other forms of income, including pensions, interest, dividends, and rental income. If you are married and file jointly, include your spouse’s income."
              hoist
              >${questionIcon(tooltipSize, tooltipSize)}</sl-tooltip
            >
          </label>

          <ra-currency-input
            id="household_income"
            placeholder="$60,000"
            name="household_income"
            required
            .value=${live(householdIncome)}
            min="0"
            max="100000000"
            tabindex="-1"
          ></ra-currency-input>
        </div>
        <div>
          ${select({
            id: 'tax_filing',
            labelSlot: taxFilingLabelSlot,
            required: true,
            options: TAX_FILING_OPTIONS,
            currentValue: taxFiling,
          })}
        </div>
        <div>
          ${select({
            id: 'household_size',
            labelSlot: householdSizeLabelSlot,
            required: true,
            options: HOUSEHOLD_SIZE_OPTIONS,
            currentValue: householdSize,
          })}
        </div>
        ${emailField}
        <div class="grid-right-column">
          <button class="primary" type="submit">
            ${calculateButtonContent}
          </button>
        </div>
      </div>
    </form>
  `;
};
