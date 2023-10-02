/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('template spec', () => {
  beforeEach(function () {
    cy.visit('http://localhost:1234/rhode-island.html');

    // Inject the axe-core library
    cy.injectAxe();
  });

  it('Has no detectable a11y violations on load', () => {
    cy.checkA11y(null, {
      runOnly: ['wcag2a', 'wcag2aa'],
    });
  });

  it('renders the calculator', () => {
    cy.get('rewiring-america-state-calculator').should('exist');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Your household info');
  });

  it('fetches results if you submit after entering a RI zip code', () => {
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('sl-select#projects')
      .invoke('attr', 'value', 'hvac');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('input#zip')
      .type('02859{enter}');

    cy.checkA11y(null, {
      runOnly: ['wcag2a', 'wcag2aa'],
    });

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Incentives available to you in Rhode Island');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('select#utility')
      .should('exist');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains("Incentives you're interested in");

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('$8,000 off a heat pump');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('$1,250/ton off a heat pump');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('$350/ton off a heat pump');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('30% of cost of geothermal heating installation');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('$2,000 off a heat pump');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Other incentives available to you');
  });
});
