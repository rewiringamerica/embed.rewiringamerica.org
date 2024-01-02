// Note: frontend translation should be done via Lit localization
// whenever possible (see CONTRIBUTING.md). This approach is for
// when arguments *to* Lit-localized strings must be translated.
type Locale = 'en' | 'es';

type LocalizableString = {
  en: string;
  es?: string;
};

export const UNITS: { [index: string]: LocalizableString } = {
  ton: {
    en: 'ton',
    es: 'tonelada',
  },
  watt: {
    en: 'watt',
    es: 'vatio',
  },
  square_foot: {
    en: 'square foot',
    es: 'pie cuadrado',
  },
  btuh10k: {
    en: 'British Thermal Units per hour',
    es: 'Unidad Térmica Británica por hora',
  },
};

export function localize(
  input: string | undefined,
  options: { [index: string]: LocalizableString },
  locale: string = 'en',
) {
  if (input === undefined) {
    console.log(`Tried to localize undefined input`);
    return input;
  }
  if (options[input] === undefined) {
    console.log(`Could not find localization data for input: ${input}`);
    return input;
  }
  if (options[input][locale as Locale] === undefined) {
    console.log(
      `Could not find localization data for input ${input} in locale: ${locale}`,
    );
    return input;
  }
  return options[input][locale as Locale];
}
