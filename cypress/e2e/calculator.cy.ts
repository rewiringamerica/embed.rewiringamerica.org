describe('rewiring-america-calculator', () => {
  it('passes', () => {
    cy.visit('http://localhost:1234/ira-calculator.html');
    cy.get('rewiring-america-calculator').should('exist');
    // FIXME: is there a way to do this less repetitively?
    // Doing const shadow = cy.get(...).shadow() didn't seem to work.
    cy.get('rewiring-america-calculator')
      .shadow()
      .contains('Upfront Discounts')
      .siblings()
      .contains('$14,000');
    cy.get('rewiring-america-calculator')
      .shadow()
      .contains('Available Tax Credits')
      .siblings()
      .contains('$9,850');
    cy.get('rewiring-america-calculator')
      .shadow()
      .contains('Estimated Bill Savings Per Year')
      .siblings()
      .contains('$1,050');
    cy.get('rewiring-america-calculator')
      .shadow()
      .contains('Covers up to 50% of costs');
  });
});
