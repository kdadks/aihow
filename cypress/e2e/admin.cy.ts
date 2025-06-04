describe('Admin Portal', () => {
  const adminUser = {
    id: 'admin-123',
    email: 'admin@example.com',
    role: 'admin'
  };

  const adminCredentials = {
    email: adminUser.email,
    password: 'adminPassword123!'
  };

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  describe('Admin Authentication', () => {
    it('successfully logs in as admin', () => {
      // Mock successful auth session
      cy.mockAuthSession({ user: adminUser });
      
      cy.adminLogin(adminCredentials.email, adminCredentials.password);
      cy.verifyPermission('can_manage_users', true);
    });

    it('shows error for invalid credentials', () => {
      // Mock failed auth response
      cy.mockApiResponse('POST', '*/auth/v1/token*', {
        error: 'Invalid credentials',
        statusCode: 401
      });

      cy.visit('/admin/login');
      cy.get('input[type="email"]').type('wrong@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.dataCy('error-message')
        .should('be.visible')
        .and('contain', 'Invalid credentials');
    });

    it('prevents access to admin routes without authentication', () => {
      cy.visit('/admin/dashboard');
      cy.url().should('include', '/admin/login');
    });
  });

  describe('Admin Dashboard', () => {
    beforeEach(() => {
      cy.mockAuthSession({ user: adminUser });
      cy.adminLogin(adminCredentials.email, adminCredentials.password);
      
      // Mock dashboard stats
      cy.mockApiResponse('GET', '*/api/admin/stats', {
        totalUsers: 1000,
        totalTools: 250,
        pendingReviews: 15
      });
    });

    it('displays dashboard overview', () => {
      cy.dataCy('dashboard-stats').within(() => {
        cy.dataCy('total-users').should('contain', '1,000');
        cy.dataCy('total-tools').should('contain', '250');
        cy.dataCy('pending-reviews').should('contain', '15');
      });
    });

    it('navigates between admin sections', () => {
      // Test navigation to different admin sections
      cy.dataCy('nav-users').click();
      cy.url().should('include', '/admin/users');
      
      cy.dataCy('nav-tools').click();
      cy.url().should('include', '/admin/tools');
      
      cy.dataCy('nav-reviews').click();
      cy.url().should('include', '/admin/reviews');
    });
  });

  describe('User Management', () => {
    beforeEach(() => {
      cy.mockAuthSession({ user: adminUser });
      cy.adminLogin(adminCredentials.email, adminCredentials.password);

      // Mock user list data
      cy.mockApiResponse('GET', '*/api/admin/users', {
        users: [
          { id: 'user1', email: 'user1@example.com', role: 'user' },
          { id: 'user2', email: 'user2@example.com', role: 'moderator' }
        ],
        total: 2
      });

      cy.dataCy('nav-users').click();
    });

    it('displays user list', () => {
      cy.dataCy('users-table').should('exist');
      cy.dataCy('user-row').should('have.length', 2);
      cy.dataCy('user-row').first().should('contain', 'user1@example.com');
    });

    it('can search users', () => {
      // Mock search response
      cy.mockApiResponse('GET', '*/api/admin/users?search=test@example.com', {
        users: [{ id: 'test1', email: 'test@example.com', role: 'user' }],
        total: 1
      });

      cy.dataCy('user-search').type('test@example.com{enter}');
      cy.dataCy('user-row').should('have.length', 1);
      cy.dataCy('user-row').should('contain', 'test@example.com');
    });

    it('can manage user roles', () => {
      // Mock role update response
      cy.mockApiResponse('PUT', '*/api/admin/users/*/role', {
        success: true,
        message: 'Role updated successfully'
      });

      cy.dataCy('user-row').first().within(() => {
        cy.dataCy('role-select').click();
        cy.get('li').contains('Moderator').click();
        cy.dataCy('save-role').click();
      });
      
      cy.dataCy('success-message')
        .should('be.visible')
        .and('contain', 'Role updated successfully');
    });
  });

  describe('Content Moderation', () => {
    beforeEach(() => {
      cy.mockAuthSession({ user: adminUser });
      cy.adminLogin(adminCredentials.email, adminCredentials.password);

      // Mock pending reviews data
      cy.mockApiResponse('GET', '*/api/admin/moderation/reviews', {
        reviews: [
          {
            id: 'review1',
            content: 'Test review 1',
            author: 'user1@example.com',
            status: 'pending'
          },
          {
            id: 'review2',
            content: 'Test review 2',
            author: 'user2@example.com',
            status: 'pending'
          }
        ]
      });

      cy.dataCy('nav-moderation').click();
    });

    it('displays pending reviews', () => {
      cy.dataCy('pending-reviews-list').should('exist');
      cy.dataCy('review-item').should('have.length', 2);
      cy.dataCy('review-item').first().should('contain', 'Test review 1');
    });

    it('can approve reviews', () => {
      cy.mockApiResponse('POST', '*/api/admin/moderation/reviews/*/approve', {
        success: true,
        message: 'Review approved successfully'
      });

      cy.dataCy('review-item').first().within(() => {
        cy.dataCy('approve-review').click();
      });
      
      cy.dataCy('success-message')
        .should('be.visible')
        .and('contain', 'Review approved successfully');
    });

    it('can reject reviews', () => {
      cy.mockApiResponse('POST', '*/api/admin/moderation/reviews/*/reject', {
        success: true,
        message: 'Review rejected successfully'
      });

      cy.dataCy('review-item').first().within(() => {
        cy.dataCy('reject-review').click();
      });
      
      cy.dataCy('success-message')
        .should('be.visible')
        .and('contain', 'Review rejected successfully');
    });
  });

  describe('Audit Log', () => {
    beforeEach(() => {
      cy.mockAuthSession({ user: adminUser });
      cy.adminLogin(adminCredentials.email, adminCredentials.password);

      // Mock audit log data
      cy.mockApiResponse('GET', '*/api/admin/audit-logs', {
        logs: [
          {
            id: 'log1',
            action: 'USER_ROLE_UPDATE',
            actor: 'admin@example.com',
            target: 'user1@example.com',
            details: 'Role changed to moderator',
            timestamp: new Date().toISOString()
          },
          {
            id: 'log2',
            action: 'REVIEW_APPROVED',
            actor: 'admin@example.com',
            target: 'review-123',
            details: 'Review approved',
            timestamp: new Date().toISOString()
          }
        ]
      });

      cy.dataCy('nav-audit').click();
    });

    it('displays audit log entries', () => {
      cy.dataCy('audit-log').should('exist');
      cy.dataCy('audit-entry').should('have.length', 2);
      cy.dataCy('audit-entry').first().should('contain', 'USER_ROLE_UPDATE');
    });

    it('can filter audit logs', () => {
      // Mock filtered audit log data
      cy.mockApiResponse('GET', '*/api/admin/audit-logs?type=USER_MANAGEMENT', {
        logs: [{
          id: 'log1',
          action: 'USER_ROLE_UPDATE',
          actor: 'admin@example.com',
          target: 'user1@example.com',
          details: 'Role changed to moderator',
          timestamp: new Date().toISOString()
        }]
      });

      cy.dataCy('audit-filter').click();
      cy.contains('User Management').click();
      cy.dataCy('audit-entry')
        .should('have.length', 1)
        .and('contain', 'USER_ROLE_UPDATE');
    });
  });
});
