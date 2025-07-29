import tailwindStyles from 'bundle-text:../tailwind.css';
import { FC, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { DEFAULT_CALCULATOR_API_HOST, fetchApi } from '../api/fetch';
import { FetchState } from '../api/fetch-state';
import {
  INTERNAL_UPGRADES,
  RemAddressResponse,
  RemErrorType,
  Upgrade,
} from '../api/rem-types';
import { FooterCopy } from '../calculator-footer';
import { PrimaryButton } from '../components/buttons';
import { Spinner } from '../components/spinner';
import { allLocales } from '../i18n/locales';
import { LocaleContext, useTranslated } from '../i18n/use-translated';
import { safeLocalStorage } from '../safe-local-storage';
import { ApproximateResults } from './ApproximateResults';
import { DetailedResults } from './DetailedResults';
import {
  BuildingType,
  MIN_ADDRESS_LENGTH,
  RemForm,
  RemFormLabels,
  RemFormValues,
  getLabelsForValues,
} from './RemForm';
import { RemFormSnapshot } from './RemFormSnapshot';
import { UpgradeOptions, getLabelForUpgrade } from './UpgradeOptions';

/**
 * If you make a backward-incompatible change to the format of form value
 * storage, increment the version in this key.
 */
const REM_FORM_VALUES_LOCAL_STORAGE_KEY = 'RA-calc-rem-form-values-v1';
const REM_UPGRADE_LOCAL_STORAGE_KEY = 'RA-calc-rem-upgrade-v1';
declare module '../safe-local-storage' {
  interface SafeLocalStorageMap {
    [REM_FORM_VALUES_LOCAL_STORAGE_KEY]: Partial<RemFormValues>;
    [REM_UPGRADE_LOCAL_STORAGE_KEY]: Upgrade;
  }
}

const DEFAULT_UPGRADES: Upgrade[] = [
  Upgrade.HeatPump,
  Upgrade.Weatherization,
  Upgrade.HeatPumpAndWeatherization,
  Upgrade.WaterHeater,
];

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

function parseUpgrades(upgradeStr: string): Upgrade[] {
  if (!upgradeStr) {
    return DEFAULT_UPGRADES;
  }

  const fields = upgradeStr.split(',').map(s => s.toLowerCase());
  const validUpgrades = Object.values(Upgrade) as string[];

  for (const field of fields) {
    if (!validUpgrades.includes(field)) {
      throw new Error(`Invalid upgrade: "${field}"`);
    }
  }

  return fields as Upgrade[];
}

const RemCalculator: FC<{
  shadowRoot: ShadowRoot;
  apiHost: string;
  apiKey: string;
  upgrades: string;
}> = ({ shadowRoot, apiHost, apiKey, upgrades }) => {
  const { msg } = useTranslated();

  const parsedUpgrades = parseUpgrades(upgrades);

  const getInitialFormValues = (): RemFormValues => {
    const saved = safeLocalStorage.getItem(REM_FORM_VALUES_LOCAL_STORAGE_KEY);
    return {
      buildingType: saved?.buildingType || '',
      address: saved?.address || '',
      heatingFuel: saved?.heatingFuel || '',
      waterHeatingFuel: saved?.waterHeatingFuel || '',
    };
  };
  const getInitialUpgrade = (): Upgrade | null =>
    safeLocalStorage.getItem(REM_UPGRADE_LOCAL_STORAGE_KEY);

  const [formValues, setFormValues] =
    useState<RemFormValues>(getInitialFormValues);
  const [upgradeValue, setUpgradeValue] = useState<Upgrade | null>(
    getInitialUpgrade,
  );

  const [submittedFormLabels, setSubmittedFormLabels] =
    useState<RemFormLabels | null>(null);
  const [submittedUpgradeLabel, setSubmittedUpgradeLabel] = useState<
    string | null
  >(null);

  const [fetchState, setFetchState] = useState<FetchState<RemAddressResponse>>({
    state: 'init',
  });

  const submit = () => {
    safeLocalStorage.setItem(REM_FORM_VALUES_LOCAL_STORAGE_KEY, formValues);
    safeLocalStorage.setItem(REM_UPGRADE_LOCAL_STORAGE_KEY, upgradeValue!);

    setSubmittedFormLabels(getLabelsForValues(formValues, msg));
    setSubmittedUpgradeLabel(getLabelForUpgrade(upgradeValue!, msg));

    setFetchState({ state: 'loading' });

    const query = new URLSearchParams({
      upgrade: upgradeValue!,
      address: formValues!.address,
      heating_fuel: formValues!.heatingFuel,
      ...(formValues!.waterHeatingFuel
        ? { water_heater_fuel: formValues!.waterHeatingFuel }
        : {}),
    });

    const path = INTERNAL_UPGRADES.has(upgradeValue!)
      ? '/api/v1/internal/rem/address'
      : '/api/v1/rem/address';

    fetchApi<RemAddressResponse>(apiKey, apiHost, path, query, msg)
      .then(response => setFetchState({ state: 'complete', response }))
      .catch(error =>
        setFetchState({
          state: 'error',
          message: error.message,
          type: error.type,
        }),
      );

    shadowRoot.dispatchEvent(
      new CustomEvent('bi-calculator-submitted', {
        bubbles: true,
        composed: true,
        detail: { formData: { ...formValues, upgrade: upgradeValue } },
      }),
    );
  };

  const resetForm = () => {
    safeLocalStorage.removeItem(REM_FORM_VALUES_LOCAL_STORAGE_KEY);
    safeLocalStorage.removeItem(REM_UPGRADE_LOCAL_STORAGE_KEY);
    setFormValues(getInitialFormValues());
    setUpgradeValue(getInitialUpgrade());
  };

  const children = [];

  if (
    !submittedFormLabels ||
    !submittedUpgradeLabel ||
    fetchState.state === 'error'
  ) {
    const canSubmit =
      !!formValues.buildingType &&
      formValues.buildingType !== BuildingType.Apartment &&
      formValues.address.length >= MIN_ADDRESS_LENGTH &&
      !!formValues.heatingFuel &&
      !!upgradeValue;

    children.push(
      <form
        className="flex flex-col m-0 bg-grey-100"
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
      >
        <RemForm
          key="form"
          errorType={
            fetchState.state === 'error'
              ? (fetchState.type as RemErrorType)
              : null
          }
          values={formValues}
          onValuesChange={newValues => {
            setFormValues(newValues);

            // If water heater upgrade is unavailable, deselect it
            if (
              !newValues.waterHeatingFuel &&
              upgradeValue === Upgrade.WaterHeater
            ) {
              setUpgradeValue(null);
            }
          }}
          onReset={resetForm}
        />
        <div className="h-px mx-4 bg-grey-200">{/* separator */}</div>
        <UpgradeOptions
          key="upgradeOptions"
          upgrades={parsedUpgrades}
          includeWaterHeater={!!formValues.waterHeatingFuel}
          selectedUpgrade={upgradeValue}
          onUpgradeSelected={setUpgradeValue}
        />
        <div className="mx-4 mb-4">
          <PrimaryButton disabled={!canSubmit} type="submit">
            {msg('Calculate impact')}
          </PrimaryButton>
        </div>
      </form>,
    );
  } else {
    children.push(
      <RemFormSnapshot
        key="snapshot"
        formLabels={submittedFormLabels}
        upgradeLabel={submittedUpgradeLabel}
        onEdit={() => {
          setSubmittedFormLabels(null);
          setSubmittedUpgradeLabel(null);
        }}
      />,
    );

    if (fetchState.state === 'loading') {
      children.push(<Loading key="loading" />);
    } else if (fetchState.state === 'complete') {
      if (fetchState.response.estimate_type === 'puma_level') {
        children.push(
          <ApproximateResults key="results" savings={fetchState.response} />,
        );
      } else {
        children.push(
          <DetailedResults key="results" savings={fetchState.response} />,
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

  /** Attribute to customize the list of available upgrades. */
  upgrades: string = '';

  reactRootCalculator: Root | null = null;

  static observedAttributes = [
    'lang',
    'api-key',
    'api-host',
    'upgrades',
  ] as const;

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
    } else if (attr === 'upgrades') {
      this.upgrades = newValue ?? '';
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
          upgrades={this.upgrades}
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
