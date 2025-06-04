/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to get a DOM element by data-testid attribute
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
     * Custom command to mock Supabase authentication
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
     * Custom command to test permissions
     * @example cy.verifyPermission('can_moderate', true)
     */
    verifyPermission(permission: string, expected: boolean): Chainable<void>
  }
}
