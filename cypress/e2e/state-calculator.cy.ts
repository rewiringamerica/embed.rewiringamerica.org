/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('rewiring-america-state-calculator', () => {
  beforeEach(function () {
    cy.visit('http://localhost:1234/rhode-island.html');

    // Inject the axe-core library
    cy.injectAxe();
  });

  it('Has no detectable a11y violations on load', () => {
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .checkA11y(null, {
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

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Incentives available to you in Rhode Island');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('sl-select#utility')
      .should('exist');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Incentives you’re interested in');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('$8,000 off a heat pump');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('$1,000/ton off a heat pump');

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

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Incentive data brought to you by');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .checkA11y(null, {
        runOnly: ['wcag2a', 'wcag2aa'],
      });
  });

  it('shows an empty state if you are not eligible for any incentives for your chosen project', () => {
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('sl-select#projects')
      .invoke('attr', 'value', 'cooking');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('#zip')
      .type('02859');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('#household_income')
      .type('200000{enter}');

    // make sure we saw an empty result state, and scroll down to it:
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('No incentives available for this project')
      .scrollIntoView();

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .checkA11y(null, {
        runOnly: ['wcag2a', 'wcag2aa'],
      });

    // // make sure we have scrolled down
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Your household info')
      .isNotInViewport();

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('button.text')
      .contains('Back to calculator')
      .click();

    // wait for animated scroll
    cy.wait(1000);

    // make sure we scrolled back up
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Your household info')
      .isInViewport();
  });
});
