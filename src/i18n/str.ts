export type TemplatedStr = {
  template: TemplateStringsArray;
  values: unknown[];
};

/**
 * The extra part of the type is to get lit/localize-tools to recognize
 * callsites of this function as extractable strings.
 */
type StrFn = ((
  template: TemplateStringsArray,
  ...values: unknown[]
) => TemplatedStr) & { _LIT_LOCALIZE_STR_?: never };

/**
 * Use this for strings with interpolation. See:
 * https://lit.dev/docs/v2/localization/overview/#strings-with-expressions
 */
export const str: StrFn = (
  template: TemplateStringsArray,
  ...values: unknown[]
) => ({
  template,
  values,
});
