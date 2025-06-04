# Defect Report: AUTH-001
## Title: AuthProvider Context Missing in Tests

### Priority: High
### Status: Open
### Component: Authentication
### File: src/auth/hooks/useAuth.tsx

### Description
The AuthProvider context is not properly set up in test environment, causing multiple test failures across authentication-related tests.

### Test Failures
1. Should expose auth state and methods
2. Should handle login errors
3. Should handle profile updates
4. Should handle profile update errors
5. Should check roles correctly
6. Should check permissions correctly
7. Should provide authentication context to children

### Error Message
```
Error: useAuth must be used within an AuthProvider
at Module.useAuth src/auth/hooks/useAuth.tsx:220:15
```

### Expected Behavior
- Tests should run with a properly mocked AuthProvider context
- All auth-related functionality should be testable in isolation

### Actual Behavior
- Tests fail due to missing AuthProvider context
- useAuth hook throws error when context is not available

### Steps to Reproduce
1. Run `npm test`
2. Observe auth-related test failures

### Recommended Fix
1. Create test wrapper with AuthProvider
2. Add test utilities for auth context mocking
3. Update test setup to include necessary provider context
