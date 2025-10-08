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
      .contains(/We found \d+ savings programs across \d+ projects./);

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains(
        'To view your eligible savings programs, select a project above.',
      );

    cy.selectProjects(['ev']);

    // RI state incentive
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Up to $1,500 off a new electric vehicle');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Brought to you in partnership with');

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .checkA11y(null, {
        runOnly: ['wcag2a', 'wcag2aa'],
      });

    cy.selectProjects(['cooking']);

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .contains('Up to $420 off an electric/induction stove');
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

  it('shows "coming soon" banner', () => {
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('#zip')
      .type('57104'); // South Dakota

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('button#calculate')
      .click();

    // Don't show it until a project is selected and results are displayed
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .should('not.contain.text', 'More money coming soon!');

    cy.selectProjects(['hvac']);

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .should('contain.text', 'More money coming soon!');
  });

  describe('when the user enters a RI address', () => {
    it('fetches utilities without a zip code provided', () => {
      cy.get('rewiring-america-state-calculator')
        .then($calc => {
          $calc.attr('show-address-field', '');
        })
        .shadow()
        .find('input#address')
        .type('82 Smith St, Providence, RI');

      // Unfocus the zip field to fetch utilities
      cy.get('rewiring-america-state-calculator')
        .shadow()
        .find('input#household_income')
        .focus();

      cy.get('rewiring-america-state-calculator')
        .shadow()
        .find('button#utility')
        .contains('Rhode Island Energy');
    });

    it('fetches utilities with a zip code provided', () => {
      cy.get('rewiring-america-state-calculator')
        .then($calc => {
          $calc.attr('show-address-field', '');
        })
        .shadow()
        .find('input#address')
        .type('4 Center Rd, New Shoreham, RI 02807');

      cy.get('rewiring-america-state-calculator')
        .shadow()
        .find('button#utility')
        .contains('Block Island Power Company');
    });
  });
});
