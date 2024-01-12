import { msg } from '@lit/localize';

export type StateInfo = {
  name: () => string;
};

/**
 * States that are supported for customization.
 */
export const STATES: Record<string, StateInfo> = {
  AZ: {
    name: () => msg('Arizona'),
  },
  CT: {
    name: () => msg('Connecticut'),
  },
  NY: {
    name: () => msg('New York'),
  },
  RI: {
    name: () => msg('Rhode Island'),
  },
  VA: {
    name: () => msg('Virginia'),
  },
  VT: {
    name: () => msg('Vermont'),
  },
};
