import { msg, str } from '@lit/localize';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import shoelaceTheme from 'bundle-text:@shoelace-style/shoelace/dist/themes/light.css';
import { TemplateResult, css, html, nothing, unsafeCSS } from 'lit';
import { live } from 'lit/directives/live';
import './currency-input';
import { PROJECTS } from './projects';
import { OptionParam, multiselect, select, selectStyles } from './select';
import { inputStyles } from './styles/input';
import { tooltipButton } from './tooltip';

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

  button.primary:hover,
  button.primary:focus {
    background-color: var(--ra-embed-primary-button-background-hover-color);
  }

  button.text-button {
    appearance: none;
    padding: 0;
    margin: 0;
    outline: 0;
    text-decoration: none;

    border: none;
    border-radius: 0;
    background-color: transparent;
    cursor: pointer;

    color: var(--rewiring-purple);
    font-family: inherit;
    font-size: 1rem;
    font-weight: 500;
    line-height: 125%;
  }

  button.text-button:hover {
    text-decoration: underline;
  }

  .grid-right-column {
    grid-column: -2 / -1;
  }
`;

const tooltipStyles = css`
  ${unsafeCSS(shoelaceTheme)}

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
    pointer-events: auto;
  }

  /* This button is just an icon; make everything else disappear */
  button.tooltip-icon {
    border: 0;
    background-color: transparent;
    padding: 0;

    cursor: pointer;
    vertical-align: middle;
  }
`;

export const formStyles = [
  tooltipStyles,
  inputStyles,
  buttonStyles,
  selectStyles,
];

const OWNER_STATUS_OPTIONS: () => OptionParam[] = () => [
  { value: 'homeowner', label: msg('Homeowner') },
  { value: 'renter', label: msg('Renter') },
];

const TAX_FILING_OPTIONS: () => OptionParam[] = () => [
  { value: 'single', label: msg('Single') },
  { value: 'joint', label: msg('Married filing jointly') },
  {
    value: 'married_filing_separately',
    label: msg('Married filing separately'),
  },
  { value: 'hoh', label: msg('Head of household') },
];

const HOUSEHOLD_SIZE_OPTIONS: () => OptionParam[] = () =>
  [1, 2, 3, 4, 5, 6, 7, 8].map(count => ({
    label:
      count === 1
        ? msg('1 person')
        : msg(str`${count} people`, { desc: 'count is greater than 1' }),
    value: count.toString(),
  }));

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
  return html`
    <div class="select-label" slot="label">
      ${labelText} ${tooltipButton(tooltipText, tooltipSize)}
    </div>
  `;
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
    msg('Projects you’re most interested in'),
    msg('Select the projects you’re most interested in.'),
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
              label: data.label(),
              iconURL: data.iconURL,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
          currentValues: projects,
          placeholder: msg('None selected'),
          maxOptionsVisible: 1,
          placement: 'top',
        })}
      </div>`
    : nothing;

  const emailField = showEmailField
    ? html`<div>
        <label for="email">${msg('Email address (optional)')}</label>
        <input
          tabindex="0"
          id="email"
          placeholder="${msg('you@example.com', {
            desc: 'example email address',
          })}"
          name="email"
          type="email"
          autocomplete="email"
        />
      </div>`
    : nothing;

  const ownersLabelSlot = label(
    msg('Rent or own', { desc: 'form field label' }),
    msg('Homeowners and renters qualify for different incentives.'),
    tooltipSize,
  );

  const taxFilingLabelSlot = label(
    msg('Tax filing', { desc: 'form field label' }),
    msg(
      'Select "Head of Household" if you have a child or relative living with you, and you pay more than half the costs of your home. Select "Joint" if you file your taxes as a married couple.',
    ),
    tooltipSize,
  );

  const householdSizeLabelSlot = label(
    msg('Household size'),
    msg(
      'Include anyone you live with who you claim as a dependent on your taxes, and your spouse or partner if you file taxes together.',
    ),
    tooltipSize,
  );

  return html`
    <form @submit=${onSubmit}>
      <div class="${gridClass}">
        ${projectField}
        <div>
          <label for="zip">
            ${msg('Zip', { desc: 'as in zip code' })}
            ${tooltipButton(
              msg(
                'Your zip code helps determine the amount of discounts and tax credits you qualify for.',
              ),
              tooltipSize,
            )}
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
            options: OWNER_STATUS_OPTIONS(),
            currentValue: ownerStatus,
          })}
        </div>
        <div>
          <label for="household_income">
            ${msg('Household income')}
            ${tooltipButton(
              msg(
                'Enter your gross income (income before taxes). Include wages and salary plus other forms of income, including pensions, interest, dividends, and rental income. If you are married and file jointly, include your spouse’s income.',
              ),
              tooltipSize,
            )}
          </label>

          <ra-currency-input
            placeholder="$60,000"
            name="household_income"
            inputid="household_income"
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
            options: TAX_FILING_OPTIONS(),
            currentValue: taxFiling,
          })}
        </div>
        <div>
          ${select({
            id: 'household_size',
            labelSlot: householdSizeLabelSlot,
            required: true,
            options: HOUSEHOLD_SIZE_OPTIONS(),
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
