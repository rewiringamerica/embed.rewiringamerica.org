import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref';
import { inputStyles } from './styles/input';
import AutoNumeric from 'autonumeric';
import 'element-internals-polyfill';

@customElement('ra-currency-input')
export class CurrencyInput extends LitElement {
  static override styles = [
    css`
      * {
        box-sizing: border-box;
      }
    `,
    inputStyles
  ];

  @property({ type: String })
  value = '';

  // @property({ type: Number })
  // min = 0;

  // @property({ type: Number })
  // max = Number.MAX_VALUE;

  autonumeric?: AutoNumeric;

  internals?: ElementInternals;

  constructor() {
    super();
  }

  // this is for element-internals-polyfill
  static get formAssociated() {
    return true;
  }

  onChange() {
    const num = this.autonumeric!.getNumericString();
    if (num !== null) {
      this.value = num;
      this.internals?.setFormValue(this.value);
    }
  }

  onKeydown(event: KeyboardEvent) {
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
    this.autonumeric?.detach();
    this.removeEventListener('keydown', this.onKeydown);
    super.disconnectedCallback();
  }

  inputRefChanged(input?: Element) {
    if (input === undefined) {
      this.autonumeric?.detach();
    } else {
      this.autonumeric = new AutoNumeric(input as HTMLInputElement, this.value, AutoNumeric.getPredefinedOptions().NorthAmerican);
    }
  }

  override render() {
    return html`
        <input
          ${ref(this.inputRefChanged)}
          type="text"
          @change=${this.onChange}
        />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ra-currency-input": CurrencyInput;
  }
}
