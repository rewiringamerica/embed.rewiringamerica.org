import { FC } from 'react';
import { HeatingFuel, WaterHeatingFuel } from '../api/rem-types';
import { TextButton } from '../components/buttons';
import { FormLabel } from '../components/form-label';
import { Option, Select, labelForValue } from '../components/select';
import { TextInput } from '../components/text-input';
import { useTranslated } from '../i18n/use-translated';
import { MsgFn } from '../package-index';

export const MIN_ADDRESS_LENGTH = 15;

export enum BuildingType {
  House = 'house',
  Apartment = 'apartment',
  MobileHome = 'mobile_home',
  Townhome = 'townhome',
}

const BUILDING_OPTIONS: (msg: MsgFn) => Option<BuildingType>[] = msg => [
  {
    value: BuildingType.House,
    label: msg('House', { desc: 'building type' }),
  },
  {
    value: BuildingType.Apartment,
    label: msg('Apartment', { desc: 'building type' }),
  },
  {
    value: BuildingType.MobileHome,
    label: msg('Mobile home', { desc: 'building type' }),
  },
  {
    value: BuildingType.Townhome,
    label: msg('Townhome', { desc: 'building type' }),
  },
];

const HEATING_OPTIONS: (msg: MsgFn) => Option<HeatingFuel>[] = msg => [
  {
    value: HeatingFuel.Electricity,
    label: msg('Electricity', { desc: 'heating fuel option' }),
  },
  {
    value: HeatingFuel.NaturalGas,
    label: msg('Natural gas', { desc: 'heating fuel option' }),
  },
  {
    value: HeatingFuel.FuelOil,
    label: msg('Fuel oil', { desc: 'heating fuel option' }),
  },
  {
    value: HeatingFuel.Propane,
    label: msg('Propane', { desc: 'heating fuel option' }),
  },
];

const NO_WATER_HEATING_FUEL = 'none';
const WATER_HEATING_OPTIONS: (
  msg: MsgFn,
) => Option<WaterHeatingFuel | typeof NO_WATER_HEATING_FUEL>[] = msg => [
  // Include option to clear selection because the field is optional
  {
    value: NO_WATER_HEATING_FUEL,
    label: 'No selection',
  },
  {
    value: WaterHeatingFuel.Electricity,
    label: msg('Electricity', { desc: 'heating fuel option' }),
  },
  {
    value: WaterHeatingFuel.NaturalGas,
    label: msg('Natural gas', { desc: 'heating fuel option' }),
  },
  {
    value: WaterHeatingFuel.FuelOil,
    label: msg('Fuel oil', { desc: 'heating fuel option' }),
  },
  {
    value: WaterHeatingFuel.Propane,
    label: msg('Propane', { desc: 'heating fuel option' }),
  },
];

export interface RemFormValues {
  buildingType: BuildingType | '';
  address: string;
  heatingFuel: HeatingFuel | '';
  waterHeatingFuel: WaterHeatingFuel | '';
}

export interface RemFormLabels {
  buildingType: string;
  address: string;
  heatingFuel: string;
  waterHeatingFuel: string | null;
}

export function getLabelsForValues(
  values: RemFormValues,
  msg: MsgFn,
): RemFormLabels {
  return {
    buildingType: labelForValue(BUILDING_OPTIONS(msg), values.buildingType)!,
    address: values.address,
    heatingFuel: labelForValue(HEATING_OPTIONS(msg), values.heatingFuel)!,
    waterHeatingFuel:
      values.waterHeatingFuel !== ''
        ? labelForValue(WATER_HEATING_OPTIONS(msg), values.waterHeatingFuel)!
        : null,
  };
}

export const RemForm: FC<{
  values: RemFormValues;
  onValuesChange: (v: RemFormValues) => void;
  onReset: () => void;
}> = ({ values, onValuesChange, onReset }) => {
  const { msg } = useTranslated();

  const { buildingType, address, heatingFuel, waterHeatingFuel } = values;

  const isBadBuildingType = buildingType === BuildingType.Apartment;
  const areValuesModified =
    !!buildingType || !!address || !!heatingFuel || !!waterHeatingFuel;

  const addressHelpText = msg(
    'Enter your street address, city, state, and ZIP code.',
  );

  return (
    <div className="flex flex-col gap-4 p-4 bg-grey-100">
      <div className="flex justify-between items-baseline">
        <h1 className="text-base sm:text-md font-medium leading-tight">
          {msg('Your household info')}
        </h1>
        <div>
          <TextButton
            disabled={!areValuesModified}
            type="reset"
            onClick={onReset}
          >
            {msg('Reset')}
          </TextButton>
        </div>
      </div>
      <div className="text-sm leading-normal">
        {msg(
          'Enter your household information to calculate the energy bill savings and emissions reductions you could get from upgrades to your home.',
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="buildingType"
          options={BUILDING_OPTIONS(msg)}
          labelText={msg('Household type')}
          errorText={
            isBadBuildingType
              ? msg('Our model currently doesn’t support apartments.')
              : undefined
          }
          currentValue={buildingType}
          placeholder={msg('Select household type...')}
          onChange={val => onValuesChange({ ...values, buildingType: val })}
        />

        <div>
          <FormLabel>
            <label htmlFor="address">{msg('Address')}</label>
          </FormLabel>
          <TextInput
            id="address"
            name="address"
            // Intentionally not localizable. Also not a real address
            placeholder="1234 Main St, Providence, RI 02903"
            required
            type="text"
            minLength={MIN_ADDRESS_LENGTH}
            inputMode="text"
            disabled={isBadBuildingType}
            autoComplete="street-address"
            value={address}
            onChange={e =>
              onValuesChange({ ...values, address: e.target.value })
            }
          />
          <div className="mx-3 mt-1 text-grey-400 text-xsm leading-normal">
            {addressHelpText}
          </div>
        </div>
        <Select
          id="heatingFuel"
          options={HEATING_OPTIONS(msg)}
          labelText={msg('Heating fuel')}
          disabled={isBadBuildingType}
          currentValue={heatingFuel}
          placeholder={msg('Select heating fuel...')}
          onChange={val => onValuesChange({ ...values, heatingFuel: val })}
        ></Select>
        <Select
          id="waterHeatingFuel"
          options={WATER_HEATING_OPTIONS(msg)}
          labelText={msg('Water heating fuel (optional)')}
          helpText={msg(
            'Select your water heating fuel to see the impact of a water heater upgrade.',
          )}
          disabled={isBadBuildingType}
          currentValue={waterHeatingFuel}
          placeholder={msg('Select water heating fuel...')}
          onChange={val =>
            onValuesChange({
              ...values,
              waterHeatingFuel: val === NO_WATER_HEATING_FUEL ? '' : val,
            })
          }
        />
      </div>
    </div>
  );
};
