import { configureLocalization, localized, msg, str } from '@lit/localize';
import SlSpinner from '@shoelace-style/shoelace/dist/react/spinner';
import tailwindStyles from 'bundle-text:./tailwind.css';
import shoelaceTheme from 'bundle-text:@shoelace-style/shoelace/dist/themes/light.css';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FC, useEffect, useRef, useState } from 'react';
import { Root } from 'react-dom/client';
import scrollIntoView from 'scroll-into-view-if-needed';
import { APIResponse, APIUtilitiesResponse } from './api/calculator-types-v1';
import { fetchApi } from './api/fetch';
import { FetchState } from './api/fetch-state';
import { TextButton } from './buttons';
import { CalculatorFooter } from './calculator-footer';
import { FilingStatus, OwnerStatus } from './calculator-types';
import { Card } from './card';
import { submitEmailSignup, wasEmailSubmitted } from './email-signup';
import { allLocales, sourceLocale, targetLocales } from './locales/locales';
import * as spanishLocale from './locales/strings/es';
import { PROJECTS } from './projects';
import { renderReactElements } from './react-roots';
import { safeLocalStorage } from './safe-local-storage';
import { selectStyles } from './select';
import { Separator } from './separator';
import { CalculatorForm, FormValues } from './state-calculator-form';
import { StateIncentives } from './state-incentive-details';
import { STATES } from './states';
import { baseVariables } from './styles';
import { inputStyles } from './styles/input';
import { tooltipStyles } from './tooltip';

const { setLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: async locale =>
    locale === 'es'
      ? spanishLocale
      : (() => {
          throw new Error(`unknown locale ${locale}`);
        })(),
});

const DEFAULT_CALCULATOR_API_HOST: string = 'https://api.rewiringamerica.org';
const DEFAULT_ZIP = '';
const DEFAULT_OWNER_STATUS: OwnerStatus = 'homeowner';
const DEFAULT_TAX_FILING: FilingStatus = 'single';
const DEFAULT_HOUSEHOLD_INCOME = '0';
const DEFAULT_HOUSEHOLD_SIZE = '1';
const DEFAULT_UTILITY = '';

const FORM_VALUES_LOCAL_STORAGE_KEY = 'RA-calc-form-values';
declare module './safe-local-storage' {
  interface SafeLocalStorageMap {
    [FORM_VALUES_LOCAL_STORAGE_KEY]: Partial<FormValues>;
  }
}

@customElement('rewiring-america-state-calculator')
@localized()
export class RewiringAmericaStateCalculator extends LitElement {
  static override styles = [
    unsafeCSS(tailwindStyles),
    unsafeCSS(shoelaceTheme),
    baseVariables,
    inputStyles,
    tooltipStyles,
    selectStyles,
    css`
      /* for now, override these variables just for the state calculator */
      :host {
        /* select */
        --ra-select-focus-color: var(--rewiring-purple);
        /* input */
        --ra-input-border: 1px solid #e2e2e2;
        --ra-input-focus-color: var(--rewiring-purple);
        --ra-input-margin: 0;
        --ra-input-padding: 0.5rem 0.75rem;
      }
    `,
  ];

  /**
   * Property to control display language. Changing this dynamically is not
   * supported: UI labels and such will change immediately, but user-visible
   * text that came from API responses will not change until the next API
   * fetch completes.
   */
  @property({ type: String, attribute: 'lang' })
  override lang: string = this.getDefaultLanguage();

  /* supported property to show the email signup field */

  @property({ type: Boolean, attribute: 'show-email' })
  showEmail: boolean = false;

  /* property to include incentives from states that aren't formally launched */

  @property({ type: Boolean, attribute: 'include-beta-states' })
  includeBetaStates: boolean = false;

  /* supported properties to control which API path and key is used to load the calculator results */

  @property({ type: String, attribute: 'api-key' })
  apiKey: string = '';

  @property({ type: String, attribute: 'api-host' })
  apiHost: string = DEFAULT_CALCULATOR_API_HOST;

  /* supported property to allow restricting the calculator to ZIPs in a specific state */
  @property({ type: String, attribute: 'state' })
  state: string = '';

  /* supported properties to allow pre-filling the form */

  @property({ type: String, attribute: 'zip' })
  zip: string = DEFAULT_ZIP;

  @property({ type: String, attribute: 'owner-status' })
  ownerStatus: OwnerStatus = DEFAULT_OWNER_STATUS;

  @property({ type: String, attribute: 'household-income' })
  householdIncome: string = DEFAULT_HOUSEHOLD_INCOME;

  @property({ type: String, attribute: 'tax-filing' })
  taxFiling: FilingStatus = DEFAULT_TAX_FILING;

  @property({ type: String, attribute: 'household-size' })
  householdSize: string = DEFAULT_HOUSEHOLD_SIZE;

  /**
   * For the React transition; see react-roots.ts for detail.
   * TODO: this whole mechanism can go away post-React transition
   */
  reactRoots: Map<string, { reactRoot: Root; domNode: HTMLElement }> =
    new Map();

  /**
   * This is the "key" attribute of the form component. Change it to force a
   * re-render of the form, dropping the values in its state.
   */
  formKey: number = 0;

  private getDefaultLanguage() {
    const closestLang =
      (this.closest('[lang]') as HTMLElement | null)?.lang?.split('-')?.[0] ??
      '';
    return (allLocales as readonly string[]).includes(closestLang)
      ? closestLang
      : 'en';
  }

  /**
   * Make sure the locale is set before rendering begins. setLocale() is async
   * and this is the only async part of the component lifecycle we can hook.
   */
  protected override async scheduleUpdate(): Promise<void> {
    await setLocale(this.lang);
    super.scheduleUpdate();
  }

  override async updated() {
    renderReactElements(
      this.renderRoot as ShadowRoot,
      new Map([
        [
          'calc-root',
          <StateCalculator
            shadowRoot={this.renderRoot as ShadowRoot}
            language={this.lang}
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
            includeBetaStates={this.includeBetaStates}
          />,
        ],
        ['calc-footer', <CalculatorFooter />],
      ]),
      this.reactRoots,
    );
  }

  override render() {
    return html`
      <div id="calc-root" class="grid gap-4 sm:gap-6 lg:gap-12"></div>
      <div id="calc-footer"></div>
    `;
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
    'location[zip]': formValues.zip,
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

  return fetchApi<APIResponse>(apiKey, apiHost, '/api/v1/calculator', query)
    .then(response => {
      // If our "state" attribute is set, enforce that the entered location is
      // in that state.
      if (stateId && stateId !== response.location.state) {
        const stateCodeOrName = STATES[stateId]?.name() ?? stateId;
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

export const StateCalculator: FC<{
  shadowRoot: ShadowRoot;
  language: string;
  apiHost: string;
  apiKey: string;
  attributeValues: Partial<FormValues>;
  stateId?: string;
  showEmail: boolean;
  includeBetaStates: boolean;
}> = ({
  shadowRoot,
  language,
  apiHost,
  apiKey,
  attributeValues,
  stateId,
  showEmail,
  includeBetaStates,
}) => {
  // Used to reset the form state to defaults
  const [formKey, setFormKey] = useState(0);

  const [emailSubmitted, setEmailSubmitted] = useState(wasEmailSubmitted());
  const [submittedFormValues, setSubmittedFormValues] =
    useState<FormValues | null>(null);
  const [fetchState, setFetchState] = useState<FetchState<APIResponse>>({
    state: 'init',
  });

  // First read the values from local storage, falling back to the values in
  // the Lit element's HTML attributes, falling back to hardcoded defaults.
  const getInitialFormValues = () => {
    const storedValues = safeLocalStorage.getItem(
      FORM_VALUES_LOCAL_STORAGE_KEY,
    );

    return {
      zip: storedValues?.zip ?? attributeValues.zip ?? DEFAULT_ZIP,
      ownerStatus:
        storedValues?.ownerStatus ??
        attributeValues.ownerStatus ??
        DEFAULT_OWNER_STATUS,
      householdIncome:
        storedValues?.householdIncome ??
        attributeValues.householdIncome ??
        DEFAULT_HOUSEHOLD_INCOME,
      householdSize:
        storedValues?.householdSize ??
        attributeValues.householdSize ??
        DEFAULT_HOUSEHOLD_SIZE,
      taxFiling:
        storedValues?.taxFiling ??
        attributeValues.taxFiling ??
        DEFAULT_TAX_FILING,
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
      submitEmailSignup(apiHost, apiKey, email, formValues.zip);
      // This hides the email field
      setEmailSubmitted(true);
    }

    fetch(
      apiHost,
      apiKey,
      language,
      stateId ?? null,
      includeBetaStates,
      formValues,
      setFetchState,
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
    <>
      <Card>
        <div className="flex justify-between items-baseline">
          <h1 className="text-base sm:text-xl font-medium leading-tight">
            {msg('Your household info')}
          </h1>
          <div>
            <TextButton onClick={resetFormValues}>{msg('Reset')}</TextButton>
          </div>
        </div>
        <div className="text-grey-500 text-[0.75rem] leading-tight pb-[0.1875rem]">
          {msg(
            'We’re dedicated to safeguarding your privacy. We never share or sell your personal information.',
          )}
        </div>
        <CalculatorForm
          key={formKey}
          stateId={stateId}
          initialValues={getInitialFormValues()}
          showEmailField={!!showEmail && !emailSubmitted}
          showProjectField={true}
          utilityFetcher={zip => {
            const query = new URLSearchParams({
              language,
              include_beta_states: '' + includeBetaStates,
              'location[zip]': zip,
            });

            return fetchApi<APIUtilitiesResponse>(
              apiKey,
              apiHost,
              '/api/v1/utilities',
              query,
            );
          }}
          tooltipSize={13}
          onSubmit={submit}
        />
      </Card>
      {fetchState.state === 'init' ? null : fetchState.state === 'loading' ? (
        <Card>
          <SlSpinner className="mx-auto text-3xl" />
        </Card>
      ) : fetchState.state === 'error' ? (
        <Card ref={errorMessageRef}>{fetchState.message}</Card>
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
                    );
                    setEmailSubmitted(true);
                  }
                : null
            }
          />
        </>
      )}
    </>
  );
};

/**
 * Tell TypeScript that the HTML tag's type signature corresponds to the
 * class's type signature.
 */
declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-state-calculator': RewiringAmericaStateCalculator;
  }
}
