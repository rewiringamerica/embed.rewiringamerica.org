import { msg } from '@lit/localize';
import { ItemType } from './api/calculator-types-v1';

type ProjectInfo = {
  label: () => string;
  shortLabel?: () => string;
  // The first argument for the URL must be a string literal for the correct Parcel behavior: https://parceljs.org/languages/javascript/#url-dependencies
  iconURL: URL;
  items: ItemType[];
};

export type Project =
  | 'heat_pump_clothes_dryer'
  | 'hvac'
  | 'ev'
  | 'solar'
  | 'battery'
  | 'heat_pump_water_heater'
  | 'cooking'
  | 'wiring'
  | 'weatherization_and_efficiency';

export const NO_PROJECT = '';

export const shortLabel = (p: Project) =>
  (PROJECTS[p].shortLabel ?? PROJECTS[p].label)();

/**
 * Icons, labels, and API `item` values for the various projects for which we
 * show incentives.
 */
export const PROJECTS: Record<Project, ProjectInfo> = {
  heat_pump_clothes_dryer: {
    items: ['heat_pump_clothes_dryer'],
    label: () => msg('Clothes dryer'),
    iconURL: new URL('/static/icons/clothes-dryer.svg', import.meta.url),
  },
  hvac: {
    items: [
      'heat_pump_air_conditioner_heater',
      'geothermal_heating_installation',
    ],
    label: () => msg('Heating, ventilation & cooling'),
    shortLabel: () =>
      msg('HVAC', {
        desc: 'short label for "heating, ventilation & cooling"',
      }),
    iconURL: new URL('/static/icons/hvac.svg', import.meta.url),
  },
  ev: {
    items: [
      'new_electric_vehicle',
      'used_electric_vehicle',
      'electric_vehicle_charger',
    ],
    label: () => msg('Electric vehicle'),
    shortLabel: () => msg('EV', { desc: 'short label for "electric vehicle"' }),
    iconURL: new URL('/static/icons/ev.svg', import.meta.url),
  },
  solar: {
    items: ['rooftop_solar_installation'],
    label: () => msg('Solar', { desc: 'i.e. rooftop solar' }),
    iconURL: new URL('/static/icons/solar.svg', import.meta.url),
  },
  battery: {
    items: ['battery_storage_installation'],
    label: () => msg('Battery storage'),
    iconURL: new URL('/static/icons/battery.svg', import.meta.url),
  },
  heat_pump_water_heater: {
    items: ['heat_pump_water_heater'],
    label: () => msg('Water heater'),
    iconURL: new URL('/static/icons/water-heater.svg', import.meta.url),
  },
  cooking: {
    items: ['electric_stove'],
    label: () => msg('Cooking stove/range'),
    shortLabel: () =>
      msg('Cooking', { desc: 'short label for stove/range incentives' }),
    iconURL: new URL('/static/icons/cooking.svg', import.meta.url),
  },
  wiring: {
    items: ['electric_panel', 'electric_wiring'],
    label: () => msg('Electrical panel & wiring'),
    shortLabel: () =>
      msg('Electrical', { desc: 'short for "electrical panel and wiring"' }),
    iconURL: new URL('/static/icons/electrical-wiring.svg', import.meta.url),
  },
  weatherization_and_efficiency: {
    items: ['weatherization', 'efficiency_rebates'],
    label: () => msg('Weatherization & efficiency'),
    shortLabel: () => msg('Weatherization'),
    iconURL: new URL('/static/icons/weatherization.svg', import.meta.url),
  },
};
