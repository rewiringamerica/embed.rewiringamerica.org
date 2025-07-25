import tailwindStyles from 'bundle-text:../tailwind.css';
import { FC, useEffect, useRef, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';
import scrollIntoView from 'scroll-into-view-if-needed';
import {
  APIResponse,
  APIUtilitiesResponse,
  FilingStatus,
  OwnerStatus,
} from '../api/calculator-types-v1';
import { DEFAULT_CALCULATOR_API_HOST, fetchApi } from '../api/fetch';
import { FetchState } from '../api/fetch-state';
import { CalculatorFooter } from '../calculator-footer';
import { TextButton } from '../components/buttons';
import { Card } from '../components/card';
import {
  submitEmailSignup,
  wasEmailSubmitted,
} from '../components/email-signup';
import { allLocales } from '../i18n/locales';
import { MsgFn } from '../i18n/msg';
import { str } from '../i18n/str';
import { LocaleContext, useTranslated } from '../i18n/use-translated';
import { safeLocalStorage } from '../safe-local-storage';
import { STATES } from '../states';
import { FormSnapshot } from './form-snapshot';
import { PartnerLogos } from './partner-logos';
import { PROJECTS, Project } from './projects';
import { getResultsForDisplay } from './results';
import {
  CalculatorForm,
  DELIVERED_FUEL_UTILITY_ID,
  FormLabels,
  FormValues,
  NO_GAS_UTILITY_ID,
  OTHER_UTILITY_ID,
} from './state-calculator-form';
import { CardCollection, IncentiveGrid } from './state-incentive-details';

const DEFAULT_ZIP = '';
const DEFAULT_OWNER_STATUS: OwnerStatus = 'homeowner';
const DEFAULT_TAX_FILING: FilingStatus = 'single';
const DEFAULT_HOUSEHOLD_INCOME = '0';
const DEFAULT_HOUSEHOLD_SIZE = '1';
const DEFAULT_UTILITY = '';

/**
 * If you make a backward-incompatible change to the format of form value
 * storage, increment the version in this key.
 */
const FORM_VALUES_LOCAL_STORAGE_KEY = 'RA-calc-form-values-v2';
declare module '../safe-local-storage' {
  interface SafeLocalStorageMap {
    [FORM_VALUES_LOCAL_STORAGE_KEY]: Partial<FormValues>;
  }
}

const fetch = (
  apiHost: string,
  apiKey: string,
  language: string,
  stateId: string | null,
  includeBetaStates: boolean,
  formValues: FormValues,
  setFetchState: (fs: FetchState<APIResponse>) => void,
  msg: MsgFn,
  projectFilter: Project[],
) => {
  const locationProvided = formValues.address || formValues.zip;
  if (
    !(
      locationProvided &&
      formValues.ownerStatus &&
      formValues.taxFiling &&
      formValues.householdIncome &&
      formValues.householdSize
    )
  ) {
    return;
  }

  setFetchState({ state: 'loading' });

  const query = new URLSearchParams({
    language,
    include_beta_states: '' + includeBetaStates,
    owner_status: formValues.ownerStatus,
    household_income: formValues.householdIncome,
    tax_filing: formValues.taxFiling,
    household_size: formValues.householdSize,
  });

  // the API expects only EITHER the `address` OR `zip` to be sent
  if (formValues.address) {
    query.set('address', formValues.address);
  } else if (formValues.zip) {
    query.set('zip', formValues.zip);
  }

  // Only send this param if "other" wasn't chosen
  if (formValues.utility && formValues.utility !== OTHER_UTILITY_ID) {
    query.set('utility', formValues.utility);
  }
  // Only send this param if "other" wasn't chosen
  if (formValues.gasUtility && formValues.gasUtility !== OTHER_UTILITY_ID) {
    query.set(
      'gas_utility',
      formValues.gasUtility === DELIVERED_FUEL_UTILITY_ID ||
        formValues.gasUtility === NO_GAS_UTILITY_ID
        ? 'none' // Special value in the API
        : formValues.gasUtility,
    );
  }
  Object.entries(PROJECTS).forEach(([project, projectInfo]) => {
    if (
      projectFilter.length === 0 ||
      projectFilter.includes(project as Project)
    ) {
      projectInfo.items.forEach(item => {
        query.append('items', item);
      });
    }
  });

  // Tracking usage of the embedded calculator
  query.append('ra_embed', '1');

  return fetchApi<APIResponse>(
    apiKey,
    apiHost,
    '/api/v1/calculator',
    query,
    msg,
  )
    .then(response => {
      // If our "state" attribute is set, enforce that the entered location is
      // in that state.
      if (stateId && stateId !== response.location.state) {
        const stateCodeOrName = STATES[stateId]?.name(msg) ?? stateId;
        setFetchState({
          state: 'error',
          message: msg(str`That ZIP code is not in ${stateCodeOrName}.`),
        });
      } else {
        setFetchState({ state: 'complete', response });
      }
    })
    .catch(exc => setFetchState({ state: 'error', message: exc.message }));
};

const ComingSoonCard = ({ state }: { state: string }) => {
  const { msg } = useTranslated();

  // Show link to The Switch is On for states where they have good coverage.
  const url = new URL('https://incentives.switchison.org/residents/incentives');
  url.searchParams.set('state', state);
  url.searchParams.set('utm_source', 'partner');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'rewiring_america');
  const body =
    state === 'CA' || state === 'WA' ? (
      <>
        {msg(
          str`While we don't have detailed state and local utility coverage \
for ${STATES[state].name(msg)},`,
          { desc: 'followed by "The Switch is On is a ...' },
        )}{' '}
        <a
          className="text-color-action-primary hover:underline"
          href={url.toString()}
          target="_blank"
        >
          The Switch is On
        </a>{' '}
        {msg(
          `is a comprehensive resource that includes detailed information for your state.`,
          { desc: 'preceded by "The Switch is On", name of an organization' },
        )}
      </>
    ) : (
      msg(
        `You can take advantage of federal incentives now, but your state, \
city, and utility may also provide incentives for this project. We’re working \
hard to identify each one!`,
      )
    );

  return (
    <Card theme="grey" padding="medium" isFlat>
      <h3 className="text-color-text-primary text-center text-xl font-medium leading-tight">
        {msg('More money coming soon!')}
      </h3>
      <p className="text-color-text-primary text-center text-base leading-normal">
        {body}
      </p>
    </Card>
  );
};

const StateCalculator: FC<{
  shadowRoot: ShadowRoot;
  apiHost: string;
  apiKey: string;
  attributeValues: FormValues;
  stateId?: string;
  showAddress?: boolean;
  showEmail: boolean;
  emailRequired: boolean;
  emailToStaging: boolean;
  includeBetaStates: boolean;
  projectFilter: Project[];
}> = ({
  shadowRoot,
  apiHost,
  apiKey,
  attributeValues,
  stateId,
  showAddress,
  showEmail,
  emailRequired,
  emailToStaging,
  includeBetaStates,
  projectFilter,
}) => {
  const { msg, locale } = useTranslated();

  // Used to reset the form state to defaults
  const [formKey, setFormKey] = useState(0);

  const [emailSubmitted, setEmailSubmitted] = useState(wasEmailSubmitted());
  const [fetchState, setFetchState] = useState<FetchState<APIResponse>>({
    state: 'init',
  });
  const [submittedLabels, setSubmittedLabels] = useState<FormLabels | null>(
    null,
  );

  // First read the values from local storage, falling back to the values in
  // the element's HTML attributes, falling back to hardcoded defaults.
  const getInitialFormValues = () => {
    const storedValues = safeLocalStorage.getItem(
      FORM_VALUES_LOCAL_STORAGE_KEY,
    );

    return {
      address: storedValues?.address ?? attributeValues.address,
      zip: storedValues?.zip ?? attributeValues.zip,
      ownerStatus: storedValues?.ownerStatus ?? attributeValues.ownerStatus,
      householdIncome:
        storedValues?.householdIncome ?? attributeValues.householdIncome,
      householdSize:
        storedValues?.householdSize ?? attributeValues.householdSize,
      taxFiling: storedValues?.taxFiling ?? attributeValues.taxFiling,
      utility: storedValues?.utility ?? DEFAULT_UTILITY,
      gasUtility: storedValues?.gasUtility ?? DEFAULT_UTILITY,
    };
  };

  // Incrementing the form key will cause the form to drop its state,
  // reinitializing the input values from initial (constructed above).
  const resetFormValues = () => {
    safeLocalStorage.removeItem(FORM_VALUES_LOCAL_STORAGE_KEY);
    setFormKey(fk => fk + 1);
    shadowRoot.dispatchEvent(
      new Event('calculator-reset', {
        bubbles: true,
        composed: true,
      }),
    );
  };

  const submit = (formValues: FormValues, formLabels: FormLabels) => {
    safeLocalStorage.setItem(FORM_VALUES_LOCAL_STORAGE_KEY, formValues);
    setSubmittedLabels(formLabels);

    if (formValues.email && !emailSubmitted) {
      submitEmailSignup(
        apiHost,
        apiKey,
        formValues,
        emailRequired,
        emailToStaging,
      );
      // This hides the email field
      setEmailSubmitted(true);
    }

    fetch(
      apiHost,
      apiKey,
      locale,
      stateId ?? null,
      includeBetaStates,
      formValues,
      setFetchState,
      msg,
      projectFilter,
    );

    shadowRoot.dispatchEvent(
      new CustomEvent('calculator-submitted', {
        bubbles: true,
        composed: true,
        detail: {
          formData: formValues,
        },
      }),
    );
  };

  // When the fetch completes, scroll to the appropriate element
  const calcContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target =
      fetchState.state === 'complete' && calcContainerRef.current
        ? calcContainerRef.current
        : null;

    if (target) {
      scrollIntoView(target, {
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
        scrollMode: 'if-needed',
      });
    }
  }, [fetchState.state]);

  if (fetchState.state === 'complete') {
    const response = fetchState.response;
    const {
      incentivesByProject,
      iraRebatesByProject,
      projectOptions,
      totalResults,
      countOfProjects,
    } = getResultsForDisplay(response, msg, projectFilter);
    const coverageState = response.coverage.state;
    const locationState = response.location.state;

    let incentiveResults;
    if (projectFilter.length === 1) {
      const selectedProject = projectFilter[0];
      incentiveResults = (
        <CardCollection
          incentives={incentivesByProject[selectedProject]}
          iraRebates={iraRebatesByProject[selectedProject]}
          project={selectedProject}
        />
      );
    } else {
      incentiveResults = (
        <IncentiveGrid
          incentivesByProject={incentivesByProject}
          iraRebatesByProject={iraRebatesByProject}
          tabs={projectOptions}
        />
      );
    }

    return (
      <div
        id="calc-root"
        className="grid gap-6 scroll-m-[90px]"
        ref={calcContainerRef}
      >
        <Card padding="small" isFlat>
          <FormSnapshot
            formLabels={submittedLabels!}
            totalResults={totalResults}
            countOfProjects={countOfProjects}
            singleProject={projectFilter.length === 1 ? projectFilter[0] : null}
            onEditClicked={() => setFetchState({ state: 'init' })}
          />
        </Card>
        {incentiveResults}
        {coverageState === null && <ComingSoonCard state={locationState} />}
        <PartnerLogos response={response} />
      </div>
    );
  } else {
    return (
      <div id="calc-root" className="grid gap-8">
        <Card padding="medium">
          <div className="flex justify-between items-baseline">
            <h1 className="text-base sm:text-xl font-medium leading-tight">
              {msg('Your household info')}
            </h1>
            <div>
              <TextButton onClick={resetFormValues}>{msg('Reset')}</TextButton>
            </div>
          </div>
          <CalculatorForm
            key={formKey}
            stateId={stateId}
            initialValues={getInitialFormValues()}
            showAddressField={showAddress}
            showEmailField={showEmail && !emailSubmitted}
            emailRequired={emailRequired}
            loading={fetchState.state === 'loading'}
            errorMessage={
              fetchState.state === 'error' ? fetchState.message : null
            }
            utilityFetcher={(zipOrAddress: string | undefined) => {
              const query = new URLSearchParams({ language: locale });

              // add EITHER `zip` OR `address` to the query based on the value of `showAddress`
              if (zipOrAddress) {
                showAddress
                  ? query.append('address', zipOrAddress)
                  : query.append('zip', zipOrAddress);
              }

              // Tracking usage of the embedded calculator
              query.append('ra_embed', '1');

              return fetchApi<APIUtilitiesResponse>(
                apiKey,
                apiHost,
                '/api/v1/utilities',
                query,
                msg,
              );
            }}
            onSubmit={submit}
          />
        </Card>
      </div>
    );
  }
};

export class RewiringAmericaCalculator extends HTMLElement {
  /* property to show the address field instead of the ZIP field */
  showAddress: boolean = false;

  /* property to show the email signup field */
  showEmail: boolean = false;

  /**
   * Property to require email when submitting the top-level form.
   * Has no effect if the email field is not shown (whether because showEmail
   * is false, or because an email has already been submitted).
   */
  emailRequired: boolean = false;

  /**
   * Property to submit emails to the staging environment instead of prod.
   * Intentionally undocumented; for RA use only.
   */
  emailToStaging: boolean = false;

  /* property to include incentives from states that aren't formally launched */
  includeBetaStates: boolean = false;

  /* supported properties to control which API path and key is used to load the calculator results */
  apiKey: string = '';
  apiHost: string = DEFAULT_CALCULATOR_API_HOST;

  /* supported property to allow restricting the calculator to ZIPs in a specific state */
  state: string = '';

  /* supported properties to allow pre-filling the form */
  zip: string = DEFAULT_ZIP;
  ownerStatus: OwnerStatus = DEFAULT_OWNER_STATUS;
  householdIncome: string = DEFAULT_HOUSEHOLD_INCOME;
  taxFiling: FilingStatus = DEFAULT_TAX_FILING;
  householdSize: string = DEFAULT_HOUSEHOLD_SIZE;

  /* supported properties to filter API results */
  projects: string = '';

  /* attributeChangedCallback() will be called when any of these changes */
  static observedAttributes = [
    'lang',
    'show-address-field',
    'show-email',
    'email-required',
    'email-to-staging',
    'include-beta-states',
    'api-key',
    'api-host',
    'state',
    'zip',
    'owner-status',
    'household-income',
    'tax-filing',
    'household-size',
    'projects',
  ] as const;

  reactRootCalculator: Root | null = null;
  reactRootFooter: Root | null = null;

  connectedCallback() {
    this.lang = this.getDefaultLanguage();

    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = tailwindStyles;

      shadowRoot.appendChild(style);

      const calculator = document.createElement('div');
      shadowRoot.appendChild(calculator);
      this.reactRootCalculator = createRoot(calculator);

      const footer = document.createElement('div');
      shadowRoot.appendChild(footer);
      this.reactRootFooter = createRoot(footer);
    }
    this.render();
  }

  attributeChangedCallback(
    attr: (typeof RewiringAmericaCalculator.observedAttributes)[number],
    _: string | null, // old value; unused
    newValue: string | null,
  ) {
    if (attr === 'lang') {
      // Don't do anything; the property already reflects the change.
      // Assigning to lang here will cause infinite recursion.
    } else if (attr === 'api-host') {
      this.apiHost = newValue ?? DEFAULT_CALCULATOR_API_HOST;
    } else if (attr === 'api-key') {
      this.apiKey = newValue ?? '';
    } else if (attr === 'include-beta-states') {
      this.includeBetaStates = newValue !== null;
    } else if (attr === 'show-address-field') {
      this.showAddress = newValue !== null;
    } else if (attr === 'show-email') {
      this.showEmail = newValue !== null;
    } else if (attr === 'email-required') {
      this.emailRequired = newValue !== null;
    } else if (attr === 'email-to-staging') {
      this.emailToStaging = newValue !== null;
    } else if (attr === 'state') {
      this.state = newValue ?? '';
    } else if (attr === 'zip') {
      this.zip = newValue ?? DEFAULT_ZIP;
    } else if (attr === 'owner-status') {
      this.ownerStatus = (newValue as OwnerStatus) ?? DEFAULT_OWNER_STATUS;
    } else if (attr === 'household-income') {
      this.householdIncome = newValue ?? DEFAULT_HOUSEHOLD_INCOME;
    } else if (attr === 'household-size') {
      this.householdSize = newValue ?? DEFAULT_HOUSEHOLD_SIZE;
    } else if (attr === 'tax-filing') {
      this.taxFiling = (newValue as FilingStatus) ?? DEFAULT_TAX_FILING;
    } else if (attr === 'projects') {
      this.projects = newValue ?? '';
    } else {
      // This will fail typechecking if the cases above aren't exhaustive
      // with respect to observedAttributes
      const n: never = attr;
      console.error('Unexpected attribute', n, newValue);
    }
    if (this.isConnected) {
      this.render();
    }
  }

  private render() {
    this.reactRootCalculator?.render(
      <LocaleContext.Provider value={this.lang}>
        <StateCalculator
          shadowRoot={this.shadowRoot!}
          apiHost={this.apiHost}
          apiKey={this.apiKey}
          attributeValues={{
            zip: this.zip,
            ownerStatus: this.ownerStatus,
            householdIncome: this.householdIncome,
            householdSize: this.householdSize,
            taxFiling: this.taxFiling,
          }}
          stateId={this.state}
          showAddress={this.showAddress}
          showEmail={this.showEmail}
          emailRequired={this.emailRequired}
          emailToStaging={this.emailToStaging}
          includeBetaStates={this.includeBetaStates}
          projectFilter={this.buildProjectFilter()}
        />
      </LocaleContext.Provider>,
    );
    this.reactRootFooter?.render(
      <LocaleContext.Provider value={this.lang}>
        <CalculatorFooter />
      </LocaleContext.Provider>,
    );
  }

  private getDefaultLanguage() {
    const closestLang =
      (this.closest('[lang]') as HTMLElement | null)?.lang?.split('-')?.[0] ??
      '';
    return (allLocales as readonly string[]).includes(closestLang)
      ? closestLang
      : 'en';
  }

  private buildProjectFilter(): Project[] {
    if (this.projects.length === 0) {
      return [];
    }

    const validProjects = Object.keys(PROJECTS);
    const projectFilter = this.projects
      .split(',')
      .map(p => p.toLowerCase() as Project);

    for (const project of projectFilter) {
      if (!validProjects.includes(project)) {
        throw new Error(`Invalid project attribute: ${project}`);
      }
    }

    return projectFilter;
  }
}
