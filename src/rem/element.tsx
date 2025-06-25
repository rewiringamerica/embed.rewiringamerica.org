import tailwindStyles from 'bundle-text:../tailwind.css';
import { FC, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { DEFAULT_CALCULATOR_API_HOST, fetchApi } from '../api/fetch';
import { FetchState } from '../api/fetch-state';
import { RemAddressResponse, Upgrade } from '../api/rem-types';
import { FooterCopy } from '../calculator-footer';
import { TextButton } from '../components/buttons';
import { EditIcon } from '../components/icons';
import { Spinner } from '../components/spinner';
import { allLocales } from '../i18n/locales';
import { LocaleContext, useTranslated } from '../i18n/use-translated';
import { safeLocalStorage } from '../safe-local-storage';
import { ApproximateResults } from './ApproximateResults';
import { DetailedResults } from './DetailedResults';
import { RemForm, RemFormLabels, RemFormValues } from './RemForm';
import { RemFormSnapshot } from './RemFormSnapshot';
import { UpgradeOptions } from './UpgradeOptions';

/**
 * If you make a backward-incompatible change to the format of form value
 * storage, increment the version in this key.
 */
const REM_FORM_VALUES_LOCAL_STORAGE_KEY = 'RA-calc-rem-form-values-v1';
declare module '../safe-local-storage' {
  interface SafeLocalStorageMap {
    [REM_FORM_VALUES_LOCAL_STORAGE_KEY]: Partial<RemFormValues>;
  }
}

const Header = () => {
  const { msg } = useTranslated();
  return (
    <div className="h-11 flex justify-between px-4 py-3 bg-white">
      <img
        src={new URL('../../static/logo.png', import.meta.url).toString()}
        width="61"
        height="20"
      />
      <span className="text-sm font-medium leading-normal">
        {msg('Bill Impact Calculator')}
      </span>
    </div>
  );
};

const Loading = () => {
  const { msg } = useTranslated();
  return (
    <div
      key="spinner"
      className="bg-grey-100 p-4 flex flex-col items-center py-12 gap-4"
    >
      <div className="w-25 h-25 text-grey-400">
        <Spinner />
      </div>
      <div className="text-grey-400 text-lg font-medium leading-tight">
        {msg('Calculating impact...')}
      </div>
    </div>
  );
};

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
  const [submittedUpgradeLabel, setSubmittedUpgradeLabel] = useState<
    string | null
  >(null);

  const [fetchState, setFetchState] = useState<FetchState<RemAddressResponse>>({
    state: 'init',
  });

  const startFetch = (upgrade: Upgrade, label: string) => {
    setSubmittedUpgradeLabel(label);
    setFetchState({ state: 'loading' });

    const query = new URLSearchParams({
      upgrade,
      address: submittedFormValues!.address,
      heating_fuel: submittedFormValues!.heatingFuel,
      ...(submittedFormValues!.waterHeatingFuel
        ? { water_heater_fuel: submittedFormValues!.waterHeatingFuel }
        : {}),
    });

    fetchApi<RemAddressResponse>(
      apiKey,
      apiHost,
      '/api/v1/rem/address',
      query,
      msg,
    )
      .then(response => setFetchState({ state: 'complete', response }))
      .catch(error =>
        setFetchState({ state: 'error', message: error.message }),
      );
  };

  // Incrementing the form key will cause the form to drop its state,
  // reinitializing the input values from initial (constructed above).
  const [formKey, setFormKey] = useState(0);
  const resetForm = () => {
    safeLocalStorage.removeItem(REM_FORM_VALUES_LOCAL_STORAGE_KEY);
    setFormKey(fk => fk + 1);
  };

  const getInitialFormValues = (): RemFormValues => {
    const saved = safeLocalStorage.getItem(REM_FORM_VALUES_LOCAL_STORAGE_KEY);
    return {
      buildingType: saved?.buildingType || '',
      address: saved?.address || '',
      heatingFuel: saved?.heatingFuel || '',
      waterHeatingFuel: saved?.waterHeatingFuel || '',
    };
  };

  const children = [];

  if (!submittedFormValues || !submittedFormLabels) {
    children.push(
      <RemForm
        key={formKey}
        initialValues={getInitialFormValues()}
        onReset={resetForm}
        onSubmit={(values, labels) => {
          safeLocalStorage.setItem(REM_FORM_VALUES_LOCAL_STORAGE_KEY, values);
          setSubmittedFormValues(values);
          setSubmittedFormLabels(labels);
        }}
      />,
    );
  } else {
    children.push(
      <RemFormSnapshot
        key="snapshot"
        formLabels={submittedFormLabels}
        onEdit={() => {
          setSubmittedFormLabels(null);
          setSubmittedFormValues(null);
          setSubmittedUpgradeLabel(null);
        }}
      />,
    );

    if (!submittedUpgradeLabel) {
      children.push(
        <UpgradeOptions
          key="upgradeOptions"
          includeWaterHeater={!!submittedFormValues.waterHeatingFuel}
          onUpgradeSelected={startFetch}
        />,
      );
    } else {
      children.push(
        <div
          key="upgradeLabel"
          className="flex flex-col bg-white p-4 pt-3 gap-3"
        >
          <div className="flex justify-between">
            <span className="font-medium leading-normal">
              {msg('Selected upgrade')}
            </span>
            <TextButton onClick={() => setSubmittedUpgradeLabel(null)}>
              <div className="flex items-center gap-1.5">
                <EditIcon w={16} h={16} />
                {msg('Edit')}
              </div>
            </TextButton>
          </div>
          <div className="rounded p-2 leading-normal text-grey-900 border border-purple-200 bg-purple-100">
            {submittedUpgradeLabel}
          </div>
        </div>,
      );

      if (fetchState.state === 'loading') {
        children.push(<Loading key="loading" />);
      } else if (fetchState.state === 'complete') {
        // TODO this is just for demo purposes
        if (submittedUpgradeLabel === 'Heat pump + weatherization') {
          children.push(
            <ApproximateResults key="results" savings={fetchState.response} />,
          );
        } else {
          children.push(
            <DetailedResults key="results" savings={fetchState.response} />,
          );
        }
      } else if (fetchState.state === 'error') {
        // TODO real error state
        children.push(
          <div
            key="error"
            className="flex flex-col gap-2 p-4 bg-red-100 text-sm leading-normal"
          >
            <span className="text-grey-400 uppercase">Error</span>
            {fetchState.message}
          </div>,
        );
      }
    }
  }

  children.push(
    <div
      key="footer"
      className="bg-white text-sm px-4 py-3 leading-normal text-center"
    >
      <FooterCopy />
    </div>,
  );

  return (
    <div className="flex flex-col gap-px bg-grey-200 rounded-xl border border-grey-200 overflow-clip">
      <Header />
      {children}
    </div>
  );
};

export class BillImpactCalculator extends HTMLElement {
  /* supported properties to control which API path and key is used to load the calculator results */
  apiKey: string = '';
  apiHost: string = DEFAULT_CALCULATOR_API_HOST;

  reactRootCalculator: Root | null = null;

  static observedAttributes = ['lang', 'api-key', 'api-host'] as const;

  attributeChangedCallback(
    attr: (typeof BillImpactCalculator.observedAttributes)[number],
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
