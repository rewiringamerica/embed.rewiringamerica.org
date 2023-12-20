import { SlChangeEvent } from '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import shoelaceTheme from 'bundle-text:@shoelace-style/shoelace/dist/themes/light.css';
import { HTMLTemplateResult, css, html, nothing, unsafeCSS } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live';

export interface OptionParam {
  label: string;
  value: string;
  iconURL?: URL;
}

export interface SLSelectParam {
  id: string;
  labelSlot?: HTMLTemplateResult;
  options: OptionParam[];
  helpText?: string;
  placeholder?: string;
  placement?: string;
  required?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onChange?: (event: SlChangeEvent) => void;
}

export interface SingleSelectParam extends SLSelectParam {
  currentValue: string;
  loading?: boolean;
}

export interface MultiSelectParam extends SLSelectParam {
  currentValues: string[];
  maxOptionsVisible?: number;
}

export const option = ({ label, value, iconURL }: OptionParam) => {
  const iconElement = iconURL
    ? html`<sl-icon slot="prefix" src="${iconURL}"></sl-icon>`
    : nothing;

  return html`
    <sl-option value="${value}"> ${label} ${iconElement} </sl-option>
  `;
};

export const select = ({
  id,
  labelSlot,
  options,
  helpText,
  placeholder,
  placement,
  currentValue,
  onChange,
  ariaLabel,
  required = true,
  disabled = false,
  loading = false,
}: SingleSelectParam) => {
  const currentOption = options.find(option => option.value === currentValue);
  const prefixIcon = currentOption?.iconURL
    ? html`<sl-icon src="${currentOption.iconURL}" slot="prefix"></sl-icon>`
    : loading
    ? html`<sl-spinner slot="prefix"></sl-spinner>`
    : nothing;

  return html`
    <div>
      <sl-select
        id="${id}"
        name="${id}"
        .value=${live(currentValue)}
        help-text="${ifDefined(helpText)}"
        placeholder="${ifDefined(placeholder)}"
        placement="${ifDefined(placement)}"
        @sl-change=${ifDefined(onChange)}
        aria-label="${ifDefined(ariaLabel)}"
        ${required ? 'required' : ''}
        ?disabled=${disabled}
        hoist
        ?loading=${loading}
      >
        ${prefixIcon} ${labelSlot ?? nothing}
        <sl-icon slot="expand-icon"></sl-icon>
        ${options.map(o => option(o))}
      </sl-select>
      <span class="focus"></span>
    </div>
  `;
};

export const multiselect = ({
  id,
  labelSlot,
  currentValues,
  options,
  helpText,
  placeholder,
  maxOptionsVisible,
  placement,
}: MultiSelectParam) => {
  return html`
    <div>
      <sl-select
        id="${id}"
        name="${id}"
        .value=${live(currentValues)}
        help-text="${ifDefined(helpText)}"
        placeholder="${ifDefined(placeholder)}"
        max-options-visible="${ifDefined(maxOptionsVisible)}"
        placement="${ifDefined(placement)}"
        hoist
        multiple
        class="multiselect-prefix-icon-tag"
      >
        ${labelSlot ?? nothing}
        <sl-icon slot="expand-icon"></sl-icon>
        ${options.map(o => option(o))}
      </sl-select>
      <span class="focus"></span>
    </div>
  `;
};

export const selectStyles = css`
  ${unsafeCSS(shoelaceTheme)}

  /* // @link https://moderncss.dev/custom-select-styles-with-pure-css/ */

  select {
    /*   // A reset of styles, including removing the default dropdown arrow */
    appearance: none;
    background-color: transparent;
    border: none;
    padding: 0 1em 0 0;
    margin: 0;
    width: 100%;
    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit;

    /*   // Stack above custom arrow */
    z-index: 1;

    /*   // Remove focus outline, will add on alternate element */
    outline: none;

    color: var(--ra-embed-text-color);
  }

  /*   // Remove dropdown arrow in IE10 & IE11
  // @link https://www.filamentgroup.com/lab/select-css.html */
  select::-ms-expand {
    display: none;
  }

  .select {
    display: grid;
    grid-template-areas: 'select';
    align-items: center;
    position: relative;

    min-width: 15ch;
    /* max-width: 30ch; */

    width: 100%;
    border: var(--ra-select-border);
    border-radius: var(--ra-select-border-radius);
    padding: var(--ra-select-padding);

    /*   font-size: 1.25rem; */
    cursor: pointer;
    /*   line-height: 1.1; */

    /*   // Optional styles
  // remove for transparency */
    background-color: var(--ra-select-background-color);
    background-image: var(--ra-select-background-image);

    margin: var(--ra-select-margin);
  }

  .select select[disabled] {
    cursor: default;
  }

  .select select,
  .select::after {
    grid-area: select;
  }

  /*   // Custom arrow */
  .select:not(.select--multiple)::after {
    content: '';
    justify-self: end;
    width: 0.7em;
    height: 0.4em;
    background-color: var(--ra-select-arrow-color);
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  }

  /* // Interim solution until :focus-within has better support */
  select:focus + .focus {
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border: 2px solid var(--ra-select-focus-color);
    border-radius: inherit;
  }

  select[multiple] {
    padding-right: 0;

    /*
   * Safari will not reveal an option
   * unless the select height has room to
   * show all of it
   * Firefox and Chrome allow showing
   * a partial option
   */
    height: 6rem;

    /*
   * Experimental - styling of selected options
   * in the multiselect
   * Not supported crossbrowser
   */
    /*   //   &:not(:disabled) option {
  //     border-radius: 12px;
  //     transition: 120ms all ease-in;

  //     &:checked {
  //       background: linear-gradient(hsl(242, 61%, 76%), hsl(242, 61%, 71%));
  //       padding-left: 0.5em;
  //       color: black !important;
  //     }
  //   } */
  }

  select[multiple] option {
    white-space: normal;

    // Only affects Chrome
    outline-color: var(--ra-select-focus-color);
  }

  .select--disabled {
    cursor: not-allowed;
    background-color: #eee;
    background-image: linear-gradient(to top, #ddd, #eee 33%);
  }

  sl-select {
    --sl-input-height-medium: 2.8215rem;

    --sl-input-font-family: var(--ra-embed-font-family);

    --sl-input-focus-ring-color: var(--ra-select-focus-color);
    --sl-input-focus-ring-style: solid;
    --sl-focus-ring-width: 1px;

    --sl-input-border-width: 1px;
    --sl-input-border-color-focus: var(--ra-select-focus-color);

    --sl-font-sans: var(--ra-embed-font-family);

    /*
     * This replaces the highlighted-row background color. There's no variable
     * specifically for that.
     */
    --sl-color-primary-600: var(--ra-select-focus-color);
  }

  /* Adjust spacing between content and left edge */
  sl-select::part(combobox) {
    padding-inline: var(--sl-spacing-small);
  }

  sl-select::part(form-control-label) {
    /* Override inline-block to prevent empty space above the label */
    display: block;
    /* We'll do our own margin/padding on the label */
    margin: 0;
  }

  /* Move the loading spinner to the right (but before the expand icon) */
  sl-select[loading]::part(prefix) {
    order: 1;
  }

  sl-select::part(expand-icon) {
    order: 2;
    content: '';
    justify-self: end;
    width: 0.6em;
    height: 0.4em;
    background-color: var(--ra-select-arrow-color);
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  }

  sl-select::part(form-control-help-text) {
    color: #757575;
    font-size: 0.6875rem;
    line-height: 150%;
    margin: 0.25rem 0.75rem 0 0.75rem;
  }

  /* Get the tag close to the side edges of the combobox */
  sl-select#projects::part(tags) {
    margin-inline-start: calc(0.25rem - var(--sl-spacing-small));
  }
`;
