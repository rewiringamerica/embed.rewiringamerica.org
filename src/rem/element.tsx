import tailwindStyles from 'bundle-text:../tailwind.css';
import { FC, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { DEFAULT_CALCULATOR_API_HOST } from '../api/fetch';
import { CalculatorFooter } from '../calculator-footer';
import { TextButton } from '../components/buttons';
import { Card } from '../components/card';
import { allLocales } from '../i18n/locales';
import { LocaleContext, useTranslated } from '../i18n/use-translated';
import { safeLocalStorage } from '../safe-local-storage';
import { FormValues, RemForm } from './form';

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

  const [formKey, setFormKey] = useState(0);

  // Incrementing the form key will cause the form to drop its state,
  // reinitializing the input values from initial (constructed above).
  const resetFormValues = () => {
    safeLocalStorage.removeItem(FORM_VALUES_LOCAL_STORAGE_KEY);
    setFormKey(fk => fk + 1);
  };

  const submitForm = (formValues: FormValues) => {
    safeLocalStorage.setItem(FORM_VALUES_LOCAL_STORAGE_KEY, formValues);
    // set snapshot
    console.log(formValues);
  };

  return (
    <div>
      <Card padding="medium" theme="grey" isFlat>
        <div className="flex justify-between items-baseline">
          <h1 className="text-base sm:text-md font-medium leading-tight">
            {msg('Your household info')}
          </h1>
          <div>
            <TextButton onClick={resetFormValues}>{msg('Reset')}</TextButton>
          </div>
        </div>

        <div className="text-sm leading-normal">
          {msg(
            'Enter your household information to calculate the energy bill savings and emissions reductions you could get from upgrades to your home.',
          )}
        </div>

        <RemForm key={formKey} loading={false} onSubmit={submitForm} />
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
