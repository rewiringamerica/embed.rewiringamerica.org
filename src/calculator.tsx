import { Task, initialState } from '@lit-labs/task';
import shoelaceTheme from 'bundle-text:@shoelace-style/shoelace/dist/themes/light.css';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Root } from 'react-dom/client';
import { fetchApi } from './api/fetch';
import { CalculatorFooter } from './calculator-footer';
import { CalculatorForm, FormValues, buttonStyles } from './calculator-form';
import {
  FilingStatus,
  ICalculatedIncentiveResults,
  OwnerStatus,
} from './calculator-types';
import { IncentiveDetails, detailsStyles } from './incentive-details';
import { IncentiveSummary, summaryStyles } from './incentive-summary';
import { renderReactElements } from './react-roots';
import { selectStyles } from './select';
import { baseStyles, baseVariables, cardStyles, gridStyles } from './styles';
import { inputStyles } from './styles/input';
import { tooltipStyles } from './tooltip';

const loadedTemplate = (
  results: ICalculatedIncentiveResults,
  ownerStatus: OwnerStatus,
  hideDetails: boolean,
  hideSummary: boolean,
) => (
  <>
    {hideSummary ? null : (
      <IncentiveSummary ownerStatus={ownerStatus} results={results} />
    )}
    {hideDetails ? null : <IncentiveDetails results={results} />}
  </>
);

const loadingTemplate = () => (
  <div className="card card-content">Loading...</div>
);
const errorTemplate = (error: unknown) => (
  <div className="card card-content">
    {typeof error === 'object' && error && 'message' in error && error.message
      ? (error.message as string)
      : 'Error loading incentives.'}
  </div>
);
const DEFAULT_CALCULATOR_API_HOST: string = 'https://api.rewiringamerica.org';

@customElement('rewiring-america-calculator')
export class RewiringAmericaCalculator extends LitElement {
  static override styles = [
    unsafeCSS(shoelaceTheme),
    baseVariables,
    baseStyles,
    cardStyles,
    gridStyles,
    buttonStyles,
    inputStyles,
    tooltipStyles,
    selectStyles,
    summaryStyles,
    ...detailsStyles,
  ];

  /* supported properties to control showing/hiding of each card in the widget */

  @property({ type: Boolean, attribute: 'hide-form' })
  hideForm: boolean = false;

  @property({ type: Boolean, attribute: 'hide-summary' })
  hideSummary: boolean = false;

  @property({ type: Boolean, attribute: 'hide-details' })
  hideDetails: boolean = false;

  /* supported properties to control which API path and key is used to load the calculator results */

  @property({ type: String, attribute: 'api-key' })
  apiKey: string = '';

  @property({ type: String, attribute: 'api-host' })
  apiHost: string = DEFAULT_CALCULATOR_API_HOST;

  /* supported properties to allow pre-filling the form */

  @property({ type: String, attribute: 'zip' })
  zip: string = '';

  @property({ type: String, attribute: 'owner-status' })
  ownerStatus: OwnerStatus = 'homeowner';

  @property({ type: String, attribute: 'household-income' })
  householdIncome: string = '0';

  @property({ type: String, attribute: 'tax-filing' })
  taxFiling: FilingStatus = 'single';

  @property({ type: String, attribute: 'household-size' })
  householdSize: string = '1';

  /**
   * For the React transition; see react-roots.ts for detail.
   * TODO: this whole mechanism can go away post-React transition
   */
  reactElements: Map<string, React.ReactElement> = new Map();
  reactRoots: Map<string, { reactRoot: Root; domNode: HTMLElement }> =
    new Map();

  submit(formValues: FormValues) {
    this.zip = formValues.zip;
    this.ownerStatus = formValues.ownerStatus;
    this.householdIncome = formValues.householdIncome;
    this.taxFiling = formValues.taxFiling;
    this.householdSize = formValues.householdSize;
  }

  get hideResult() {
    return !(
      this.zip &&
      this.ownerStatus &&
      this.taxFiling &&
      this.householdIncome &&
      this.householdSize
    );
  }

  private _task = new Task(this, {
    // this array of parameters is generated by the `args` function below
    // it's formatted with snake_case to make it really easy to throw into URLSearchParams
    task: async ([
      zip,
      owner_status,
      household_income,
      tax_filing,
      household_size,
    ]) => {
      if (this.hideResult) {
        // this is a special response type provided by Task to keep it in the INITIAL state
        return initialState;
      }
      const query = new URLSearchParams({
        zip,
        owner_status,
        household_income,
        tax_filing,
        household_size,
      });
      if (this.hideForm) {
        query.set('hide_form', '1');
      }
      if (this.hideSummary) {
        query.set('hide_summary', '1');
      }
      if (this.hideResult) {
        query.set('hide_result', '1');
      }
      return await fetchApi<ICalculatedIncentiveResults>(
        this.apiKey,
        this.apiHost,
        '/api/v0/calculator',
        query,
        s => s as string, // Message-localizing function; this frontend is not localized
      );
    },
    // if the args array changes then the task will run again
    args: () => [
      this.zip,
      this.ownerStatus,
      this.householdIncome,
      this.taxFiling,
      this.householdSize,
    ],
  });

  override render() {
    const calculator = (
      <>
        <div className="card card-content">
          <h1>How much money will you get with the Inflation Reduction Act?</h1>
          {this.hideForm ? null : (
            <CalculatorForm
              initialValues={{
                zip: this.zip,
                ownerStatus: this.ownerStatus,
                householdIncome: this.householdIncome,
                taxFiling: this.taxFiling,
                householdSize: this.householdSize,
              }}
              tooltipSize={18}
              onSubmit={e => this.submit(e)}
            />
          )}
        </div>
        {this.hideResult
          ? null
          : this._task.render({
              pending: loadingTemplate,
              complete: results =>
                loadedTemplate(
                  results,
                  this.ownerStatus,
                  this.hideDetails,
                  this.hideSummary,
                ),
              error: errorTemplate,
            })}
      </>
    );

    this.reactElements.set('calc-root', calculator);
    this.reactElements.set('calc-footer', <CalculatorFooter />);
    return html`
      <div class="calculator" id="calc-root"></div>
      <div id="calc-footer"></div>
    `;
  }

  protected override updated() {
    renderReactElements(
      this.renderRoot as ShadowRoot,
      this.reactElements,
      this.reactRoots,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-calculator': RewiringAmericaCalculator;
  }
}
