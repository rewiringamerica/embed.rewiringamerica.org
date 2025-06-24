import { FC, useState } from 'react';
import { HeatingFuel, WaterHeatingFuel } from '../api/rem-types';
import { PrimaryButton, TextButton } from '../components/buttons';
import { FormLabel } from '../components/form-label';
import { Option, Select, labelForValue } from '../components/select';
import { TextInput } from '../components/text-input';
import { useTranslated } from '../i18n/use-translated';
import { MsgFn } from '../package-index';

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

export const RemForm: FC<{
  initialValues: RemFormValues;
  onReset: () => void;
  onSubmit: (v: RemFormValues, l: RemFormLabels) => void;
}> = ({ initialValues, onReset, onSubmit }) => {
  const [buildingType, setBuildingType] = useState(initialValues.buildingType);
  const [address, setAddress] = useState(initialValues.address);
  const [heatingFuel, setHeatingFuel] = useState(initialValues.heatingFuel);
  const [waterHeatingFuel, setWaterHeatingFuel] = useState(
    initialValues.waterHeatingFuel,
  );

  const { msg } = useTranslated();

  const isBadBuildingType = buildingType === BuildingType.Apartment;
  const areValuesModified =
    !!buildingType || !!address || !!heatingFuel || !!waterHeatingFuel;

  return (
    <div className="flex flex-col gap-4 p-4 bg-grey-100">
      <div className="flex justify-between items-baseline">
        <h1 className="text-base sm:text-md font-medium leading-tight">
          {msg('Your household info')}
        </h1>
        <div>
          <TextButton disabled={!areValuesModified} onClick={onReset}>
            {msg('Reset')}
          </TextButton>
        </div>
      </div>
      <div className="text-sm leading-normal">
        {msg(
          'Enter your household information to calculate the energy bill savings and emissions reductions you could get from upgrades to your home.',
        )}
      </div>
      <form
        className="m-0"
        onSubmit={e => {
          e.preventDefault();
          const values: RemFormValues = {
            buildingType: buildingType as BuildingType,
            address,
            heatingFuel: heatingFuel as HeatingFuel,
            waterHeatingFuel:
              waterHeatingFuel !== ''
                ? (waterHeatingFuel as WaterHeatingFuel)
                : '',
          };
          const labels = {
            buildingType: labelForValue(BUILDING_OPTIONS(msg), buildingType)!,
            address,
            heatingFuel: labelForValue(HEATING_OPTIONS(msg), heatingFuel)!,
            waterHeatingFuel:
              waterHeatingFuel !== ''
                ? labelForValue(WATER_HEATING_OPTIONS(msg), waterHeatingFuel)!
                : null,
          };
          onSubmit(values, labels);
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="buildingType"
            options={BUILDING_OPTIONS(msg)}
            labelText={msg('Household type')}
            helpText=" " // empty help text to maintain vertical space
            errorText={
              isBadBuildingType
                ? msg('Our model currently doesn’t support apartments.')
                : undefined
            }
            currentValue={buildingType}
            placeholder={msg('Select household type...')}
            onChange={setBuildingType}
          />

          <div>
            <FormLabel>
              <label htmlFor="address">{msg('Address')}</label>
            </FormLabel>
            <TextInput
              id="address"
              name="address"
              placeholder={msg('Enter address...')}
              required
              type="text"
              minLength={5}
              inputMode="text"
              disabled={isBadBuildingType}
              autoComplete="street-address"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          <Select
            id="heatingFuel"
            options={HEATING_OPTIONS(msg)}
            labelText={msg('Heating fuel')}
            disabled={isBadBuildingType}
            currentValue={heatingFuel}
            placeholder={msg('Select heating fuel...')}
            onChange={setHeatingFuel}
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
              setWaterHeatingFuel(val === NO_WATER_HEATING_FUEL ? '' : val)
            }
          />
          <div className="col-start-[-2] col-end-[-1]">
            <PrimaryButton
              id="calculate"
              disabled={
                !buildingType ||
                buildingType === BuildingType.Apartment ||
                address.length < 5 ||
                !heatingFuel
              }
            >
              {msg('Next: select upgrade')}
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};
