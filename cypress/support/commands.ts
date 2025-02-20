/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// this stops VS Code yelling about the following `declare global`
export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      isInViewport(): void;
      isNotInViewport(): void;
      selectProjects(projects: string[]): void;
    }
  }
}

Cypress.Commands.add(
  'isNotInViewport',
  {
    prevSubject: 'element',
  },
  (element: JQuery<HTMLElement>) => {
    cy.wrap(element).then($el => {
      cy.window().then(window => {
        const bottom = Cypress.$(window).height();
        const rect = $el[0].getBoundingClientRect();
        expect(rect.top > bottom || rect.bottom <= 0).to.be.true;
      });
    });
  },
);

Cypress.Commands.add(
  'isInViewport',
  {
    prevSubject: 'element',
  },
  (element: JQuery<HTMLElement>) => {
    cy.wrap(element).then($el => {
      cy.window().then(window => {
        const bottom = Cypress.$(window).height();
        const rect = $el[0].getBoundingClientRect();
        expect(rect.top >= 0 && rect.top < bottom).to.be.true;
      });
    });
  },
);

Cypress.Commands.add(
  'selectProjects',
  { prevSubject: false },
  (projects: string[]) => {
    cy.get('rewiring-america-state-calculator')
      .shadow()
      .find('button#project-selector')
      .click();

    projects.forEach(project =>
      cy
        .get('rewiring-america-state-calculator')
        .shadow()
        .find(`li[data-value="${project}"]`)
        .click(),
    );

    // Wait for the dropdown to disappear, or else it will cause spurious a11y
    // failures (apparently because it will see the semitransparent colors of
    // the dropdown items as they animate out, and those don't have enough
    // contrast with the background?)
    //
    // It's a 100-ms animation (defined in Select.tsx), so give it 200 to be
    // safe. This is short enough not to be annoying when running tests.
    cy.wait(200);
  },
);
