import { RewiringAmericaCalculator } from './incentives/calculator-element';
import { ElectrificationImpactsCalculator } from './rem/element';

customElements.define('rewiring-america-calculator', RewiringAmericaCalculator);
customElements.define(
  'rewiring-america-impacts-calculator',
  ElectrificationImpactsCalculator,
);

declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-calculator': RewiringAmericaCalculator;
  }
}
