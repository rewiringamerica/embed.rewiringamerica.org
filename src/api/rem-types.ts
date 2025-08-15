export enum Upgrade {
  HeatPump = 'hvac__heat_pump_seer18_hspf10',
  HeatPumpAndWeatherization = 'combination__hvac_seer18_hspf10__weatherization',
  WaterHeater = 'water_heater__heat_pump_uef3.35',
  Weatherization = 'weatherization__insulation_air_duct_sealing',

  // The options below are not shown by default, and require the use of the
  // private API endpoint.
  InternalDaikin7 = 'hvac__internal_only_heat_pump_ducted_daikin_7',
  InternalCarrierPerformance = 'hvac__internal_only_heat_pump_ductless_carrier_performance',
  InternalDaikinSMulti = 'hvac__internal_only_heat_pump_ductless_daikin_smulti',
}

/** Upgrades that require using the internal API endpoint. */
export const INTERNAL_UPGRADES = new Set([
  Upgrade.InternalCarrierPerformance,
  Upgrade.InternalDaikin7,
  Upgrade.InternalDaikinSMulti,
]);

export enum HeatingFuel {
  Electricity = 'electricity',
  FuelOil = 'fuel_oil',
  NaturalGas = 'natural_gas',
  Propane = 'propane',
}

export enum WaterHeatingFuel {
  Electricity = 'electricity',
  FuelOil = 'fuel_oil',
  NaturalGas = 'natural_gas',
  Propane = 'propane',
}

export interface Quantity {
  value: number;
}

export interface Quantiles {
  median: Quantity;
  percentile_20: Quantity;
  percentile_80: Quantity;
}

export interface RemAddressResponse {
  fuel_results: {
    total: {
      delta: {
        emissions: Quantiles;
        cost: Quantiles;
      };
    };
  };
  estimate_type: 'address_level' | 'puma_level';
}

export type RemErrorType =
  // 400 status
  // Bad address
  | 'multifamily_not_supported'
  | 'building_type_not_supported'
  | 'address_not_parsable'
  | 'country_not_supported'
  | 'state_not_supported'
  // Weird combination of inputs
  | 'building_not_supported'
  // Shouldn't happen
  | 'missing_water_heater_fuel'

  // 500 status
  // Shouldn't happen
  | 'unexpected_error'
  | 'upgrade_not_supported'

  // 502 status
  // No specific field is the problem
  | 'third_party_error';
