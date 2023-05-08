import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref';
import IMask from 'imask/esm/imask'; // imports only factory
import 'imask/esm/masked/number'; // add needed features
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
  private mask?: IMask.InputMask<Opts>;

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
    const num = this.mask!.unmaskedValue;
    if (num !== null) {
      this.value = num;
      // this ensures that when <ra-currency-input> is inside a form, new FormData(form) will pick up our value
      this.internals?.setFormValue(this.value);
    }
  }

  onKeydown(event: KeyboardEvent) {
    // this simulates submit on the host form, just like if you hit Enter in a regular <input>
    if (event.key == 'Enter') {
      const element: CurrencyInput = event.target as CurrencyInput;
      element.internals?.form?.requestSubmit();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.internals = this.attachInternals();
    this.internals?.setFormValue(this.value);
    this.addEventListener('keydown', this.onKeydown);
  }

  override disconnectedCallback() {
    this.mask?.destroy();
    this.removeEventListener('keydown', this.onKeydown);
    super.disconnectedCallback();
  }

  inputRefChanged(input?: Element) {
    if (input === undefined) {
      this.mask?.destroy();
    } else {
      this.mask = IMask(input as HTMLInputElement, {
        mask: '$num',
        blocks: {
          num: {
            mask: Number,
            scale: 0,  // digits after point, 0 for integers
            signed: false,  // disallow negative
            thousandsSeparator: ',',  // any single char
            padFractionalZeros: false,  // if true, then pads zeros at end to the length of scale
            normalizeZeros: true,  // appends or removes zeros at ends
          }
        }
      });
      this.updatemaskOptions();
    }
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('min') || changedProperties.has('max')) {
      this.updatemaskOptions();
    }
    if (changedProperties.has('value') && this.mask) {
      this.mask.unmaskedValue = this.value;
    }
  }

  updatemaskOptions() {
    this.mask?.updateOptions({
      min: this.min,
      max: this.max,
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
    "ra-currency-input": CurrencyInput;
  }
}
