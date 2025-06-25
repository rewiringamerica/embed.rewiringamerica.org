import { RewiringAmericaCalculator } from './incentives/calculator-element';
import { BillImpactCalculator } from './rem/element';

customElements.define('rewiring-america-calculator', RewiringAmericaCalculator);
customElements.define(
  'rewiring-america-bill-impact-calculator',
  BillImpactCalculator,
);

declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-calculator': RewiringAmericaCalculator;
  }
}
