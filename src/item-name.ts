import { ItemType } from './api/calculator-types-v1';
import { MsgFn } from './i18n/use-translated';
import { Project } from './projects';

type ItemGroup =
  | 'air_source_heat_pump'
  | 'clothes_dryer'
  | 'generic_heat_pump'
  | 'electric_vehicle'
  | 'plugin_hybrid'
  | 'new_vehicle'
  | 'used_vehicle'
  | 'door_and_window'
  | 'insulation'
  | 'weatherization'
  | 'audit_and_weatherization'
  | 'water_heater'
  | 'electric_outdoor_equipment'
  | 'hear_projects';

const ALL_INSULATION: ItemType[] = [
  'attic_or_roof_insulation',
  'basement_insulation',
  'crawlspace_insulation',
  'floor_insulation',
  'other_insulation',
  'wall_insulation',
];

const ALL_WEATHERIZATION: ItemType[] = [
  ...ALL_INSULATION,
  'air_sealing',
  'door_replacement',
  'duct_replacement',
  'duct_sealing',
  'window_replacement',
  'efficiency_rebates',
  'other_weatherization',
];

/**
 * Some incentives are for multiple items. These groups define headlines for
 * such incentives: if the incentive's items are a subset of one of these
 * groups, it will be shown with a unified name.
 *
 * Note that the groups are checked in order, so if one group is a subset of
 * another, the smaller group should be listed first. (E.g. air source heat
 * pumps and generic heat pumps.)
 */
const ITEM_GROUPS: { group: ItemGroup; members: Set<ItemType> }[] = [
  {
    group: 'air_source_heat_pump',
    members: new Set([
      'ducted_heat_pump',
      'ductless_heat_pump',
      'air_to_water_heat_pump',
    ]),
  },
  {
    group: 'clothes_dryer',
    members: new Set([
      'heat_pump_clothes_dryer',
      'non_heat_pump_clothes_dryer',
    ]),
  },
  {
    group: 'generic_heat_pump',
    members: new Set([
      'air_to_water_heat_pump',
      'ducted_heat_pump',
      'ductless_heat_pump',
      'geothermal_heating_installation',
      'other_heat_pump',
    ]),
  },
  {
    group: 'electric_vehicle',
    members: new Set([
      'new_electric_vehicle',
      'used_electric_vehicle',
      'ebike',
    ]),
  },
  {
    group: 'plugin_hybrid',
    members: new Set([
      'new_plugin_hybrid_vehicle',
      'used_plugin_hybrid_vehicle',
    ]),
  },
  {
    group: 'new_vehicle',
    members: new Set(['new_electric_vehicle', 'new_plugin_hybrid_vehicle']),
  },
  {
    group: 'used_vehicle',
    members: new Set(['used_electric_vehicle', 'used_plugin_hybrid_vehicle']),
  },
  {
    group: 'door_and_window',
    members: new Set(['door_replacement', 'window_replacement']),
  },
  {
    group: 'insulation',
    members: new Set(ALL_INSULATION),
  },
  {
    group: 'weatherization',
    members: new Set(ALL_WEATHERIZATION),
  },
  {
    group: 'audit_and_weatherization',
    members: new Set([...ALL_WEATHERIZATION, 'energy_audit']),
  },
  {
    group: 'water_heater',
    members: new Set(['heat_pump_water_heater', 'non_heat_pump_water_heater']),
  },
  {
    group: 'hear_projects',
    members: new Set(['heat_pump_clothes_dryer', 'electric_stove']),
  },
];

const itemsBelongToGroup = (items: ItemType[], members: Set<ItemType>) => {
  return items.every(i => members.has(i));
};

const multipleItemsName = (items: ItemType[], msg: MsgFn, project: Project) => {
  // For a multiple-items case, check whether all the items are in one of the
  // defined groups.
  for (const { group, members } of ITEM_GROUPS) {
    if (itemsBelongToGroup(items, members)) {
      switch (group) {
        case 'air_source_heat_pump':
          return msg('an air source heat pump', {
            desc: 'e.g. "$100 off [this string]"',
          });
        case 'clothes_dryer':
          return msg('a clothes dryer', {
            desc: 'e.g. "$100 off [this string]"',
          });
        case 'electric_vehicle':
          return msg('an electric vehicle', {
            desc: 'e.g. "$100 off [this string]"',
          });
        case 'plugin_hybrid':
          return msg('a plug-in hybrid', {
            desc: 'e.g. "$100 off [this string]"',
          });
        case 'new_vehicle':
          return msg('a new vehicle', {
            desc: 'e.g. "$100 off [this string]"',
          });
        case 'used_vehicle':
          return msg('a used vehicle', {
            desc: 'e.g. "$100 off [this string]"',
          });
        case 'generic_heat_pump':
          return msg('a heat pump', { desc: 'e.g. "$100 off [this string]"' });
        case 'door_and_window':
          return msg('door and window replacement', {
            desc: 'e.g. "$100 off [this string]"',
          });
        case 'insulation':
          return msg('insulation', { desc: 'e.g. "$100 off [this string]"' });
        case 'weatherization':
          return msg('weatherization', {
            desc: 'e.g. "$100 off [this string]"',
          });
        case 'audit_and_weatherization':
          return msg('an energy audit and weatherization', {
            desc: 'e.g. "$100 off [this string]"',
          });
        case 'water_heater':
          return msg('a water heater', {
            desc: 'e.g. "$100 off [this string]"',
          });
        case 'electric_outdoor_equipment':
          return msg('electric outdoor equipment', {
            desc: 'e.g. "$100 off [this string]"',
          });
        case 'hear_projects':
          return hearName(items, msg, project);
        default: {
          // This will be a type error if the above switch is not exhaustive
          const unknownGroup: never = group;
          console.error(`no name for ${unknownGroup}`);
        }
      }
    }
  }

  return null;
};

const hearName = (items: ItemType[], msg: MsgFn, project: Project) => {
  const HEAR_INCENTIVE_PROJECT_MSG_LIST: {
    item: ItemType;
    project: Project;
    itemName: string;
  }[] = [
    {
      item: 'heat_pump_clothes_dryer',
      project: 'clothes_dryer',
      itemName: 'a heat pump clothes dryer',
    },

    {
      item: 'electric_stove',
      project: 'cooking',
      itemName: 'an electric/induction stove',
    },
  ];

  const match = HEAR_INCENTIVE_PROJECT_MSG_LIST.find(
    group => items.includes(group.item) && project === group.project,
  );

  if (!match) return null;

  return msg(match.itemName, { desc: 'e.g. "$100 off [this string]"' });
};

/**
 * TODO this is an internationalization sin. Figure out something better!
 */
export const itemName = (items: ItemType[], msg: MsgFn, project: Project) => {
  if (items.length > 1) {
    return multipleItemsName(items, msg, project);
  }

  if (items.length !== 1) {
    return null;
  }

  const item = items[0];
  switch (item) {
    case 'air_sealing':
      return msg('air sealing', { desc: 'e.g. "$100 off [this string]"' });
    case 'air_to_water_heat_pump':
      return msg('an air-to-water heat pump', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'attic_or_roof_insulation':
      return msg('attic/roof insulation', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'basement_insulation':
      return msg('basement insulation', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'battery_storage_installation':
      return msg('battery storage', { desc: 'e.g. "$100 off [this string]"' });
    case 'central_air_conditioner':
      return msg('a central air conditioner', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'crawlspace_insulation':
      return msg('crawlspace insulation', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'door_replacement':
      return msg('door replacement', { desc: 'e.g. "$100 off [this string]"' });
    case 'duct_replacement':
      return msg('duct replacement', { desc: 'e.g. "$100 off [this string]"' });
    case 'duct_sealing':
      return msg('duct sealing', { desc: 'e.g. "$100 off [this string]"' });
    case 'ducted_heat_pump':
      return msg('a ducted heat pump', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'ductless_heat_pump':
      return msg('a ductless heat pump', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'electric_panel':
      return msg('an electric panel', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'electric_stove':
      return msg('an electric/induction stove', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'electric_vehicle_charger':
      return msg('an EV charger', { desc: 'e.g. "$100 off [this string]"' });
    case 'electric_wiring':
      return msg('electric wiring', { desc: 'e.g. "$100 off [this string]"' });
    case 'energy_audit':
      return msg('an energy audit', { desc: 'e.g. "$100 off [this string]"' });
    case 'floor_insulation':
      return msg('floor insulation', { desc: 'e.g. "$100 off [this string]"' });
    case 'geothermal_heating_installation':
      return msg('geothermal heating installation', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'heat_pump_clothes_dryer':
      return msg('a heat pump clothes dryer', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'heat_pump_water_heater':
      return msg('a heat pump water heater', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'new_electric_vehicle':
      return msg('a new electric vehicle', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'new_plugin_hybrid_vehicle':
      return msg('a new plug-in hybrid', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'non_heat_pump_clothes_dryer':
      return msg('an electric clothes dryer', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'non_heat_pump_water_heater':
      return msg('an electric water heater', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'other_heat_pump':
      return msg('a heat pump', { desc: 'e.g. "$100 off [this string]"' });
    case 'other_insulation':
      return msg('insulation', { desc: 'e.g. "$100 off [this string]"' });
    case 'other_weatherization':
      return msg('weatherization', { desc: 'e.g. "$100 off [this string]"' });
    case 'rooftop_solar_installation':
      return msg('rooftop solar', { desc: 'e.g. "$100 off [this string]"' });
    case 'used_electric_vehicle':
      return msg('a used electric vehicle', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'used_plugin_hybrid_vehicle':
      return msg('a used plug-in hybrid', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'wall_insulation':
      return msg('wall insulation', { desc: 'e.g. "$100 off [this string]"' });
    case 'window_replacement':
      return msg('window replacement', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'efficiency_rebates':
      return msg('an energy efficiency retrofit', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'electric_outdoor_equipment':
      return msg('electric outdoor equipment', {
        desc: 'e.g. "$100 off [this string]"',
      });
    case 'ebike':
      return msg('an e-bike', {
        desc: 'e.g. "$100 off [this string]"',
      });
    default: {
      // This will be a type error if the above if-else is not exhaustive
      const unknownItem: never = item;
      console.error(`no name for item ${unknownItem}`);
      return null;
    }
  }
};
