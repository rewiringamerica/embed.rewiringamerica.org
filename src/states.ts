import { MsgFn } from './i18n/use-translated';

export type StateInfo = {
  name: (msg: MsgFn) => string;
};

/**
 * States that are supported for customization.
 */
export const STATES: Record<string, StateInfo> = {
  AZ: {
    name: msg => msg('Arizona'),
  },
  CT: {
    name: msg => msg('Connecticut'),
  },
  DC: {
    name: msg => msg('Washington, DC'),
  },
  IL: {
    name: msg => msg('Illinois'),
  },
  NV: {
    name: msg => msg('Nevada'),
  },
  NY: {
    name: msg => msg('New York'),
  },
  RI: {
    name: msg => msg('Rhode Island'),
  },
  VA: {
    name: msg => msg('Virginia'),
  },
  VT: {
    name: msg => msg('Vermont'),
  },
};
