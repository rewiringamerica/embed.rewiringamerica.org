import AutoNumeric from 'autonumeric';
import 'element-internals-polyfill';
import { LitElement, PropertyValues, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref';

@customElement('ra-currency-input')
export class CurrencyInput extends LitElement {
  @property({ type: String })
  value = '';

  @property({ type: Number })
  min = 0;

  @property({ type: Number })
  max = Number.MAX_VALUE;

  @property({ type: String })
  placeholder = '$0.00';

  @property({ type: Boolean })
  required = false;

  @property({ type: String, attribute: 'inputid' })
  inputId = '';

  // this is optional because it can't exist until the input is rendered
  private autonumeric?: AutoNumeric;

  private internals: ElementInternals;

  // this is for element-internals-polyfill
  static get formAssociated() {
    return true;
  }

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  // be "light DOM" and allow styling to be set from the outside
  protected override createRenderRoot() {
    return this;
  }

  onChange() {
    const num = this.autonumeric!.getNumericString();
    if (num !== null) {
      this.value = num;
      // this ensures that when <ra-currency-input> is inside a form, new FormData(form) will pick up our value
      this.internals.setFormValue(this.value);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.internals.setFormValue(this.value);
  }

  override disconnectedCallback() {
    this.autonumeric?.detach();
    super.disconnectedCallback();
  }

  inputRefChanged(input?: Element) {
    if (input === undefined) {
      this.autonumeric?.detach();
    } else {
      if (AutoNumeric.getAutoNumericElement(input as HTMLElement) === null) {
        this.autonumeric = new AutoNumeric(
          input as HTMLInputElement,
          this.value,
          AutoNumeric.getPredefinedOptions().NorthAmerican,
        );
        this.updateAutonumericOptions();
      }
    }
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('min') || changedProperties.has('max')) {
      this.updateAutonumericOptions();
    }
    if (changedProperties.has('value')) {
      this.autonumeric?.set(this.value);
      this.internals.setFormValue(this.value);
    }
  }

  updateAutonumericOptions() {
    this.autonumeric?.update({
      // Prevent autonumeric from populating the field with "$" when focusing
      // it while empty. (That would suppress the browser's "fill out this
      // field" indicator.)
      emptyInputBehavior: 'press',
      minimumValue: this.min.toString(),
      maximumValue: this.max.toString(),
      decimalPlaces: 0,
      upDownStep: 1000,
    });
  }

  override render() {
    return html`
      <input
        ${ref(this.inputRefChanged)}
        type="text"
        id=${this.inputId}
        inputmode="numeric"
        @change=${this.onChange}
        placeholder=${this.placeholder}
        ?required=${this.required}
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ra-currency-input': CurrencyInput;
  }
}
