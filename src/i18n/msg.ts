import { TemplatedStr } from './str';

/**
 * Converts a StrResult, consisting of a template array and values, into a
 * string. The items in the template array are alternated with the values. If
 * an order array is passed, the values are rearranged accordingly.
 */
export const assembleStrResult = (
  template: TemplateStringsArray,
  values: unknown[],
  order: null | number[],
) => {
  const result = [];

  for (let i = 0; i < template.length - 1; i++) {
    result.push(template[i], values[order ? order[i] : i]);
  }
  result.push(template[template.length - 1]);

  return result.join('');
};

/**
 * The extra part of the type is to get lit/localize-tools to recognize
 * callsites of this function as extractable strings.
 */
export type MsgFn = ((
  sourceStr: string | TemplatedStr,
  options?: { desc: string },
) => string) & { _LIT_LOCALIZE_MSG_?: never };

/** FOR TESTING ONLY: a version of msg that just passes the original through. */
export const passthroughMsg: MsgFn = str =>
  typeof str === 'string'
    ? str
    : assembleStrResult(str.template, str.values, null);
