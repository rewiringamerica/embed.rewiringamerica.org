export type IncentiveType =
  | 'tax_credit'
  | 'pos_rebate'
  | 'rebate'
  | 'account_credit'
  | 'performance_rebate';
export type AuthorityType =
  | 'federal'
  | 'state'
  | 'utility'
  | 'city'
  | 'county'
  | 'other';
export type OwnerStatus = 'homeowner' | 'renter';
export type FilingStatus =
  | 'single'
  | 'joint'
  | 'hoh'
  | 'married_filing_separately';

export type AmountType = 'dollar_amount' | 'percent' | 'dollars_per_unit';
export type AmountUnit =
  | 'ton'
  | 'kilowatt'
  | 'watt'
  | 'btuh10k'
  | 'square_foot'
  | 'kilowatt_hour';
export interface Amount {
  type: AmountType;
  number: number;
  maximum?: number;
  representative?: number;
  unit?: AmountUnit;
}

export const ITEMS = [
  'air_sealing',
  'air_to_water_heat_pump',
  'attic_or_roof_insulation',
  'basement_insulation',
  'battery_storage_installation',
  'central_air_conditioner',
  'cool_roof',
  'crawlspace_insulation',
  'door_replacement',
  'duct_replacement',
  'duct_sealing',
  'ducted_heat_pump',
  'ductless_heat_pump',
  'ebike',
  'efficiency_rebates',
  'electric_outdoor_equipment',
  'electric_panel',
  'electric_service_upgrades',
  'electric_stove',
  'electric_vehicle_charger',
  'electric_wiring',
  'energy_audit',
  'floor_insulation',
  'geothermal_heating_installation',
  'heat_pump_clothes_dryer',
  'heat_pump_water_heater',
  'integrated_heat_pump_controls',
  'new_electric_vehicle',
  'new_plugin_hybrid_vehicle',
  'non_heat_pump_clothes_dryer',
  'non_heat_pump_water_heater',
  'other_heat_pump',
  'other_insulation',
  'other_weatherization',
  'rooftop_solar_installation',
  'smart_thermostat',
  'solar_screen_films',
  'solar_water_heater',
  'used_electric_vehicle',
  'used_plugin_hybrid_vehicle',
  'wall_insulation',
  'window_replacement',
] as const;

export type ItemType = (typeof ITEMS)[number];

export interface Incentive {
  payment_methods: IncentiveType[];
  authority_type: AuthorityType;
  authority: string | null;
  program: string;
  program_url: string;
  more_info_url?: string;
  items: ItemType[];
  amount: Amount;
  start_date?: string;
  end_date?: string;
  paused?: boolean;
  short_description?: string;
  eligible?: boolean;
}

export interface APILocation {
  state: string;
}

export interface APIUtilityMap {
  [utilityId: string]: {
    name: string;
  };
}

export interface APIUtilitiesResponse {
  location: APILocation;
  utilities: APIUtilityMap;
  gas_utilities?: APIUtilityMap;
  gas_utility_affects_incentives?: boolean;
}

export interface APIResponse {
  authorities: {
    [authorityId: string]: {
      name: string;
      logo?: {
        src: string;
        width: number;
        height: number;
      };
    };
  };
  coverage: {
    state: string | null;
    utility: string | null;
  };
  data_partners: {
    [id: string]: {
      name: string;
      logo?: {
        src: string;
        width: number;
        height: number;
      };
    };
  };
  location: APILocation;
  incentives: Incentive[];
  is_under_80_ami: boolean;
  is_under_150_ami: boolean;
}
