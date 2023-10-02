/// <reference types="Cypress" />

describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:1234/rhode-island.html');
    cy.get('rewiring-america-state-calculator').should('exist');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Your household info');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('input#zip')
      .type('02859{enter}');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Incentives available to you in Rhode Island');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('select#utility')
      .should("exist");

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
      .contains("Other incentives available to you");
  });
});
