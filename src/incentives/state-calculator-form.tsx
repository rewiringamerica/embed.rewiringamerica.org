import AutoNumeric from 'autonumeric';
import { FC, useEffect, useState } from 'react';
import {
  APIUtilitiesResponse,
  FilingStatus,
  OwnerStatus,
} from '../api/calculator-types-v1';
import { FetchState } from '../api/fetch-state';
import { PrimaryButton } from '../components/buttons';
import { CurrencyInput } from '../components/currency-input';
import { FormLabel } from '../components/form-label';
import { Option, Select, labelForValue } from '../components/select';
import { Spinner } from '../components/spinner';
import { TextInput } from '../components/text-input';
import { MsgFn } from '../i18n/msg';
import { str } from '../i18n/str';
import { useTranslated } from '../i18n/use-translated';
import { STATES } from '../states';

const OWNER_STATUS_OPTIONS: (msg: MsgFn) => Option<OwnerStatus>[] = msg => [
  { value: 'homeowner', label: msg('Homeowner') },
  { value: 'renter', label: msg('Renter') },
];

const TAX_FILING_OPTIONS: (msg: MsgFn) => Option<FilingStatus>[] = msg => [
  { value: 'single', label: msg('Single') },
  { value: 'joint', label: msg('Married filing jointly') },
  {
    value: 'married_filing_separately',
    label: msg('Married filing separately'),
  },
  { value: 'hoh', label: msg('Head of household') },
];

const HH_SIZES = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
const HOUSEHOLD_SIZE_OPTIONS: (
  msg: MsgFn,
) => Option<(typeof HH_SIZES)[number]>[] = msg =>
  HH_SIZES.map(count => ({
    label:
      count === '1'
        ? msg('1 person')
        : msg(str`${count} people`, { desc: 'count is greater than 1' }),
    value: count,
  }));

export const NO_GAS_UTILITY_ID = 'no-gas';
export const DELIVERED_FUEL_UTILITY_ID = 'delivered';
export const OTHER_UTILITY_ID = 'other';

const SPECIAL_GAS_UTILITY_IDS = [
  OTHER_UTILITY_ID,
  DELIVERED_FUEL_UTILITY_ID,
  NO_GAS_UTILITY_ID,
];

function getElectricOptions(
  utilitiesFetch: FetchState<APIUtilitiesResponse>,
  msg: MsgFn,
): Option<string>[] {
  return utilitiesFetch.state === 'complete'
    ? Object.entries(utilitiesFetch.response.utilities)
        .map(([id, info]) => ({ value: id, label: info.name }))
        .concat([{ value: OTHER_UTILITY_ID, label: msg('Other') }])
    : [];
}

function getGasOptions(
  utilitiesFetch: FetchState<APIUtilitiesResponse>,
  msg: MsgFn,
): Option<string>[] | null {
  const gasResponse =
    utilitiesFetch.state === 'complete'
      ? utilitiesFetch.response
      : utilitiesFetch.state === 'loading'
      ? utilitiesFetch.previousResponse
      : null;

  if (gasResponse?.gas_utility_affects_incentives) {
    return Object.entries(gasResponse.gas_utilities || {})
      .map(([id, info]) => ({ value: id, label: info.name }))
      .concat([
        {
          value: DELIVERED_FUEL_UTILITY_ID,
          label: msg('Delivered propane or fuel oil'),
        },
        { value: NO_GAS_UTILITY_ID, label: msg('No gas service') },
        { value: OTHER_UTILITY_ID, label: msg('Other') },
      ]);
  } else {
    return null;
  }
}

const renderUtilityFields = (
  utility: string,
  setUtility: (newValue: string) => void,
  gasUtility: string,
  setGasUtility: (newValue: string) => void,
  utilitiesFetch: FetchState<APIUtilitiesResponse>,
  msg: MsgFn,
  showAddressField?: boolean,
) => {
  const options: Option<string>[] = getElectricOptions(utilitiesFetch, msg);
  const enterAddressToSelect = msg('Enter your address to select a utility.');
  const enterZipToSelect = msg('Enter your ZIP code to select a utility.');
  const enterLocationToSelect = showAddressField
    ? enterAddressToSelect
    : enterZipToSelect;

  const helpText =
    utilitiesFetch.state === 'init'
      ? enterLocationToSelect
      : utilitiesFetch.state === 'loading'
      ? ' ' // Empty help text, but maintain vertical space
      : utilitiesFetch.state === 'complete'
      ? Object.keys(utilitiesFetch.response.utilities).length
        ? utility === OTHER_UTILITY_ID
          ? msg('Continue to see other incentives.')
          : ' '
        : msg('We don’t have utility data for your area yet.')
      : utilitiesFetch.message;

  const electricSelector = (
    <Select
      id="utility"
      labelText={msg('Electric utility', { desc: 'as in utility company' })}
      tooltipText={msg('Choose the company you pay your electric bill to.')}
      placeholder={msg('Select utility')}
      disabled={options.length === 0}
      options={options}
      currentValue={utility}
      onChange={setUtility}
      helpText={helpText}
      loading={utilitiesFetch.state === 'loading'}
    />
  );

  let gasSelector = null;
  const gasOptions = getGasOptions(utilitiesFetch, msg);

  // Show the gas utility selector if and only if the choice is relevant to
  // incentive eligibility. Even if the map of gas utilities is empty, we need
  // to show the selector to allow the user to distinguish between actually
  // having no gas service, and having gas service that's not listed here
  // (indicated by the Other item).
  if (gasOptions) {
    gasSelector = (
      <Select
        id="gas_utility"
        labelText={msg('Gas utility', { desc: 'as in utility company' })}
        tooltipText={msg('Choose the company you pay your gas bill to.')}
        placeholder={msg('Select utility')}
        disabled={
          gasOptions.length === 0 || utilitiesFetch.state !== 'complete'
        }
        options={gasOptions}
        currentValue={gasUtility}
        onChange={setGasUtility}
      />
    );
  }

  return (
    <>
      {electricSelector}
      {gasSelector}
    </>
  );
};

const renderEmailField = (
  emailRequired: boolean,
  email: string,
  setEmail: (e: string) => void,
  msg: MsgFn,
) => (
  <div>
    <FormLabel>
      <label htmlFor="email">
        {emailRequired ? msg('Email address') : msg('Email address (optional)')}
      </label>
    </FormLabel>
    <TextInput
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
      required={emailRequired}
    />
    <div className="mt-1 mx-3 text-color-text-secondary text-xsm leading-normal">
      <slot name="email-helper">
        {msg('By sharing your email, you agree to our', {
          desc: 'will be followed by "terms", as in terms of service',
        })}{' '}
        <a
          className="text-color-action-primary font-medium"
          href="https://www.rewiringamerica.org/terms"
          target="_blank"
        >
          {msg('terms')}
        </a>{' '}
        {msg('and to receive updates from Rewiring America.')}{' '}
        {msg('We’ll store and protect your data in accordance with our', {
          desc: 'will be followed by "privacy policy"',
        })}{' '}
        <a
          className="text-color-action-primary font-medium"
          href="https://www.rewiringamerica.org/privacy-policy"
          target="_blank"
        >
          {msg('privacy policy')}
        </a>
        .
      </slot>
    </div>
  </div>
);

export type FormValues = {
  address?: string;
  zip?: string;
  ownerStatus: OwnerStatus;
  householdIncome: string;
  householdSize: string;
  taxFiling: FilingStatus;
  utility?: string;
  gasUtility?: string;
  email?: string;
};

export type FormLabels = { [k in keyof FormValues]: string };

export const CalculatorForm: FC<{
  initialValues: FormValues;
  showAddressField?: boolean;
  showEmailField: boolean;
  emailRequired: boolean;
  loading: boolean;
  errorMessage: string | null;
  utilityFetcher: (
    zipOrAddress: string | undefined,
  ) => Promise<APIUtilitiesResponse>;
  stateId?: string;
  onSubmit: (values: FormValues, labels: FormLabels) => void;
}> = ({
  initialValues,
  showAddressField,
  showEmailField,
  emailRequired,
  loading,
  errorMessage,
  utilityFetcher,
  stateId,
  onSubmit,
}) => {
  const { msg } = useTranslated();

  const [address, setAddress] = useState(initialValues.address ?? '');
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
  const [gasUtility, setGasUtility] = useState(initialValues.gasUtility ?? '');
  const [email, setEmail] = useState(initialValues.email ?? '');

  const [utilitiesFetchState, setUtilitiesFetchState] = useState<
    FetchState<APIUtilitiesResponse>
  >({
    state: 'init',
  });

  const fetchUtility = (zipOrAddress: string | undefined) => {
    if (!zipOrAddress) {
      return;
    }

    setUtilitiesFetchState(prev => ({
      state: 'loading',
      previousResponse: prev.state === 'complete' ? prev.response : undefined,
    }));

    utilityFetcher(zipOrAddress)
      .then(response => {
        // If our "state" attribute is set, enforce that the entered location is
        // in that state.
        if (stateId && stateId !== response.location.state) {
          setUtility('');
          setGasUtility('');

          // Throw to put the task into the ERROR state for rendering.
          const stateCodeOrName = STATES[stateId]?.name(msg) ?? stateId;
          throw new Error(
            msg(str`That ZIP code is not in ${stateCodeOrName}.`),
          );
        }

        setUtilitiesFetchState({ state: 'complete', response });

        // Preserve the previous utility selection if it's still available.
        // Select the first option in the list otherwise.
        const keys = Object.keys(response.utilities);
        if (keys.length > 0) {
          if (!keys.includes(utility) && utility !== OTHER_UTILITY_ID) {
            setUtility(keys[0]);
          }
        } else {
          setUtility(OTHER_UTILITY_ID);
        }

        const gasKeys = Object.keys(response.gas_utilities || {});
        if (gasKeys.length > 0) {
          if (
            !gasKeys.includes(gasUtility) &&
            !SPECIAL_GAS_UTILITY_IDS.includes(gasUtility)
          ) {
            setGasUtility(gasKeys[0]);
          }
        } else {
          // If there are no gas utilities, choose the "no gas service" option.
          setGasUtility(NO_GAS_UTILITY_ID);
        }
      })
      .catch(exc =>
        setUtilitiesFetchState({ state: 'error', message: exc.message }),
      );
  };

  useEffect(() => {
    if (!utilityFetcher) {
      return;
    }

    if (!showAddressField && (!zip || !zip.match(/^\d{5}$/))) {
      return;
    }

    if (showAddressField && address) {
      if (!address.slice(-5).match(/^\d{5}$/)) {
        return;
      }
    }

    fetchUtility(showAddressField ? address : zip);
  }, [address, stateId, zip]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const values: FormValues = {
          ...(showAddressField ? { address } : { zip }),
          ownerStatus,
          householdIncome,
          householdSize,
          taxFiling,
          utility,
          gasUtility,
          email,
        };

        const gasOptions = getGasOptions(utilitiesFetchState, msg);
        const labels: FormLabels = {
          ...(showAddressField ? { address } : { zip }),
          householdIncome: AutoNumeric.format(householdIncome, {
            ...AutoNumeric.getPredefinedOptions().NorthAmerican,
            decimalPlaces: 0,
          }),
          householdSize: labelForValue(
            HOUSEHOLD_SIZE_OPTIONS(msg),
            householdSize,
          )!,
          taxFiling: labelForValue(TAX_FILING_OPTIONS(msg), taxFiling)!,
          ownerStatus: labelForValue(OWNER_STATUS_OPTIONS(msg), ownerStatus)!,
          utility: labelForValue(
            getElectricOptions(utilitiesFetchState, msg),
            utility,
          ),
          gasUtility: gasOptions
            ? labelForValue(gasOptions, gasUtility)
            : undefined,
        };

        onSubmit(values, labels);
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <Select
          id="owner_status"
          labelText={msg('Rent or own', { desc: 'form field label' })}
          tooltipText={msg(
            'Homeowners and renters qualify for different incentives.',
          )}
          options={OWNER_STATUS_OPTIONS(msg)}
          currentValue={ownerStatus}
          onChange={v => setOwnerStatus(v as OwnerStatus)}
        />
        <div>
          {showAddressField ? (
            <FormLabel
              tooltipText={msg(
                'Your address helps determine the amount of discounts and tax credits you qualify for.',
              )}
            >
              <label htmlFor="address">{msg('Address')}</label>
            </FormLabel>
          ) : (
            <FormLabel
              tooltipText={msg(
                'Your ZIP code helps determine the amount of discounts and tax credits you qualify for.',
              )}
            >
              <label htmlFor="zip">
                {msg('ZIP', { desc: 'as in ZIP code' })}
              </label>
            </FormLabel>
          )}
          {showAddressField ? (
            <TextInput
              tabIndex={0}
              id="address"
              placeholder="1 Main St, 12345"
              name="address"
              required
              type="text"
              minLength={5}
              inputMode="text"
              autoComplete="street-address"
              value={address}
              onChange={event => setAddress(event.currentTarget.value)}
              onBlur={() => fetchUtility(address)}
            />
          ) : (
            <TextInput
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
          )}
        </div>
        {renderUtilityFields(
          utility,
          setUtility,
          gasUtility,
          setGasUtility,
          utilitiesFetchState,
          msg,
          showAddressField,
        )}
        <div>
          <FormLabel
            tooltipText={msg(
              'Your income may qualify you for specific savings programs. Enter your gross income (income before taxes). Include wages and salary plus other forms of income, including pensions, interest, dividends, and rental income. If you are married and file jointly, include your spouse’s income.',
            )}
          >
            <label htmlFor="household_income">{msg('Household income')}</label>
          </FormLabel>
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
          labelText={msg('Tax filing status', { desc: 'form field label' })}
          tooltipText={msg(
            'Your tax filing status helps determine the savings programs you qualify for. Select "Head of Household" if you have a child or relative living with you, and you pay more than half the costs of your home. Select "Joint" if you file your taxes as a married couple.',
          )}
          options={TAX_FILING_OPTIONS(msg)}
          currentValue={taxFiling}
          onChange={v => setTaxFiling(v as FilingStatus)}
        />
        <Select
          id="household_size"
          labelText={msg('Household size')}
          tooltipText={msg(
            'Include anyone you live with who you claim as a dependent on your taxes, and your spouse or partner if you file taxes together.',
          )}
          options={HOUSEHOLD_SIZE_OPTIONS(msg)}
          currentValue={householdSize}
          onChange={setHouseholdSize}
        />
        {showEmailField
          ? renderEmailField(emailRequired, email, setEmail, msg)
          : null}
        <div className="col-start-[-2] col-end-[-1]">
          <div className="h-0 sm:h-9"></div>
          <PrimaryButton id="calculate" disabled={loading}>
            {loading && <Spinner className="w-4 h-4" />}
            {msg('View results')}
          </PrimaryButton>
          {errorMessage && (
            <div
              id="error-msg"
              className="mt-1 mx-3 text-color-text-secondary text-xsm leading-normal"
            >
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
