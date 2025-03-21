import { css } from 'lit';
import { FC, useState } from 'react';
import { FilingStatus, OwnerStatus } from './calculator-types';
import { CurrencyInput } from './currency-input';
import { DownIcon } from './icons';
import { OptionParam, Select } from './select';
import { TooltipButton } from './tooltip';

export const buttonStyles = css`
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
`;

const OWNER_STATUS_OPTIONS: () => OptionParam<OwnerStatus>[] = () => [
  { value: 'homeowner', label: 'Homeowner' },
  { value: 'renter', label: 'Renter' },
];

const TAX_FILING_OPTIONS: () => OptionParam<FilingStatus>[] = () => [
  { value: 'single', label: 'Single' },
  { value: 'joint', label: 'Married filing jointly' },
  {
    value: 'married_filing_separately',
    label: 'Married filing separately',
  },
  { value: 'hoh', label: 'Head of household' },
];

const HH_SIZES = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
const HOUSEHOLD_SIZE_OPTIONS: () => OptionParam<
  (typeof HH_SIZES)[number]
>[] = () =>
  HH_SIZES.map(count => ({
    label: count === '1' ? '1 person' : `${count} people`,
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

export type FormValues = {
  zip: string;
  ownerStatus: OwnerStatus;
  householdIncome: string;
  householdSize: string;
  taxFiling: FilingStatus;
};

export const CalculatorForm: FC<{
  initialValues: FormValues;
  tooltipSize: number;
  onSubmit: (formValues: FormValues) => void;
}> = ({ initialValues, tooltipSize, onSubmit }) => {
  const [zip, setZip] = useState(initialValues.zip);
  const [ownerStatus, setOwnerStatus] = useState(initialValues.ownerStatus);
  const [householdIncome, setHouseholdIncome] = useState(
    initialValues.householdIncome,
  );
  const [householdSize, setHouseholdSize] = useState(
    initialValues.householdSize,
  );
  const [taxFiling, setTaxFiling] = useState(initialValues.taxFiling);
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
        });
      }}
    >
      <div className="grid-3-2">
        <Select
          id="owner_status"
          labelSlot={label(
            'Rent or own',
            'Homeowners and renters qualify for different incentives.',
            tooltipSize,
          )}
          options={OWNER_STATUS_OPTIONS()}
          currentValue={ownerStatus}
          onChange={v => setOwnerStatus(v as OwnerStatus)}
        />
        <div>
          <label htmlFor="zip">
            {label(
              'ZIP',
              'Your ZIP code helps determine the amount of discounts and tax credits you qualify for.',
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
        <div>
          <label htmlFor="household_income">
            {label(
              'Household income',
              'Enter your gross income (income before taxes). Include wages and salary plus other forms of income, including pensions, interest, dividends, and rental income. If you are married and file jointly, include your spouse’s income.',
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
            'Tax filing',
            'Select "Head of Household" if you have a child or relative living with you, and you pay more than half the costs of your home. Select "Joint" if you file your taxes as a married couple.',
            tooltipSize,
          )}
          options={TAX_FILING_OPTIONS()}
          currentValue={taxFiling}
          onChange={v => setTaxFiling(v as FilingStatus)}
        />
        <Select
          id="household_size"
          labelSlot={label(
            'Household size',
            'Include anyone you live with who you claim as a dependent on your taxes, and your spouse or partner if you file taxes together.',
            tooltipSize,
          )}
          options={HOUSEHOLD_SIZE_OPTIONS()}
          currentValue={householdSize}
          onChange={setHouseholdSize}
        />
        <div>
          <button className="primary" type="submit">
            Calculate! <DownIcon w={18} h={18} />
          </button>
        </div>
      </div>
    </form>
  );
};
