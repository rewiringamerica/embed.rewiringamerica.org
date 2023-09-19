import { html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';

export interface OptionParam {
  label: string;
  value: string;
}

export interface SelectParam {
  id: string;
  required: boolean;
  options: OptionParam[];
  currentValue: string;
  tabIndex?: number;
  onChange?: (event: InputEvent) => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export interface MultiSelectParam {
  id: string;
  label?: string;
  currentValues: string[];
  options: OptionParam[];
  helpText?: string;
  placeholder?: string;
  maxOptionsVisible?: number;
}

export const option = ({ label, value }: OptionParam, selected: boolean) =>
  html` <option value="${value}" ?selected=${selected}>${label}</option> `;

export const multioption = ({ label, value }: OptionParam) =>
  html` <sl-option value="${value}">${label}</sl-option> `;

export const select = ({
  id,
  required,
  options,
  currentValue,
  tabIndex,
  onChange,
  ariaLabel,
  disabled,
}: SelectParam) => {
  return html`
    <div class="select">
      <select
        id="${id}"
        name="${id}"
        ?required=${required}
        ?disabled=${disabled}
        tabindex="${ifDefined(tabIndex)}"
        aria-label="${ifDefined(ariaLabel)}"
        @change=${onChange}
      >
        ${options.map(o => option(o, o.value === currentValue))}
      </select>
      <span class="focus"></span>
    </div>
  `;
};

export const multiselect = ({
  id,
  label,
  currentValues,
  options,
  helpText,
  placeholder,
  maxOptionsVisible,
}: MultiSelectParam) => {
  return html`
    <div>
      <sl-select
        id="${id}"
        name="${id}"
        label="${ifDefined(label)}"
        value="${currentValues.join(' ')}"
        help-text="${ifDefined(helpText)}"
        placeholder="${ifDefined(placeholder)}"
        max-options-visible="${ifDefined(maxOptionsVisible)}"
        multiple
        clearable
      >
        <sl-icon slot="expand-icon" name="caret-down-fill"></sl-icon>
        ${options.map(o => multioption(o))}
      </sl-select>
      <span class="focus"></span>
    </div>
  `;
};

export const selectStyles = css`
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
    border: var(--select-border);
    border-radius: 4px;
    padding: 8px;

    /*   font-size: 1.25rem; */
    cursor: pointer;
    /*   line-height: 1.1; */

    /*   // Optional styles
  // remove for transparency */
    background-color: #fff;
    background-image: linear-gradient(to top, #f9f9f9, #fff 33%);

    margin-top: 4px;
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
    width: 0.6em;
    height: 0.4em;
    background-color: var(--select-arrow);
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  }

  /* // Interim solution until :focus-within has better support */
  select:focus + .focus {
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border: 2px solid var(--select-focus);
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
    outline-color: var(--select-focus);
  }

  .select--disabled {
    cursor: not-allowed;
    background-color: #eee;
    background-image: linear-gradient(to top, #ddd, #eee 33%);
  }

  sl-select {
    --sl-input-height-medium: 2.8215rem;
    --sl-input-focus-ring-color: var(--select-focus);
    --sl-input-focus-ring-style: solid;
    --sl-focus-ring-width: 1px;

    --sl-input-border-width: 1px;
    --sl-input-border-color-focus: var(--select-focus);

    margin-top: 4px;
  }
  // parts go largest to smallest

  // wraps label, input and helptext
  sl-select::part(form-control) {
  }
  // don't need we are using html label
  sl-select::part(form-control-label) {
  }
  // select wrapper
  sl-select::part(form-control-input) {
  }
  // help text
  sl-select::part(form-control-help-text) {
  }
  // The container the wraps the prefix, combobox, clear icon, and expand button.
  sl-select::part(combobox) {
  }
  // The container that wraps the prefix slot (geat icon?)
  sl-select::part(prefix) {
  }
  // selected option label
  sl-select::part(display-input) {
  }
  // the container where options are listed
  sl-select::part(listbox) {
  }

  sl-select::part(expand-icon) {
    width: 0.75em;
    height: 0.5em;
  }
`;
