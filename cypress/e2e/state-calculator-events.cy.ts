/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('rewiring-america-state-calculator events', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.visit('http://localhost:1234/rhode-island.html');
  });

  it('dispatches the calculator-submitted event', () => {
    const submit = cy.spy();

    cy.get('rewiring-america-state-calculator').then(element => {
      element.get(0).addEventListener('calculator-submitted', submit);
    });

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('input#zip')
      .type('02859{enter}')
      .then(() => {
        expect(submit).to.be.calledOnce;
        const [event] = submit.firstCall.args;
        expect(event.type).to.equal('calculator-submitted');
        expect(event.bubbles).to.be.true;
        expect(event.composed).to.be.true;
        expect(event.detail).to.exist;
        expect(event.detail.formData).to.exist;
        expect(event.detail.formData.zip).to.equal('02859');
      });
  });

  it('dispatches the calculator-reset event', () => {
    const reset = cy.spy();

    cy.get('rewiring-america-state-calculator').then(element => {
      element.get(0).addEventListener('calculator-reset', reset);
    });

    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('.form-title__reset')
      .click()
      .then(() => {
        expect(reset).to.be.calledOnce;
        const [event] = reset.firstCall.args;
        expect(event.detail).to.not.exist;
      });
  });
});
