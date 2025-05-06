import { RewiringAmericaCalculator } from './calculator-element';

customElements.define('rewiring-america-calculator', RewiringAmericaCalculator);

declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-calculator': RewiringAmericaCalculator;
  }
}
