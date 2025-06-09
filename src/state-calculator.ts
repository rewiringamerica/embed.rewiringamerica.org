import { RewiringAmericaCalculator } from './incentives/calculator-element';

customElements.define(
  'rewiring-america-state-calculator',
  RewiringAmericaCalculator,
);

/**
 * Tell TypeScript that the HTML tag's type signature corresponds to the
 * class's type signature.
 */
declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-state-calculator': RewiringAmericaCalculator;
  }
}
