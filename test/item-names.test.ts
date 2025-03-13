import { describe, expect, test } from '@jest/globals';
import { passthroughMsg as msg } from '../src/i18n/use-translated';
import { itemName } from '../src/item-name';

describe('group names', () => {
  test('heat pumps', () => {
    expect(
      itemName(['ducted_heat_pump', 'ductless_heat_pump'], msg, 'hvac'),
    ).toBe('an air source heat pump');
    expect(
      itemName(
        ['ducted_heat_pump', 'geothermal_heating_installation'],
        msg,
        'hvac',
      ),
    ).toBe('a heat pump');
  });

  test('water heaters', () => {
    expect(
      itemName(
        ['heat_pump_water_heater', 'non_heat_pump_water_heater'],
        msg,
        'water_heater',
      ),
    ).toBe('a water heater');
    expect(
      itemName(
        ['heat_pump_water_heater', 'solar_water_heater'],
        msg,
        'water_heater',
      ),
    ).toBe('a water heater');
  });

  test('weatherization and insulation', () => {
    expect(
      itemName(
        ['attic_or_roof_insulation', 'basement_insulation'],
        msg,
        'weatherization_and_efficiency',
      ),
    ).toBe('insulation');
    expect(
      itemName(
        ['attic_or_roof_insulation', 'air_sealing'],
        msg,
        'weatherization_and_efficiency',
      ),
    ).toBe('weatherization');
    expect(
      itemName(
        ['wall_insulation', 'other_insulation'],
        msg,
        'weatherization_and_efficiency',
      ),
    ).toBe('insulation');
    expect(
      itemName(
        ['wall_insulation', 'other_weatherization'],
        msg,
        'weatherization_and_efficiency',
      ),
    ).toBe('weatherization');
    expect(
      itemName(
        ['cool_roof', 'other_weatherization'],
        msg,
        'weatherization_and_efficiency',
      ),
    ).toBe('weatherization');
    expect(
      itemName(
        ['other_weatherization', 'energy_audit'],
        msg,
        'weatherization_and_efficiency',
      ),
    ).toBe('an energy audit and weatherization');
  });

  test('vehicles', () => {
    expect(
      itemName(['new_electric_vehicle', 'used_electric_vehicle'], msg, 'ev'),
    ).toBe('an electric vehicle');
    expect(
      itemName(
        ['new_plugin_hybrid_vehicle', 'used_plugin_hybrid_vehicle'],
        msg,
        'ev',
      ),
    ).toBe('a plug-in hybrid');
    expect(
      itemName(
        ['new_electric_vehicle', 'new_plugin_hybrid_vehicle'],
        msg,
        'ev',
      ),
    ).toBe('a new vehicle');
    expect(
      itemName(
        ['used_electric_vehicle', 'used_plugin_hybrid_vehicle'],
        msg,
        'ev',
      ),
    ).toBe('a used vehicle');

    expect(
      itemName(
        [
          'new_electric_vehicle',
          'used_electric_vehicle',
          'new_plugin_hybrid_vehicle',
          'used_plugin_hybrid_vehicle',
        ],
        msg,
        'ev',
      ),
    ).toBeNull();
  });

  test('HEAR rebates applicable to multiple appliances', () => {
    expect(
      itemName(['heat_pump_clothes_dryer', 'electric_stove'], msg, 'cooking'),
    ).toBe('an electric/induction stove');

    expect(
      itemName(
        ['heat_pump_clothes_dryer', 'electric_stove'],
        msg,
        'clothes_dryer',
      ),
    ).toBe('a heat pump clothes dryer');
  });
});
