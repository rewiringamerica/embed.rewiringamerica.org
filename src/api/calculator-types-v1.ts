export type IncentiveType =
  | 'tax_credit'
  | 'pos_rebate'
  | 'rebate'
  | 'account_credit'
  | 'performance_rebate';
export type AuthorityType = 'federal' | 'state' | 'utility';

export type AmountType = 'dollar_amount' | 'percent' | 'dollars_per_unit';
export interface Amount {
  type: AmountType;
  number: number;
  maximum?: number;
  representative?: number;
  unit?: string;
}

export type ItemType =
  | 'battery_storage_installation'
  | 'efficiency_rebates'
  | 'electric_panel'
  | 'electric_stove'
  | 'electric_vehicle_charger'
  | 'electric_wiring'
  | 'geothermal_heating_installation'
  | 'heat_pump_air_conditioner_heater'
  | 'heat_pump_clothes_dryer'
  | 'heat_pump_water_heater'
  | 'new_electric_vehicle'
  | 'rooftop_solar_installation'
  | 'used_electric_vehicle'
  | 'weatherization';

export interface Item {
  type: ItemType;
  name: string;
  url: string;
}

export interface Incentive {
  type: IncentiveType;
  authority_type: AuthorityType;
  authority_name: string | null;
  program: string;
  item: Item;
  amount: Amount;
  start_date: number;
  end_date: number;
  short_description?: string;

  eligible: boolean;
}

export interface APIResponse {
  savings: {
    tax_credit: number;
    pos_rebate: number;
    rebate: number;
    account_credit: number;
  };
  incentives: Incentive[];
}
