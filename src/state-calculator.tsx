import tailwindStyles from 'bundle-text:./tailwind.css';
import { FC, useEffect, useRef, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';
import scrollIntoView from 'scroll-into-view-if-needed';
import { APIResponse, APIUtilitiesResponse } from './api/calculator-types-v1';
import { fetchApi } from './api/fetch';
import { FetchState } from './api/fetch-state';
import { TextButton } from './buttons';
import { CalculatorFooter } from './calculator-footer';
import { FilingStatus, OwnerStatus } from './calculator-types';
import { Card } from './card';
import { Spinner } from './components/spinner';
import { submitEmailSignup, wasEmailSubmitted } from './email-signup';
import { allLocales } from './i18n/locales';
import { str } from './i18n/str';
import { LocaleContext, MsgFn, useTranslated } from './i18n/use-translated';
import { PROJECTS } from './projects';
import { safeLocalStorage } from './safe-local-storage';
import { Separator } from './separator';
import { CalculatorForm, FormValues } from './state-calculator-form';
import { StateIncentives } from './state-incentive-details';
import { STATES } from './states';

const DEFAULT_CALCULATOR_API_HOST: string = 'https://api.rewiringamerica.org';
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
declare module './safe-local-storage' {
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
) => {
  if (
    !(
      formValues.zip &&
      formValues.ownerStatus &&
      formValues.taxFiling &&
      formValues.householdIncome &&
      formValues.householdSize &&
      formValues.projects
    )
  ) {
    return;
  }

  setFetchState({ state: 'loading' });

  const query = new URLSearchParams({
    language,
    include_beta_states: '' + includeBetaStates,
    zip: formValues.zip,
    owner_status: formValues.ownerStatus,
    household_income: formValues.householdIncome,
    tax_filing: formValues.taxFiling,
    household_size: formValues.householdSize,
  });
  if (formValues.utility) {
    query.set('utility', formValues.utility);
  }
  Object.values(PROJECTS).forEach(project => {
    project.items.forEach(item => {
      query.append('items', item);
    });
  });

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

const StateCalculator: FC<{
  shadowRoot: ShadowRoot;
  apiHost: string;
  apiKey: string;
  attributeValues: FormValues;
  stateId?: string;
  showEmail: boolean;
  emailRequired: boolean;
  includeBetaStates: boolean;
}> = ({
  shadowRoot,
  apiHost,
  apiKey,
  attributeValues,
  stateId,
  showEmail,
  emailRequired,
  includeBetaStates,
}) => {
  const { msg, locale } = useTranslated();

  // Used to reset the form state to defaults
  const [formKey, setFormKey] = useState(0);

  const [emailSubmitted, setEmailSubmitted] = useState(wasEmailSubmitted());
  const [submittedFormValues, setSubmittedFormValues] =
    useState<FormValues | null>(null);
  const [fetchState, setFetchState] = useState<FetchState<APIResponse>>({
    state: 'init',
  });

  // First read the values from local storage, falling back to the values in
  // the element's HTML attributes, falling back to hardcoded defaults.
  const getInitialFormValues = () => {
    const storedValues = safeLocalStorage.getItem(
      FORM_VALUES_LOCAL_STORAGE_KEY,
    );

    return {
      zip: storedValues?.zip ?? attributeValues.zip,
      ownerStatus: storedValues?.ownerStatus ?? attributeValues.ownerStatus,
      householdIncome:
        storedValues?.householdIncome ?? attributeValues.householdIncome,
      householdSize:
        storedValues?.householdSize ?? attributeValues.householdSize,
      taxFiling: storedValues?.taxFiling ?? attributeValues.taxFiling,
      projects: storedValues?.projects ?? [],
      utility: storedValues?.utility ?? DEFAULT_UTILITY,
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

  const submit = (formValues: FormValues) => {
    setSubmittedFormValues(formValues);
    safeLocalStorage.setItem(FORM_VALUES_LOCAL_STORAGE_KEY, formValues);

    const email = formValues.email;
    if (email && !emailSubmitted) {
      submitEmailSignup(apiHost, apiKey, email, formValues.zip, emailRequired);
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

  // When the fetch completes or errors out, scroll to the appropriate element
  const firstResultsRef = useRef<HTMLDivElement>(null);
  const secondResultsRef = useRef<HTMLDivElement>(null);
  const errorMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target =
      fetchState.state === 'complete' &&
      (firstResultsRef.current || secondResultsRef.current)
        ? firstResultsRef.current ?? secondResultsRef.current
        : fetchState.state === 'error' && errorMessageRef.current
        ? errorMessageRef.current
        : null;

    if (target) {
      scrollIntoView(target, {
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
        scrollMode: 'if-needed',
      });
    }
  }, [fetchState.state]);

  return (
    <div id="calc-root" className="grid gap-4 sm:gap-6 lg:gap-12">
      <Card>
        <div className="flex justify-between items-baseline">
          <h1 className="text-base sm:text-xl font-medium leading-tight">
            {msg('Your household info')}
          </h1>
          <div>
            <TextButton onClick={resetFormValues}>{msg('Reset')}</TextButton>
          </div>
        </div>
        <div className="text-color-text-secondary text-[0.75rem] leading-tight pb-[0.1875rem]">
          {msg('We’re dedicated to safeguarding your privacy.')}{' '}
          <a
            className="text-color-action-primary font-medium"
            target="_blank"
            href="https://content.rewiringamerica.org/view/privacy-policy.pdf"
          >
            {msg('Learn more')}
          </a>
          .
        </div>
        <CalculatorForm
          key={formKey}
          stateId={stateId}
          initialValues={getInitialFormValues()}
          showEmailField={showEmail && !emailSubmitted}
          emailRequired={emailRequired}
          utilityFetcher={zip => {
            const query = new URLSearchParams({
              language: locale,
              include_beta_states: '' + includeBetaStates,
              zip,
            });

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
      {fetchState.state === 'init' ? null : fetchState.state === 'loading' ? (
        <Card>
          <Spinner className="mx-auto w-7 h-7 text-color-text-primary" />
        </Card>
      ) : fetchState.state === 'error' ? (
        <Card ref={errorMessageRef} id="error-msg">
          {fetchState.message}
        </Card>
      ) : (
        <>
          <Separator />
          <StateIncentives
            firstResultsRef={firstResultsRef}
            secondResultsRef={secondResultsRef}
            response={fetchState.response}
            selectedProjects={submittedFormValues!.projects ?? []}
            emailSubmitter={
              showEmail
                ? (email: string) => {
                    submitEmailSignup(
                      apiHost,
                      apiKey,
                      email,
                      submittedFormValues!.zip,
                      emailRequired,
                    );
                    setEmailSubmitted(true);
                  }
                : null
            }
          />
        </>
      )}
    </div>
  );
};

class CalculatorElement extends HTMLElement {
  /* property to show the email signup field */
  showEmail: boolean = false;

  /**
   * Property to require email when submitting the top-level form.
   * Has no effect if the email field is not shown (whether because showEmail
   * is false, or because an email has already been submitted).
   */
  emailRequired: boolean = false;

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

  /* attributeChangedCallback() will be called when any of these changes */
  static observedAttributes = [
    'lang',
    'show-email',
    'email-required',
    'include-beta-states',
    'api-key',
    'api-host',
    'state',
    'zip',
    'owner-status',
    'household-income',
    'tax-filing',
    'household-size',
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
    attr: (typeof CalculatorElement.observedAttributes)[number],
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
    } else if (attr === 'show-email') {
      this.showEmail = newValue !== null;
    } else if (attr === 'email-required') {
      this.emailRequired = newValue !== null;
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
          showEmail={this.showEmail}
          emailRequired={this.emailRequired}
          includeBetaStates={this.includeBetaStates}
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
}

customElements.define('rewiring-america-state-calculator', CalculatorElement);

/**
 * Tell TypeScript that the HTML tag's type signature corresponds to the
 * class's type signature.
 */
declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-state-calculator': CalculatorElement;
  }
}
