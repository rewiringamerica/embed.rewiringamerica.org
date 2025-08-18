/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('bill impact calculator', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234/bill-impact-calculator.html');

    // Inject the axe-core library
    cy.injectAxe();
  });

  it('renders the calculator', () => {
    cy.get('rewiring-america-bill-impact-calculator').should('exist');

    cy.get('rewiring-america-bill-impact-calculator')
      .shadow()
      .contains('Your household info');
  });

  it('has no detectable a11y violations on load', () => {
    cy.get('rewiring-america-bill-impact-calculator')
      .shadow()
      .checkA11y(null, {
        runOnly: ['wcag2a', 'wcag2aa'],
      });
  });
});
