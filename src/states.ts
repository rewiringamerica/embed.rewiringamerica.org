import { msg } from '@lit/localize';

export type StateInfo = {
  name: () => string;
  // The first argument for the URL must be a string literal for the correct
  // Parcel behavior: https://parceljs.org/languages/javascript/#url-dependencies
  iconURL: URL;
};

/**
 * States that are supported for customization.
 */
export const STATES: Record<string, StateInfo> = {
  AZ: {
    name: () => msg('Arizona'),
    iconURL: new URL('/static/states/AZ.svg', import.meta.url),
  },
  CT: {
    name: () => msg('Connecticut'),
    iconURL: new URL('/static/states/CT.svg', import.meta.url),
  },
  NY: {
    name: () => msg(`New York`),
    iconURL: new URL('/static/states/NY.svg', import.meta.url),
  },
  RI: {
    name: () => msg('Rhode Island'),
    iconURL: new URL('/static/states/RI.svg', import.meta.url),
  },
  VA: {
    name: () => msg('Virginia'),
    iconURL: new URL('/static/states/VA.svg', import.meta.url),
  },
};
