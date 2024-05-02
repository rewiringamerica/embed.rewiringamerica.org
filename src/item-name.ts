import { ItemType } from './api/calculator-types-v1';
import { MsgFn } from './i18n/use-translated';

type ItemGroup =
  | 'air_source_heat_pump'
  | 'generic_heat_pump'
  | 'electric_vehicle'
  | 'insulation';

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
    members: new Set(['new_electric_vehicle', 'used_electric_vehicle']),
  },
  {
    group: 'insulation',
    members: new Set([
      'attic_or_roof_insulation',
      'basement_insulation',
      'crawlspace_insulation',
      'floor_insulation',
      'other_insulation',
      'wall_insulation',
    ]),
  },
];

/**
 * TODO this is an internationalization sin. Figure out something better!
 */
export const itemName = (items: ItemType[], msg: MsgFn) => {
  if (items.length === 1) {
    const item = items[0];
    if (item === 'air_sealing') {
      return msg('air sealing', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'air_to_water_heat_pump') {
      return msg('an air-to-water heat pump', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'attic_or_roof_insulation') {
      return msg('attic/roof insulation', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'basement_insulation') {
      return msg('basement insulation', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'battery_storage_installation') {
      return msg('battery storage', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'central_air_conditioner') {
      return msg('a central air conditioner', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'crawlspace_insulation') {
      return msg('crawlspace insulation', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'door_replacement') {
      return msg('door replacement', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'duct_replacement') {
      return msg('duct replacement', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'duct_sealing') {
      return msg('duct sealing', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'ducted_heat_pump') {
      return msg('a ducted heat pump', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'ductless_heat_pump') {
      return msg('a ductless heat pump', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'electric_panel') {
      return msg('an electric panel', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'electric_stove') {
      return msg('an electric/induction stove', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'electric_vehicle_charger') {
      return msg('an EV charger', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'electric_wiring') {
      return msg('electric wiring', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'energy_audit') {
      return msg('an energy audit', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'floor_insulation') {
      return msg('floor insulation', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'geothermal_heating_installation') {
      return msg('geothermal heating installation', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'heat_pump_air_conditioner_heater') {
      return msg('a heat pump', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'heat_pump_clothes_dryer') {
      return msg('a heat pump clothes dryer', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'heat_pump_water_heater') {
      return msg('a heat pump water heater', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'new_electric_vehicle') {
      return msg('a new electric vehicle', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'new_plugin_hybrid_vehicle') {
      return msg('a new plug-in hybrid', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'non_heat_pump_clothes_dryer') {
      return msg('an electric clothes dryer', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'non_heat_pump_water_heater') {
      return msg('an electric water heater', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'other_heat_pump') {
      return msg('a heat pump', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'other_insulation') {
      return msg('insulation', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'other_weatherization') {
      return msg('weatherization', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'rooftop_solar_installation') {
      return msg('rooftop solar', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'used_electric_vehicle') {
      return msg('a used electric vehicle', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'used_plugin_hybrid_vehicle') {
      return msg('a used plug-in hybrid', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'wall_insulation') {
      return msg('wall insulation', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'weatherization') {
      return msg('weatherization', { desc: 'e.g. "$100 off [this string]"' });
    } else if (item === 'window_replacement') {
      return msg('window replacement', {
        desc: 'e.g. "$100 off [this string]"',
      });
    } else if (item === 'efficiency_rebates') {
      return msg('an energy efficiency retrofit', {
        desc: 'e.g. "$100 off [this string]"',
      });
    }

    // This will be a type error if the above if-else is not exhaustive
    const unknownItem: never = item;
    console.error(`no name for item ${unknownItem}`);
    return null;
  }

  // For a multiple-items case, check whether all the items are in one of the
  // defined groups.
  for (const { group, members } of ITEM_GROUPS) {
    if (items.every(i => members.has(i))) {
      if (group === 'air_source_heat_pump') {
        return msg('an air source heat pump', {
          desc: 'e.g. "$100 off [this string]"',
        });
      } else if (group === 'electric_vehicle') {
        return msg('an electric vehicle', {
          desc: 'e.g. "$100 off [this string]"',
        });
      } else if (group === 'generic_heat_pump') {
        return msg('a heat pump', { desc: 'e.g. "$100 off [this string]"' });
      } else if (group === 'insulation') {
        return msg('insulation', { desc: 'e.g. "$100 off [this string]"' });
      } else {
        // This will be a type error if the above if-else is not exhaustive
        const unknownGroup: never = group;
        console.error(`no name for ${unknownGroup}`);
      }
    }
  }

  return null;
};
