import { RewiringAmericaCalculator } from './incentives/calculator-element';

// There are two custom component names in use in the wild; support both of
// them here.
customElements.define(
  'rewiring-america-state-calculator',
  RewiringAmericaCalculator,
);

// Clients using this tag will be importing "/calculator.js". We don't build
// that file using Parcel; it's just a copy of the built version of this file.
// This is a workaround for a Parcel bug.
// See https://github.com/parcel-bundler/parcel/issues/10213
customElements.define(
  'rewiring-america-calculator',
  // Have to define a separate class, because it's an error to define() two
  // different names to the same constructor.
  class extends RewiringAmericaCalculator {},
);

/**
 * Tell TypeScript that the HTML tag's type signature corresponds to the
 * class's type signature.
 */
declare global {
  interface HTMLElementTagNameMap {
    'rewiring-america-state-calculator': RewiringAmericaCalculator;
    'rewiring-america-calculator': RewiringAmericaCalculator;
  }
}
