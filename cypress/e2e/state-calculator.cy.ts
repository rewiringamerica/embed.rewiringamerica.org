/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('rewiring-america-state-calculator', () => {
  beforeEach(function () {
    cy.visit('http://localhost:1234');

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
    cy.selectProjects(['hvac']);

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('input#zip')
      .type('02861');

    // Unfocus the zip field to fetch utilities
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('input#household_income')
      .focus();

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('button#utility')
      .contains('Rhode Island Energy');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('button#calculate')
      .click();

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Incentives you’re interested in');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Discount off a heat pump');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('$1,000/ton off an air source heat pump');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('$350/ton off a ducted heat pump');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('30% of cost of geothermal heating installation');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('$2,000 off an air source heat pump');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Other incentives available to you');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Brought to you in partnership with');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .checkA11y(null, {
        runOnly: ['wcag2a', 'wcag2aa'],
      });
  });

  it('shows an empty state if you are not eligible for any incentives for your chosen project', () => {
    cy.selectProjects(['cooking']);

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('#zip')
      .type('02859');

    // "force" to work around a Cypress bug
    // https://github.com/cypress-io/cypress/issues/5830
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('#household_income')
      .type('200000{enter}', { force: true });

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

  it('shows an error if you query in the wrong state', () => {
    // Add the state-restricting attribute to the element
    cy.get('rewiring-america-state-calculator').invoke('attr', 'state', 'RI');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('#zip')
      .type('94306'); // California

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('button#calculate')
      .click();

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('#error-msg')
      .should('contain.text', 'That ZIP code is not in Rhode Island.');
  });
});
