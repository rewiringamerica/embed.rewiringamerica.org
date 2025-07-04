export const SUPPORTED_COLORS = [
  // PALETTE COLORS
  'blue-500',
  'grey-100',
  'grey-200',
  'grey-300',
  'grey-400',
  'grey-500',
  'grey-600',
  'grey-700',
  'grey-900',
  'orange-500',
  'purple-100',
  'purple-200',
  'purple-500',
  'red-100',
  'red-500',
  'teal-100',
  'teal-300',
  'teal-500',
  'teal-700',
  'transparent',
  'white',
  'yellow-100',
  'yellow-200',
  'yellow-300',
  'yellow-500',
  'yellow-600',
  'yellow-700',
  'yellow-800',
  'green-500',
  // COLOR ALIASES
  'color-action-primary',
  'color-action-secondary',
  'color-background-primary',
  'color-border-primary',
  'color-border-secondary',
  'color-border-tertiary',
  'color-divider-primary',
  'color-feedback-error',
  'color-feedback-success',
  'color-feedback-warning',
  'color-shadow-primary',
  'color-state-active-primary',
  'color-state-active-secondary',
  'color-state-disabled-on-dark',
  'color-state-disabled',
  'color-stroke-primary-on-dark',
  'color-stroke-primary',
  'color-stroke-secondary',
  'color-stroke-tertiary',
  'color-text-primary-on-dark',
  'color-text-primary',
  'color-text-secondary',
  'color-text-tertiary',
  // SPECIFIC UI ELEMENTS
  // These are documented customization points for embedders
  'ra-color-background-button',
  'ra-color-text-button',
  'ra-color-text-link',
];

export type SupportedColorsType = (typeof SUPPORTED_COLORS)[number];
