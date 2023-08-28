import { ItemType } from './api/calculator-types-v1';

type Project = {
  label: string;
  shortLabel?: string;
  items: ItemType[];
};

export const PROJECTS: Record<string, Project> = {
  heat_pump_clothes_dryer: {
    items: ['heat_pump_clothes_dryer'],
    label: 'Clothes dryer',
  },
  hvac: {
    items: [
      'heat_pump_air_conditioner_heater',
      'geothermal_heating_installation',
    ],
    label: 'Heating, ventilation & cooling',
    shortLabel: 'HVAC',
  },
  ev: {
    items: [
      'new_electric_vehicle',
      'used_electric_vehicle',
      'electric_vehicle_charger',
    ],
    label: 'Electric vehicle',
    shortLabel: 'EV',
  },
  renewables: {
    items: ['rooftop_solar_installation', 'battery_storage_installation'],
    label: 'Renewables',
  },
  heat_pump_water_heater: {
    items: ['heat_pump_water_heater'],
    label: 'Water heater',
  },
  weatherization: {
    items: ['weatherization'],
    label: 'Weatherization',
  },
  cooking: {
    items: ['electric_stove'],
    label: 'Cooking stove/range',
    shortLabel: 'Cooking',
  },
  wiring: {
    items: ['electric_panel', 'electric_wiring'],
    label: 'Electrical wiring',
    shortLabel: 'Electrical',
  },
};
