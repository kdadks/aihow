import './commands';
import './api-commands';
import '@testing-library/cypress/add-commands';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-testid attribute
       * @example cy.dataCy('submit-button')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to login as a regular user
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>

      /**
       * Custom command to login as an admin user
       * @example cy.adminLogin('admin@example.com', 'adminpass123')
       */
      adminLogin(email: string, password: string): Chainable<void>

      /**
       * Custom command to log out the current user
       * @example cy.logout()
       */
      logout(): Chainable<void>

      /**
       * Custom command to mock Supabase authentication session
       * @example cy.mockAuthSession({ user: { id: '123', email: 'test@example.com' } })
       */
      mockAuthSession(session: { user: { id: string; email: string } } | null): Chainable<void>

      /**
       * Custom command to stub API responses
       * @example cy.mockApiResponse('GET', '/api/tools', { data: [] })
       */
      mockApiResponse(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        url: string,
        response: Record<string, unknown>
      ): Chainable<void>

      /**
       * Custom command to verify user permissions
       * @example cy.verifyPermission('can_moderate', true)
       */
      verifyPermission(permission: string, expected: boolean): Chainable<void>
    }
  }
}

// Custom command to get by data-testid
Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-testid="${value}"]`);
});
