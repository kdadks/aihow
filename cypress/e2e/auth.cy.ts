describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  describe('Login', () => {
    it('successfully logs in with valid credentials', () => {
      const testEmail = 'test@example.com';
      const testPassword = 'password123';

      cy.login(testEmail, testPassword);
      cy.url().should('include', '/dashboard');
      cy.contains(/welcome/i).should('be.visible');
    });

    it('shows error message with invalid credentials', () => {
      cy.visit('/login');
      cy.get('input[type="email"]').type('invalid@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.dataCy('error-message').should('contain', /invalid credentials/i);
    });

    it('navigates to forgot password page', () => {
      cy.visit('/login');
      cy.contains('Forgot Password?').click();
      cy.url().should('include', '/forgot-password');
    });
  });

  describe('Sign Up', () => {
    const newEmail = `test${Date.now()}@example.com`;
    const newPassword = 'TestPassword123!';

    it('successfully creates a new account', () => {
      cy.visit('/signup');
      cy.get('input[type="email"]').type(newEmail);
      cy.get('input#password').type(newPassword);
      cy.get('input#confirmPassword').type(newPassword);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/confirm-email');
      cy.contains(/confirmation email/i).should('be.visible');
    });

    it('validates password requirements', () => {
      cy.visit('/signup');
      cy.get('input[type="email"]').type(newEmail);
      cy.get('input#password').type('weak');
      cy.get('button[type="submit"]').click();
      
      cy.dataCy('password-error').should('contain', /password must be at least/i);
    });
  });

  describe('Password Reset', () => {
    it('initiates password reset flow', () => {
      cy.visit('/forgot-password');
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();
      
      cy.dataCy('success-message').should('contain', /reset link sent/i);
    });
  });

  describe('Logout', () => {
    it('successfully logs out', () => {
      cy.login('test@example.com', 'password123');
      cy.logout();
      
      cy.url().should('include', '/login');
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });
  });
});
