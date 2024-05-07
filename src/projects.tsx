import BatteryIcon from 'jsx:../static/icons/battery.svg';
import ClothesDryerIcon from 'jsx:../static/icons/clothes-dryer.svg';
import CookingIcon from 'jsx:../static/icons/cooking.svg';
import ElectricalWiringIcon from 'jsx:../static/icons/electrical-wiring.svg';
import EvIcon from 'jsx:../static/icons/ev.svg';
import HvacIcon from 'jsx:../static/icons/hvac.svg';
import SolarIcon from 'jsx:../static/icons/solar.svg';
import WaterHeaterIcon from 'jsx:../static/icons/water-heater.svg';
import WeatherizationIcon from 'jsx:../static/icons/weatherization.svg';
import { ItemType } from './api/calculator-types-v1';
import { MsgFn } from './i18n/use-translated';

type ProjectInfo = {
  label: (msg: MsgFn) => string;
  shortLabel?: (msg: MsgFn) => string;
  getIcon: () => React.ReactElement;
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
  | 'weatherization_and_efficiency';

export const NO_PROJECT = '';

export const shortLabel = (p: Project, msg: MsgFn) =>
  (PROJECTS[p].shortLabel ?? PROJECTS[p].label)(msg);

/**
 * Icons, labels, and API `item` values for the various projects for which we
 * show incentives.
 */
export const PROJECTS: Record<Project, ProjectInfo> = {
  clothes_dryer: {
    items: ['heat_pump_clothes_dryer', 'non_heat_pump_clothes_dryer'],
    label: msg => msg('Clothes dryer'),
    getIcon: () => <ClothesDryerIcon width="1em" />,
  },
  hvac: {
    items: [
      'air_to_water_heat_pump',
      'central_air_conditioner',
      'ducted_heat_pump',
      'ductless_heat_pump',
      'geothermal_heating_installation',
      'other_heat_pump',
      'heat_pump_air_conditioner_heater',
    ],
    label: msg => msg('Heating, ventilation & cooling'),
    shortLabel: msg =>
      msg('HVAC', {
        desc: 'short label for "heating, ventilation & cooling"',
      }),
    getIcon: () => <HvacIcon width="1em" />,
  },
  ev: {
    items: [
      'new_electric_vehicle',
      'used_electric_vehicle',
      'new_plugin_hybrid_vehicle',
      'used_plugin_hybrid_vehicle',
      'electric_vehicle_charger',
    ],
    label: msg => msg('Electric vehicle'),
    shortLabel: msg =>
      msg('EV', { desc: 'short label for "electric vehicle"' }),
    getIcon: () => <EvIcon width="1em" />,
  },
  solar: {
    items: ['rooftop_solar_installation'],
    label: msg => msg('Solar', { desc: 'i.e. rooftop solar' }),
    getIcon: () => <SolarIcon width="1em" />,
  },
  battery: {
    items: ['battery_storage_installation'],
    label: msg => msg('Battery storage'),
    getIcon: () => <BatteryIcon width="1em" />,
  },
  water_heater: {
    items: ['heat_pump_water_heater', 'non_heat_pump_water_heater'],
    label: msg => msg('Water heater'),
    getIcon: () => <WaterHeaterIcon width="1em" />,
  },
  cooking: {
    items: ['electric_stove'],
    label: msg => msg('Cooking stove/range'),
    shortLabel: msg =>
      msg('Cooking', { desc: 'short label for stove/range incentives' }),
    getIcon: () => <CookingIcon width="1em" />,
  },
  wiring: {
    items: ['electric_panel', 'electric_wiring'],
    label: msg => msg('Electrical panel & wiring'),
    shortLabel: msg =>
      msg('Electrical', { desc: 'short for "electrical panel and wiring"' }),
    getIcon: () => <ElectricalWiringIcon width="1em" />,
  },
  weatherization_and_efficiency: {
    items: [
      'air_sealing',
      'attic_or_roof_insulation',
      'basement_insulation',
      'crawlspace_insulation',
      'door_replacement',
      'duct_replacement',
      'duct_sealing',
      'floor_insulation',
      'wall_insulation',
      'weatherization',
      'window_replacement',
      'efficiency_rebates',
      'other_insulation',
      'other_weatherization',
    ],
    label: msg => msg('Weatherization & efficiency'),
    shortLabel: msg => msg('Weatherization'),
    getIcon: () => <WeatherizationIcon width="1em" />,
  },
};
