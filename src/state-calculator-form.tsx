import { FC, useEffect, useState } from 'react';
import { APIUtilitiesResponse } from './api/calculator-types-v1';
import { FetchState } from './api/fetch-state';
import { PrimaryButton } from './buttons';
import { FilingStatus, OwnerStatus } from './calculator-types';
import { FormLabel } from './components/form-label';
import { Option, Select } from './components/select';
import { TextInput } from './components/text-input';
import { CurrencyInput } from './currency-input';
import { str } from './i18n/str';
import { MsgFn, useTranslated } from './i18n/use-translated';
import { STATES } from './states';

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

const NO_GAS_UTILITY_ID = 'no-gas';
const DELIVERED_FUEL_UTILITY_ID = 'delivered';
const OTHER_UTILITY_ID = 'other';

const renderUtilityFields = (
  utility: string,
  setUtility: (newValue: string) => void,
  gasUtility: string,
  setGasUtility: (newValue: string) => void,
  utilitiesFetch: FetchState<APIUtilitiesResponse>,
  msg: MsgFn,
) => {
  const options: Option<string>[] =
    utilitiesFetch.state === 'complete'
      ? Object.entries(utilitiesFetch.response.utilities)
          .map(([id, info]) => ({ value: id, label: info.name }))
          .concat([{ value: OTHER_UTILITY_ID, label: msg('Other') }])
      : [];

  const enterZipToSelect = msg('Enter your ZIP code to select a utility.');
  const helpText =
    utilitiesFetch.state === 'init'
      ? enterZipToSelect
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
      labelText={msg('Electric Utility', { desc: 'as in utility company' })}
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
  const gasResponse =
    utilitiesFetch.state === 'complete'
      ? utilitiesFetch.response
      : utilitiesFetch.state === 'loading'
      ? utilitiesFetch.previousResponse
      : null;

  // Show the gas utility selector if and only if the choice is relevant to
  // incentive eligibility. Even if the map of gas utilities is empty, we need
  // to show the selector to allow the user to distinguish between actually
  // having no gas service, and having gas service that's not listed here
  // (indicated by the Other item).
  if (gasResponse?.gas_utility_affects_incentives) {
    const gasOptions = Object.entries(gasResponse.gas_utilities || {})
      .map(([id, info]) => ({ value: id, label: info.name }))
      .concat([
        {
          value: DELIVERED_FUEL_UTILITY_ID,
          label: msg('Delivered propane or fuel oil'),
        },
        { value: NO_GAS_UTILITY_ID, label: msg('No gas service') },
        { value: OTHER_UTILITY_ID, label: msg('Other') },
      ]);
    gasSelector = (
      <Select
        id="gas_utility"
        labelText={msg('Gas Utility', { desc: 'as in utility company' })}
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
          href="https://content.rewiringamerica.org/view/privacy-policy.pdf"
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
  zip: string;
  ownerStatus: OwnerStatus;
  householdIncome: string;
  householdSize: string;
  taxFiling: FilingStatus;
  utility?: string;
  gasUtility?: string;
  email?: string;
};

export const CalculatorForm: FC<{
  initialValues: FormValues;
  showEmailField: boolean;
  emailRequired: boolean;
  utilityFetcher: (zip: string) => Promise<APIUtilitiesResponse>;
  stateId?: string;
  onSubmit: (formValues: FormValues) => void;
}> = ({
  initialValues,
  showEmailField,
  emailRequired,
  utilityFetcher,
  stateId,
  onSubmit,
}) => {
  const { msg } = useTranslated();

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

  useEffect(() => {
    if (!utilityFetcher || !zip.match(/^\d{5}$/)) {
      return;
    }

    setUtilitiesFetchState(prev => ({
      state: 'loading',
      previousResponse: prev.state === 'complete' ? prev.response : undefined,
    }));
    utilityFetcher(zip)
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
          if (!keys.includes(utility)) {
            setUtility(keys[0]);
          }
        } else {
          setUtility(OTHER_UTILITY_ID);
        }

        const gasKeys = Object.keys(response.gas_utilities || {});
        if (gasKeys.length > 0) {
          if (!gasKeys.includes(gasUtility)) {
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
          utility: utility !== OTHER_UTILITY_ID ? utility : '',
          gasUtility:
            gasUtility === OTHER_UTILITY_ID
              ? '' // Don't send the param at all
              : gasUtility === DELIVERED_FUEL_UTILITY_ID ||
                gasUtility === NO_GAS_UTILITY_ID
              ? 'none' // Special value in the API
              : gasUtility,
          email,
        });
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
          <FormLabel
            tooltipText={msg(
              'Your zip code helps determine the amount of discounts and tax credits you qualify for.',
            )}
          >
            <label htmlFor="zip">
              {msg('Zip', { desc: 'as in zip code' })}
            </label>
          </FormLabel>

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
        </div>
        {renderUtilityFields(
          utility,
          setUtility,
          gasUtility,
          setGasUtility,
          utilitiesFetchState,
          msg,
        )}
        <div>
          <FormLabel
            tooltipText={msg(
              'Enter your gross income (income before taxes). Include wages and salary plus other forms of income, including pensions, interest, dividends, and rental income. If you are married and file jointly, include your spouse’s income.',
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
          labelText={msg('Tax filing', { desc: 'form field label' })}
          tooltipText={msg(
            'Select "Head of Household" if you have a child or relative living with you, and you pay more than half the costs of your home. Select "Joint" if you file your taxes as a married couple.',
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
          <PrimaryButton id="calculate">{msg('View results')}</PrimaryButton>
        </div>
      </div>
    </form>
  );
};
