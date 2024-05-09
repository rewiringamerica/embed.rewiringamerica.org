import { describe, expect, test } from '@jest/globals';
import { passthroughMsg as msg } from '../src/i18n/use-translated';
import { itemName } from '../src/item-name';

describe('group names', () => {
  test('heat pumps', () => {
    expect(itemName(['ducted_heat_pump', 'ductless_heat_pump'], msg)).toBe(
      'an air source heat pump',
    );
    expect(
      itemName(['ducted_heat_pump', 'geothermal_heating_installation'], msg),
    ).toBe('a heat pump');
  });

  test('weatherization and insulation', () => {
    expect(
      itemName(['attic_or_roof_insulation', 'basement_insulation'], msg),
    ).toBe('insulation');
    expect(itemName(['attic_or_roof_insulation', 'air_sealing'], msg)).toBe(
      'weatherization',
    );
    expect(itemName(['wall_insulation', 'other_insulation'], msg)).toBe(
      'insulation',
    );
    expect(itemName(['wall_insulation', 'other_weatherization'], msg)).toBe(
      'weatherization',
    );
    expect(itemName(['other_weatherization', 'energy_audit'], msg)).toBe(
      'an energy audit and weatherization',
    );
  });

  test('vehicles', () => {
    expect(
      itemName(['new_electric_vehicle', 'used_electric_vehicle'], msg),
    ).toBe('an electric vehicle');
    expect(
      itemName(
        ['new_plugin_hybrid_vehicle', 'used_plugin_hybrid_vehicle'],
        msg,
      ),
    ).toBe('a plug-in hybrid');
    expect(
      itemName(['new_electric_vehicle', 'new_plugin_hybrid_vehicle'], msg),
    ).toBe('a new vehicle');
    expect(
      itemName(['used_electric_vehicle', 'used_plugin_hybrid_vehicle'], msg),
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
      ),
    ).toBeNull();
  });
});
