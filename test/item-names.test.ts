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
});
