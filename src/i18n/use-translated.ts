import { createContext, useContext } from 'react';
import { fnv1a64 } from './fnv1a64';
import { allLocales, sourceLocale, targetLocales } from './locales';
import { MsgFn, assembleStrResult } from './msg';
import { TemplatedStr } from './str';
import { templates as esStrings } from './strings/es';

export type Locale = (typeof allLocales)[number];
type TargetLocale = (typeof targetLocales)[number];
const STRINGS: {
  [k in TargetLocale]: Record<string, string | TemplatedStr>;
} = { es: esStrings };

/**
 * Converts the locale, as given to the calculator in its "lang" attribute,
 * into one of the locales we have available.
 */
const computeLocale = (rawLocale: string): Locale => {
  // Get the language part from a locale that might be "en-US" or similar
  const lang = rawLocale.slice(0, 2);

  // Fall back to the source locale for unknown inputs.
  return (allLocales as readonly string[]).includes(lang)
    ? (lang as Locale)
    : sourceLocale;
};

export const LocaleContext = createContext(sourceLocale);

/**
 * A hook that returns a function to localize strings. All localizable strings
 * should be wrapped in a call to msg().
 */
export const useTranslated = (): { msg: MsgFn; locale: Locale } => {
  const locale = computeLocale(useContext(LocaleContext));

  // This mimics the subset of @lit/localize's msg() function that we use.
  // Unlike the full version, it can't accept an HTML template.
  const msg = (sourceStr: string | TemplatedStr) => {
    let translatedStr: string | TemplatedStr;
    let order: number[] | null = null;

    if (locale === sourceLocale) {
      translatedStr = sourceStr;
    } else {
      const hashInput =
        typeof sourceStr === 'string'
          ? sourceStr
          : sourceStr.template.join('\x1e'); // ASCII "record separator"
      const hash = 's' + fnv1a64(hashInput);
      const translation = STRINGS[locale][hash];

      if (translation) {
        translatedStr = translation;
        if (typeof translatedStr !== 'string') {
          // Translations of templated strings look like:
          //   str`hello ${0} world ${1}`
          // Thus, the values in the TemplatedStr are numbers, specifying the
          // index of the runtime argument that should go into that slot. This
          // allows translations to have placeholders in a different order from
          // the original string.
          order = translatedStr.values as number[];
        }
      } else {
        // Fall back to source if there was no translation
        translatedStr = sourceStr;
      }
    }

    return typeof translatedStr === 'string'
      ? translatedStr
      : assembleStrResult(
          translatedStr.template,
          // If the translation is a templated string, the source must be too.
          (sourceStr as TemplatedStr).values,
          order,
        );
  };

  return { msg, locale };
};
