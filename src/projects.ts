import { ItemType } from './api/calculator-types-v1';
import { MsgFn } from './i18n/use-translated';

type ProjectInfo = {
  label: (msg: MsgFn) => string;
  items: ItemType[];
};

export type Project =
  | 'clothes_dryer'
  | 'hvac'
  | 'ev'
  | 'solar'
  | 'battery'
  | 'water_heater'
  | 'cooking'
  | 'wiring'
  | 'weatherization_and_efficiency'
  | 'lawn_care';

export const NO_PROJECT = '';

/**
 * Icons, labels, and API `item` values for the various projects for which we
 * show incentives.
 */
export const PROJECTS: Record<Project, ProjectInfo> = {
  clothes_dryer: {
    items: ['heat_pump_clothes_dryer', 'non_heat_pump_clothes_dryer'],
    label: msg => msg('Clothes dryer'),
  },
  hvac: {
    items: [
      'air_to_water_heat_pump',
      'central_air_conditioner',
      'ducted_heat_pump',
      'ductless_heat_pump',
      'geothermal_heating_installation',
      'other_heat_pump',
      'smart_thermostat',
      'integrated_heat_pump_controls',
    ],
    label: msg => msg('Heating, ventilation & cooling'),
  },
  ev: {
    items: [
      'new_electric_vehicle',
      'used_electric_vehicle',
      'new_plugin_hybrid_vehicle',
      'used_plugin_hybrid_vehicle',
      'electric_vehicle_charger',
      'ebike',
    ],
    label: msg => msg('Electric transportation'),
  },
  solar: {
    items: ['rooftop_solar_installation'],
    label: msg => msg('Solar', { desc: 'i.e. rooftop solar' }),
  },
  battery: {
    items: ['battery_storage_installation'],
    label: msg => msg('Battery storage'),
  },
  water_heater: {
    items: [
      'heat_pump_water_heater',
      'non_heat_pump_water_heater',
      'solar_water_heater',
    ],
    label: msg => msg('Water heater'),
  },
  cooking: {
    items: ['electric_stove'],
    label: msg => msg('Cooking stove/range'),
  },
  wiring: {
    items: ['electric_panel', 'electric_wiring', 'electric_service_upgrades'],
    label: msg => msg('Electrical panel & wiring'),
  },
  weatherization_and_efficiency: {
    items: [
      'air_sealing',
      'attic_or_roof_insulation',
      'basement_insulation',
      'cool_roof',
      'crawlspace_insulation',
      'door_replacement',
      'duct_replacement',
      'duct_sealing',
      'floor_insulation',
      'wall_insulation',
      'window_replacement',
      'efficiency_rebates',
      'other_insulation',
      'other_weatherization',
      'energy_audit',
      'solar_screen_films',
    ],
    label: msg => msg('Weatherization & efficiency'),
  },
  lawn_care: {
    items: ['electric_outdoor_equipment'],
    label: msg => msg('Lawn Care'),
  },
};
