import { msg, str } from '@lit/localize';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import shoelaceTheme from 'bundle-text:@shoelace-style/shoelace/dist/themes/light.css';
import { css, unsafeCSS } from 'lit';
import { FC, useEffect, useState } from 'react';
import { APIUtilitiesResponse } from './api/calculator-types-v1';
import { FilingStatus, OwnerStatus } from './calculator-types';
import './currency-input';
import { CurrencyInput } from './currency-input';
import { PROJECTS, Project } from './projects';
import { MultiSelect, OptionParam, Select, selectStyles } from './select';
import { STATES } from './states';
import { inputStyles } from './styles/input';
import { TooltipButton } from './tooltip';

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

  /* To line the button up with the email field when it's present */
  .button-spacer {
    height: 36px;
  }

  @media only screen and (max-width: 640px) {
    .button-spacer {
      height: 0;
    }
  }

  .help-text {
    color: #757575;
    font-size: 0.6875rem;
    line-height: 150%;
    margin: 0.25rem 0.75rem 0 0.75rem;
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

const OWNER_STATUS_OPTIONS: () => OptionParam<OwnerStatus>[] = () => [
  { value: 'homeowner', label: msg('Homeowner') },
  { value: 'renter', label: msg('Renter') },
];

const TAX_FILING_OPTIONS: () => OptionParam<FilingStatus>[] = () => [
  { value: 'single', label: msg('Single') },
  { value: 'joint', label: msg('Married filing jointly') },
  {
    value: 'married_filing_separately',
    label: msg('Married filing separately'),
  },
  { value: 'hoh', label: msg('Head of household') },
];

const HH_SIZES = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
const HOUSEHOLD_SIZE_OPTIONS: () => OptionParam<
  (typeof HH_SIZES)[number]
>[] = () =>
  HH_SIZES.map(count => ({
    label:
      count === '1'
        ? msg('1 person')
        : msg(str`${count} people`, { desc: 'count is greater than 1' }),
    value: count,
  }));

const label = (labelText: string, tooltipText: string, tooltipSize: number) => {
  return (
    <div className="select-label" slot="label">
      {labelText}
      <TooltipButton text={tooltipText} iconSize={tooltipSize} />
    </div>
  );
};

const renderUtilityField = (
  utility: string,
  setUtility: (newValue: string) => void,
  utilitiesFetch: FetchState,
  tooltipSize: number,
) => {
  const labelSlot = label(
    msg('Electric Utility', { desc: 'as in utility company' }),
    msg('Choose the company you pay your electric bill to.'),
    tooltipSize,
  );
  const options: OptionParam<string>[] =
    utilitiesFetch.state === 'complete'
      ? Object.entries(utilitiesFetch.response.utilities).map(([id, info]) => ({
          value: id,
          label: info.name,
        }))
      : [];

  const enterZipToSelect = msg('Enter your ZIP code to select a utility.');
  const helpText =
    utilitiesFetch.state === 'init' || utilitiesFetch.state === 'loading'
      ? enterZipToSelect
      : utilitiesFetch.state === 'complete'
      ? Object.keys(utilitiesFetch.response.utilities).length
        ? enterZipToSelect
        : msg('We don’t have utility data for your area yet.')
      : utilitiesFetch.message;

  return (
    <Select
      id="utility"
      labelSlot={labelSlot}
      placeholder={msg('Select utility')}
      disabled={options.length === 0}
      options={options}
      currentValue={utility}
      onChange={setUtility}
      helpText={helpText}
      loading={utilitiesFetch.state === 'loading'}
    />
  );
};

const renderProjectsField = (
  projects: Project[],
  setProjects: (newProjects: Project[]) => void,
  tooltipSize: number,
) => (
  <MultiSelect
    id="projects"
    labelSlot={label(
      msg('Projects you’re most interested in'),
      msg('Select the projects you’re most interested in.'),
      tooltipSize,
    )}
    options={Object.entries(PROJECTS)
      .map(([value, data]) => ({
        value: value as Project,
        label: data.label(),
        iconURL: data.iconURL,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))}
    currentValues={projects}
    onChange={setProjects}
    placeholder={msg('None selected')}
    maxOptionsVisible={1}
    placement={'top'}
  />
);

const renderEmailField = (email: string, setEmail: (e: string) => void) => (
  <div>
    <label htmlFor="email">
      <div className="select-label">{msg('Email address (optional)')}</div>
    </label>
    <input
      tabIndex={0}
      id="email"
      placeholder={msg('you@example.com', {
        desc: 'example email address',
      })}
      name="email"
      value={email}
      onChange={event => setEmail(event.currentTarget.value)}
      type="email"
      autoComplete="email"
    />
    <div className="help-text">
      {msg(
        'Get updates on incentives, rebates, and more from Rewiring America.',
      )}
    </div>
  </div>
);

type FetchState =
  | {
      state: 'init';
    }
  | {
      state: 'loading';
    }
  | {
      state: 'complete';
      response: APIUtilitiesResponse;
    }
  | {
      state: 'error';
      message: string;
    };

export type FormValues = {
  zip: string;
  ownerStatus: OwnerStatus;
  householdIncome: string;
  householdSize: string;
  taxFiling: FilingStatus;
  utility?: string;
  projects?: Project[];
  email?: string;
};

export const CalculatorForm: FC<{
  initialValues: FormValues;
  showEmailField: boolean;
  showProjectField: boolean;
  utilityFetcher?: (zip: string) => Promise<APIUtilitiesResponse>;
  stateId?: string;
  tooltipSize: number;
  calculateButtonContent: React.ReactElement | string;
  onSubmit: (formValues: FormValues) => void;
  gridClass?: string;
}> = ({
  initialValues,
  showEmailField,
  showProjectField,
  utilityFetcher,
  stateId,
  tooltipSize,
  calculateButtonContent,
  onSubmit,
  gridClass = 'grid-3-2',
}) => {
  const [zip, setZip] = useState(initialValues.zip);
  const [ownerStatus, setOwnerStatus] = useState(initialValues.ownerStatus);
  const [householdIncome, setHouseholdIncome] = useState(
    initialValues.householdIncome,
  );
  const [householdSize, setHouseholdSize] = useState(
    initialValues.householdSize,
  );
  const [taxFiling, setTaxFiling] = useState(initialValues.taxFiling);
  const [utility, setUtility] = useState(initialValues.utility ?? '');
  const [projects, setProjects] = useState(initialValues.projects ?? []);
  const [email, setEmail] = useState(initialValues.email ?? '');

  const [utilitiesFetchState, setUtilitiesFetchState] = useState<FetchState>({
    state: 'init',
  });

  useEffect(() => {
    if (!utilityFetcher || !zip.match(/^\d{5}$/)) {
      return;
    }

    setUtilitiesFetchState({ state: 'loading' });
    utilityFetcher(zip)
      .then(response => {
        // If our "state" attribute is set, enforce that the entered location is
        // in that state.
        if (stateId && stateId !== response.location.state) {
          setUtility('');

          // Throw to put the task into the ERROR state for rendering.
          const stateCodeOrName = STATES[stateId]?.name() ?? stateId;
          throw new Error(
            msg(str`That ZIP code is not in ${stateCodeOrName}.`),
          );
        }

        setUtilitiesFetchState({ state: 'complete', response });

        // Preserve the previous utility selection if it's still available.
        // Select the first option in the list otherwise.
        const keys = Object.keys(response.utilities);
        if (keys.length > 0) {
          if (!keys.includes(utility)) {
            setUtility(keys[0]);
          }
        } else {
          setUtility('');
        }
      })
      .catch(exc =>
        setUtilitiesFetchState({ state: 'error', message: exc.message }),
      );
  }, [stateId, zip]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit({
          zip,
          ownerStatus,
          householdIncome,
          householdSize,
          taxFiling,
          utility,
          projects,
          email,
        });
      }}
    >
      <div className={gridClass}>
        {showProjectField
          ? renderProjectsField(projects, setProjects, tooltipSize)
          : null}
        <Select
          id="owner_status"
          labelSlot={label(
            msg('Rent or own', { desc: 'form field label' }),
            msg('Homeowners and renters qualify for different incentives.'),
            tooltipSize,
          )}
          options={OWNER_STATUS_OPTIONS()}
          currentValue={ownerStatus}
          onChange={v => setOwnerStatus(v as OwnerStatus)}
        />
        <div>
          <label htmlFor="zip">
            {label(
              msg('Zip', { desc: 'as in zip code' }),
              msg(
                'Your zip code helps determine the amount of discounts and tax credits you qualify for.',
              ),
              tooltipSize,
            )}
          </label>

          <input
            tabIndex={0}
            id="zip"
            placeholder="12345"
            name="zip"
            required
            type="text"
            minLength={5}
            maxLength={5}
            inputMode="numeric"
            pattern="[0-9]{5}"
            autoComplete="postal-code"
            value={zip}
            onChange={event => setZip(event.currentTarget.value)}
          />
        </div>
        {utilityFetcher
          ? renderUtilityField(
              utility,
              setUtility,
              utilitiesFetchState,
              tooltipSize,
            )
          : null}
        <div>
          <label htmlFor="household_income">
            {label(
              msg('Household income'),
              msg(
                'Enter your gross income (income before taxes). Include wages and salary plus other forms of income, including pensions, interest, dividends, and rental income. If you are married and file jointly, include your spouse’s income.',
              ),
              tooltipSize,
            )}
          </label>
          <CurrencyInput
            placeholder="$60,000"
            name="household_income"
            required
            min={0}
            max={100000000}
            value={householdIncome}
            onChange={setHouseholdIncome}
          />
        </div>
        <Select
          id="tax_filing"
          labelSlot={label(
            msg('Tax filing', { desc: 'form field label' }),
            msg(
              'Select "Head of Household" if you have a child or relative living with you, and you pay more than half the costs of your home. Select "Joint" if you file your taxes as a married couple.',
            ),
            tooltipSize,
          )}
          options={TAX_FILING_OPTIONS()}
          currentValue={taxFiling}
          onChange={v => setTaxFiling(v as FilingStatus)}
        />
        <Select
          id="household_size"
          labelSlot={label(
            msg('Household size'),
            msg(
              'Include anyone you live with who you claim as a dependent on your taxes, and your spouse or partner if you file taxes together.',
            ),
            tooltipSize,
          )}
          options={HOUSEHOLD_SIZE_OPTIONS()}
          currentValue={householdSize}
          onChange={setHouseholdSize}
        />
        {showEmailField ? renderEmailField(email, setEmail) : null}
        <div className="grid-right-column">
          <div className="button-spacer"></div>
          <button className="primary" type="submit">
            {calculateButtonContent}
          </button>
        </div>
      </div>
    </form>
  );
};
