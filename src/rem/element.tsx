import { Savings } from '@rewiringamerica/rem';
import tailwindStyles from 'bundle-text:../tailwind.css';
import { FC, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { DEFAULT_CALCULATOR_API_HOST, fetchApi } from '../api/fetch';
import { FetchState } from '../api/fetch-state';
import { Upgrade } from '../api/rem-types';
import { CalculatorFooter } from '../calculator-footer';
import { Card } from '../components/card';
import { allLocales } from '../i18n/locales';
import { LocaleContext, useTranslated } from '../i18n/use-translated';
import { safeLocalStorage } from '../safe-local-storage';
import { RemForm, RemFormLabels, RemFormValues } from './form';
import { RemFormSnapshot } from './form-snapshot';
import { UpgradeOptions } from './upgrade-options';

/**
 * If you make a backward-incompatible change to the format of form value
 * storage, increment the version in this key.
 */
const FORM_VALUES_LOCAL_STORAGE_KEY = 'RA-calc-rem-form-values-v1';
declare module '../safe-local-storage' {
  interface SafeLocalStorageMap {
    [FORM_VALUES_LOCAL_STORAGE_KEY]: Partial<RemFormValues>;
  }
}

const RemCalculator: FC<{
  shadowRoot: ShadowRoot;
  apiHost: string;
  apiKey: string;
}> = ({ apiHost, apiKey }) => {
  const { msg } = useTranslated();

  const [submittedFormValues, setSubmittedFormValues] =
    useState<RemFormValues | null>(null);
  const [submittedFormLabels, setSubmittedFormLabels] =
    useState<RemFormLabels | null>(null);

  const [fetchState, setFetchState] = useState<FetchState<Savings>>({
    state: 'init',
  });

  const startFetch = (upgrade: Upgrade) => {
    setFetchState({ state: 'loading' });

    const query = new URLSearchParams({
      upgrade,
      address: submittedFormValues!.address,
      heating_fuel: submittedFormValues!.heatingFuel,
      water_heater_fuel: submittedFormValues!.waterHeatingFuel ?? undefined,
    });

    fetchApi(apiKey, apiHost, '/api/v1/rem/address', query, msg)
      .then(response =>
        setFetchState({ state: 'complete', response: response as Savings }),
      )
      .catch(error =>
        setFetchState({ state: 'error', message: error.message }),
      );
  };

  // Incrementing the form key will cause the form to drop its state,
  // reinitializing the input values from initial (constructed above).
  const [formKey, setFormKey] = useState(0);
  const resetForm = () => {
    safeLocalStorage.removeItem(FORM_VALUES_LOCAL_STORAGE_KEY);
    setFormKey(fk => fk + 1);
  };

  return (
    <div>
      <Card padding="medium" theme="grey" isFlat>
        {!submittedFormValues || !submittedFormLabels ? (
          <RemForm
            key={formKey}
            onReset={resetForm}
            onSubmit={(values, labels) => {
              safeLocalStorage.setItem(FORM_VALUES_LOCAL_STORAGE_KEY, values);
              setSubmittedFormValues(values);
              setSubmittedFormLabels(labels);
            }}
          />
        ) : fetchState.state !== 'complete' ? (
          // TODO loading state
          <>
            <RemFormSnapshot formLabels={submittedFormLabels}></RemFormSnapshot>
            <UpgradeOptions
              includeWaterHeater={submittedFormValues.waterHeatingFuel !== null}
              onUpgradeSelected={startFetch}
            />
          </>
        ) : (
          // TODO real display
          <pre>{JSON.stringify(fetchState.response, null, 2)}</pre>
        )}
      </Card>
    </div>
  );
};

export class ElectrificationImpactsCalculator extends HTMLElement {
  /* supported properties to control which API path and key is used to load the calculator results */
  apiKey: string = '';
  apiHost: string = DEFAULT_CALCULATOR_API_HOST;

  reactRootCalculator: Root | null = null;
  reactRootFooter: Root | null = null;

  static observedAttributes = ['lang', 'api-key', 'api-host'] as const;

  attributeChangedCallback(
    attr: (typeof ElectrificationImpactsCalculator.observedAttributes)[number],
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

  private render() {
    this.reactRootCalculator?.render(
      <LocaleContext.Provider value={this.lang}>
        <RemCalculator
          shadowRoot={this.shadowRoot!}
          apiHost={this.apiHost}
          apiKey={this.apiKey}
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
