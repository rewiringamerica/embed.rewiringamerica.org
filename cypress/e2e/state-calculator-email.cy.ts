/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('rewiring-america-state-calculator email field', () => {
  beforeEach(function () {
    cy.visit('http://localhost:1234');
  });

  it('does not show the email field by default', () => {
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('#email')
      .should('not.exist');
  });

  it('shows the email field if requested', () => {
    cy.get('rewiring-america-state-calculator').invoke(
      'attr',
      'show-email',
      'true',
    );

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('#email')
      .should('exist');
  });

  it('allows overriding the email field helper if a slot is provided', () => {
    cy.get('rewiring-america-state-calculator').invoke(
      'attr',
      'show-email',
      'true',
    );

    cy.get('rewiring-america-state-calculator').then($el => {
      $el.append(
        '<span id="test-email-helper" slot="email-helper">Get updates from Rewiring America and our partners.</span>',
      );
    });

    cy.get('rewiring-america-state-calculator')
      .find('#test-email-helper')
      .should('contain', 'Get updates from Rewiring America and our partners.')
      .should('be.visible');
  });
});
