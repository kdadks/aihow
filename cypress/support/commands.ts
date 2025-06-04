/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      adminLogin(email: string, password: string): Chainable<void>
      logout(): Chainable<void>
    }
  }
}

// Custom command for user login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Custom command for admin login
Cypress.Commands.add('adminLogin', (email: string, password: string) => {
  cy.visit('/admin/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/admin/dashboard');
  cy.dataCy('admin-header').should('exist');
});

// Custom command for logging out
Cypress.Commands.add('logout', () => {
  cy.get('button[aria-label="Sign out"]').click();
  cy.url().should('include', '/login');
});

export {};
