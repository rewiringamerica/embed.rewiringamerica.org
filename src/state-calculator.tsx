import { Task, initialState } from '@lit-labs/task';
import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fetchApi } from './api/fetch';
import { CALCULATOR_FOOTER } from './calculator-footer';
import { CalculatorForm, FormValues, formStyles } from './calculator-form';
import { FilingStatus, OwnerStatus } from './calculator-types';
import { iconTabBarStyles } from './icon-tab-bar';
import { PROJECTS, Project } from './projects';
import {
  cardStyles,
  separatorStyles,
  stateIncentivesStyles,
  stateIncentivesTemplate,
} from './state-incentive-details';
import { baseStyles } from './styles';

import { configureLocalization, localized, msg } from '@lit/localize';
import '@shoelace-style/shoelace/dist/components/spinner/spinner';
import { Root } from 'react-dom/client';
import scrollIntoView from 'scroll-into-view-if-needed';
import { APIResponse, APIUtilitiesResponse } from './api/calculator-types-v1';
import { authorityLogosStyles } from './authority-logos';
import { submitEmailSignup, wasEmailSubmitted } from './email-signup';
import { allLocales, sourceLocale, targetLocales } from './locales/locales';
import * as spanishLocale from './locales/strings/es';
import { renderReactElements } from './react-roots';
import { safeLocalStorage } from './safe-local-storage';

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

const loadingTemplate = () => html`
  <div class="card card-content">
    <div class="loading">
      <sl-spinner></sl-spinner>
    </div>
  </div>
`;

const errorTemplate = (error: unknown) => html`
  <div class="card card-content" id="error-message">
    ${typeof error === 'object' && error && 'message' in error && error.message
      ? error.message
      : msg('Error loading incentives.')}
  </div>
`;

/**
 * Waits for the next event loop (to allow the DOM to update following an
 * update of reactive properties), then scrolls to the element matching the
 * given selector.
 */
const waitAndScrollTo = (shadowRoot: ShadowRoot, selector: string) => {
  setTimeout(() => {
    const target = shadowRoot.querySelector(selector);
    if (target) {
      scrollIntoView(target, {
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
        scrollMode: 'if-needed',
      });
    }
  }, 0);
};

const DEFAULT_CALCULATOR_API_HOST: string = 'https://api.rewiringamerica.org';
const DEFAULT_ZIP = '';
const DEFAULT_OWNER_STATUS: OwnerStatus = 'homeowner';
const DEFAULT_TAX_FILING: FilingStatus = 'single';
const DEFAULT_HOUSEHOLD_INCOME = '0';
const DEFAULT_HOUSEHOLD_SIZE = '1';
const DEFAULT_UTILITY = '';

const FORM_VALUES_LOCAL_STORAGE_KEY = 'RA-calc-form-values';
type SavedFormValues = Partial<{
  zip: string;
  ownerStatus: OwnerStatus;
  householdIncome: string;
  householdSize: string;
  taxFiling: FilingStatus;
  projects: Project[];
  utility: string;
}>;

declare module './safe-local-storage' {
  interface SafeLocalStorageMap {
    [FORM_VALUES_LOCAL_STORAGE_KEY]: SavedFormValues;
  }
}

const formTitleStyles = css`
  .form-title {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  @media screen and (max-width: 640px) {
    h1 {
      font-size: 16px;
    }
  }
`;

const privacyMessageStyles = css`
  .privacy-message {
    color: #6b6b6b;
    font-size: 0.75rem;
    line-height: 125%;
    padding-bottom: 0.1875rem;
  }
`;

@customElement('rewiring-america-state-calculator')
@localized()
export class RewiringAmericaStateCalculator extends LitElement {
  static override styles = [
    baseStyles,
    cardStyles,
    ...formStyles,
    stateIncentivesStyles,
    separatorStyles,
    iconTabBarStyles,
    authorityLogosStyles,
    formTitleStyles,
    privacyMessageStyles,
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

  /* supported properties to allow pre-filling the form
   *
   * These can be overridden by values stored in local storage, which is why
   * they can't use the "attribute" property in the decorator.
   */

  @property({ type: String }) // attribute: 'zip'
  zip: string = DEFAULT_ZIP;

  @property({ type: String }) // attribute: 'owner-status'
  ownerStatus: OwnerStatus = DEFAULT_OWNER_STATUS;

  @property({ type: String }) // attribute: 'household-income'
  householdIncome: string = DEFAULT_HOUSEHOLD_INCOME;

  @property({ type: String }) // attribute: 'tax-filing'
  taxFiling: FilingStatus = DEFAULT_TAX_FILING;

  @property({ type: String }) // attribute: 'household-size'
  householdSize: string = DEFAULT_HOUSEHOLD_SIZE;

  /* internal properties */

  @property({ type: String })
  utility: string = DEFAULT_UTILITY;

  @property({ type: Array })
  projects: Project[] = [];

  @property({ type: String })
  selectedProjectTab: Project | undefined;

  @property({ type: String })
  selectedOtherTab: Project | undefined;

  @property({ type: Boolean })
  wasEmailSubmitted: boolean = wasEmailSubmitted();

  /**
   * For the React transition; see react-roots.ts for detail.
   * TODO: this whole mechanism can go away post-React transition
   */
  reactElements: Map<string, React.ReactElement> = new Map();
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
   * Called when the component is added to the DOM. At this point the values of
   * the HTML attributes are available, so we can initialize the properties
   * representing form values.
   */
  override connectedCallback(): void {
    super.connectedCallback();
    this.initFormProperties();
  }

  /**
   * Populate the properties that hold form values from saved values if
   * available, then from HTML attributes if defined, and default values
   * otherwise.
   */
  initFormProperties(): void {
    const formValues = safeLocalStorage.getItem(FORM_VALUES_LOCAL_STORAGE_KEY);
    const attr = (k: string) => this.attributes.getNamedItem(k)?.value;

    this.zip = formValues?.zip ?? attr('zip') ?? DEFAULT_ZIP;
    this.ownerStatus =
      formValues?.ownerStatus ??
      (attr('owner-status') as OwnerStatus) ??
      DEFAULT_OWNER_STATUS;
    this.householdIncome =
      formValues?.householdIncome ??
      attr('household-income') ??
      DEFAULT_HOUSEHOLD_INCOME;
    this.householdSize =
      formValues?.householdSize ??
      attr('household-size') ??
      DEFAULT_HOUSEHOLD_SIZE;
    this.taxFiling =
      formValues?.taxFiling ??
      (attr('tax-filing') as FilingStatus) ??
      DEFAULT_TAX_FILING;
    this.projects = formValues?.projects ?? [];
    this.utility = formValues?.utility ?? DEFAULT_UTILITY;

    // Force a re-render of the form
    this.formKey++;
  }

  submit(formValues: FormValues) {
    this.zip = formValues.zip;
    this.ownerStatus = formValues.ownerStatus;
    this.householdIncome = formValues.householdIncome;
    this.householdSize = formValues.householdSize;
    this.taxFiling = formValues.taxFiling;
    this.utility = formValues.utility || '';
    this.projects = formValues.projects || [];

    safeLocalStorage.setItem(FORM_VALUES_LOCAL_STORAGE_KEY, formValues);

    const email = formValues.email;
    if (email && !this.wasEmailSubmitted) {
      submitEmailSignup(this.apiHost, this.apiKey, email, this.zip);
      // This hides the email field
      this.wasEmailSubmitted = true;
    }

    this._task.run();

    this.dispatchEvent(
      new CustomEvent('calculator-submitted', {
        bubbles: true,
        composed: true,
        detail: {
          formData: formValues,
        },
      }),
    );
  }

  resetFormValues() {
    safeLocalStorage.removeItem(FORM_VALUES_LOCAL_STORAGE_KEY);
    this.initFormProperties();
    this.dispatchEvent(
      new Event('calculator-reset', { bubbles: true, composed: true }),
    );
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
      this.reactElements,
      this.reactRoots,
    );
  }

  isFormComplete() {
    return !!(
      this.zip &&
      this.ownerStatus &&
      this.taxFiling &&
      this.householdIncome &&
      this.householdSize &&
      this.projects
    );
  }

  private _task = new Task(this, {
    autoRun: false,
    task: async () => {
      if (!this.isFormComplete()) {
        // this is a special response type provided by Task to keep it in the INITIAL state
        return initialState;
      }

      const query = new URLSearchParams({
        language: this.lang,
        include_beta_states: '' + this.includeBetaStates,
        'location[zip]': this.zip,
        owner_status: this.ownerStatus,
        household_income: this.householdIncome,
        tax_filing: this.taxFiling,
        household_size: this.householdSize,
      });
      if (this.utility) {
        query.set('utility', this.utility);
      }
      Object.values(PROJECTS).forEach(project => {
        project.items.forEach(item => {
          query.append('items', item);
        });
      });

      return fetchApi<APIResponse>(
        this.apiKey,
        this.apiHost,
        '/api/v1/calculator',
        query,
      );
    },
    onComplete: () =>
      waitAndScrollTo(
        this.shadowRoot!,
        '#interested-incentives, #other-incentives',
      ),
    onError: () => waitAndScrollTo(this.shadowRoot!, '#error-message'),
  });

  override render() {
    this.reactElements.set(
      'form',
      <CalculatorForm
        key={this.formKey}
        stateId={this.state}
        initialValues={{
          zip: this.zip,
          ownerStatus: this.ownerStatus,
          householdIncome: this.householdIncome,
          householdSize: this.householdSize,
          taxFiling: this.taxFiling,
          utility: this.utility,
          projects: this.projects,
        }}
        showEmailField={this.showEmail && !this.wasEmailSubmitted}
        showProjectField={true}
        utilityFetcher={zip => {
          const query = new URLSearchParams({
            language: this.lang,
            include_beta_states: '' + this.includeBetaStates,
            'location[zip]': zip,
          });

          return fetchApi<APIUtilitiesResponse>(
            this.apiKey,
            this.apiHost,
            '/api/v1/utilities',
            query,
          );
        }}
        tooltipSize={13}
        calculateButtonContent={msg('Calculate')}
        onSubmit={values => this.submit(values)}
        gridClass={'grid-2-2-1 grid-2-2-1--align-start'}
      />,
    );

    return html`
      <div class="calculator">
        <div class="card card-content">
          <div class="form-title">
            <h1 class="form-title__text">${msg('Your household info')}</h1>
            <div>
              <button
                class="text-button"
                @click=${() => this.resetFormValues()}
              >
                ${msg('Reset')}
              </button>
            </div>
          </div>
          <div class="privacy-message">
            ${msg(
              'We’re dedicated to safeguarding your privacy. We never share or sell your personal information.',
            )}
          </div>
          <div id="form" class="react-root"></div>
        </div>
        ${this._task.render({
          initial: () => nothing,
          pending: loadingTemplate,
          error: errorTemplate,
          complete: response => [
            html`<div class="separator"></div>`,
            stateIncentivesTemplate(
              (rootId, element) => this.reactElements.set(rootId, element),
              response,
              this.projects,
              newOtherSelection => (this.selectedOtherTab = newOtherSelection),
              newSelection => (this.selectedProjectTab = newSelection),
              this.showEmail
                ? (email: string) => {
                    submitEmailSignup(
                      this.apiHost,
                      this.apiKey,
                      email,
                      this.zip,
                    );
                    this.wasEmailSubmitted = true;
                  }
                : null,
              this.selectedOtherTab,
              this.selectedProjectTab,
            ),
          ],
        })}
      </div>
      ${CALCULATOR_FOOTER()}
    `;
  }
}

/**
 * Tell TypeScript that the HTML tag's type signature corresponds to the
 * class's type signature.
 */
declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-state-calculator': RewiringAmericaStateCalculator;
  }
}
