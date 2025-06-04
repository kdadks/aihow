# Testing Guide

This document outlines the testing setup and procedures for the AI Tools Directory project.

## End-to-End Testing with Cypress

The project uses Cypress for end-to-end testing, ensuring that the application works correctly from a user's perspective.

### Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Cypress environment:
```bash
npm run cypress:setup
```
This will create a `cypress.env.json` file with default values. Update these values with your local development credentials.

### Running Tests

There are several ways to run the E2E tests:

- **Development Mode (with UI)**:
```bash
npm run test:e2e:dev
```
This opens the Cypress UI where you can select and run individual tests.

- **Headless Mode**:
```bash
npm run test:e2e
```
Runs all E2E tests in headless mode, suitable for CI/CD.

- **CI Mode**:
```bash
npm run test:e2e:ci
```
Starts the development server and runs tests, suitable for CI environments.

- **All Tests** (Unit + E2E):
```bash
npm run test:all
```

### Test Structure

The E2E tests are organized into the following categories:

- `auth.cy.ts`: Authentication flows (login, signup, password reset)
- `tools.cy.ts`: Tool directory features (listing, filtering, search)
- `admin.cy.ts`: Admin portal functionality

### Writing Tests

When writing new E2E tests:

1. Use the `dataCy` selector helper:
```typescript
cy.dataCy('button-submit').click()
```

2. Mock API responses when needed:
```typescript
cy.mockApiResponse('GET', '/api/tools', {
  data: [/* your test data */]
})
```

3. Test authentication states:
```typescript
cy.mockAuthSession({
  user: {
    id: 'test-user',
    email: 'test@example.com'
  }
})
```

### Environment Variables

The following environment variables are required for E2E tests:

```env
CYPRESS_BASE_URL=http://localhost:5173
CYPRESS_SUPABASE_URL=your-supabase-url
CYPRESS_SUPABASE_ANON_KEY=your-anon-key
```

These can be set in `cypress.env.json` for local development.

### CI/CD Integration

The E2E tests are automatically run in the CI pipeline:

1. On pull requests to `main`
2. On direct pushes to `main`

The workflow runs tests in both Chrome and Firefox browsers to ensure cross-browser compatibility.

### Debugging

When tests fail:

1. Check the screenshots in `cypress/screenshots`
2. Review the video recordings in `cypress/videos`
3. Use `cy.debug()` in your tests to pause execution

### Best Practices

1. Use `data-testid` attributes for test selectors
2. Mock external dependencies
3. Keep tests independent
4. Clean up state between tests
5. Use meaningful test descriptions
6. Group related tests using `describe` blocks
7. Add appropriate assertions
8. Handle loading states in tests

### Common Issues

1. **Test Flakiness**
   - Use appropriate waiting strategies
   - Avoid timing-dependent tests
   - Mock network requests consistently

2. **Authentication Issues**
   - Clear localStorage between tests
   - Mock auth state appropriately
   - Handle token expiration

3. **Performance**
   - Group related tests
   - Mock heavy network requests
   - Use `beforeEach` hooks efficiently
