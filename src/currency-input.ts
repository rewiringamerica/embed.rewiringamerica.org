import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref';
import AutoNumeric from 'autonumeric';
import 'element-internals-polyfill';

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

  // this is optional because it can't exist until the input is rendered
  private autonumeric?: AutoNumeric;

  // this is optional because we set it in connectedCallback()
  private internals?: ElementInternals;

  // this is for element-internals-polyfill
  static get formAssociated() {
    return true;
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
      this.internals?.setFormValue(this.value);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.internals = this.attachInternals();
    this.internals?.setFormValue(this.value);
  }

  override disconnectedCallback() {
    this.autonumeric?.detach();
    super.disconnectedCallback();
  }

  inputRefChanged(input?: Element) {
    if (input === undefined) {
      this.autonumeric?.detach();
    } else {
      this.autonumeric = new AutoNumeric(
        input as HTMLInputElement,
        this.value,
        AutoNumeric.getPredefinedOptions().NorthAmerican,
      );
      this.updateAutonumericOptions();
    }
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('min') || changedProperties.has('max')) {
      this.updateAutonumericOptions();
    }
    if (changedProperties.has('value')) {
      this.autonumeric?.set(this.value);
      this.internals?.setFormValue(this.value);
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
