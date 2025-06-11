export enum Upgrade {
  HeatPump = 'hvac__heat_pump_seer18_hspf10',
  HeatPumpAndWeatherization = 'combination__hvac_seer18_hspf10__weatherization',
  WaterHeater = 'water_heater__heat_pump_uef3.35',
  Weatherization = 'weatherization__insulation_air_duct_sealing',
}

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
  unit: string;
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
}
