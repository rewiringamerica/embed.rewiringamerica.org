import { Savings } from '@rewiringamerica/rem';
import tailwindStyles from 'bundle-text:../tailwind.css';
import { FC, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { DEFAULT_CALCULATOR_API_HOST, fetchApi } from '../api/fetch';
import { FetchState } from '../api/fetch-state';
import { Upgrade } from '../api/rem-types';
import { CalculatorFooter } from '../calculator-footer';
import { TextButton } from '../components/buttons';
import { Card } from '../components/card';
import { allLocales } from '../i18n/locales';
import { LocaleContext, useTranslated } from '../i18n/use-translated';
import { safeLocalStorage } from '../safe-local-storage';
import { FormValues, RemForm } from './form';
import { UpgradeOptions } from './upgrade-options';

/**
 * If you make a backward-incompatible change to the format of form value
 * storage, increment the version in this key.
 */
const FORM_VALUES_LOCAL_STORAGE_KEY = 'RA-calc-rem-form-values-v1';
declare module '../safe-local-storage' {
  interface SafeLocalStorageMap {
    [FORM_VALUES_LOCAL_STORAGE_KEY]: Partial<FormValues>;
  }
}

const RemCalculator: FC<{
  shadowRoot: ShadowRoot;
  apiHost: string;
  apiKey: string;
}> = ({ apiHost, apiKey }) => {
  const { msg } = useTranslated();

  const [submittedFormValues, setSubmittedFormValues] =
    useState<FormValues | null>(null);
  // form labels

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
        <div className="flex justify-between items-baseline">
          <h1 className="text-base sm:text-md font-medium leading-tight">
            {msg('Your household info')}
          </h1>
          <div>
            <TextButton onClick={resetForm}>{msg('Reset')}</TextButton>
          </div>
        </div>

        <div className="text-sm leading-normal">
          {msg(
            'Enter your household information to calculate the energy bill savings and emissions reductions you could get from upgrades to your home.',
          )}
        </div>

        {!submittedFormValues ? (
          <RemForm
            key={formKey}
            onSubmit={values => {
              safeLocalStorage.setItem(FORM_VALUES_LOCAL_STORAGE_KEY, values);
              setSubmittedFormValues(values);
            }}
          />
        ) : fetchState.state !== 'complete' ? (
          // TODO loading state
          <UpgradeOptions
            includeWaterHeater={submittedFormValues.waterHeatingFuel !== null}
            onUpgradeSelected={startFetch}
          />
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
