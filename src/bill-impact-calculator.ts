import { BillImpactCalculator } from './rem/element';

customElements.define(
  'rewiring-america-bill-impact-calculator',
  BillImpactCalculator,
);

declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-bill-impact-calculator': BillImpactCalculator;
  }
}
