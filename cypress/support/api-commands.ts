/// <reference types="cypress" />

interface AuthUser {
  id: string;
  aud: string;
  email: string;
  role?: string;
  created_at: string;
  confirmed_at: string;
  app_metadata?: {
    provider: string;
    role: string;
    permissions: string[];
  };
  user_metadata?: {
    avatar_url: string | null;
  };
}

interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Command to mock Supabase authentication session
Cypress.Commands.add(
  'mockAuthSession',
  (session: { user: Pick<AuthUser, 'id' | 'email'> } | null) => {
    if (session) {
      window.localStorage.setItem(
        'supabase.auth.token',
        JSON.stringify({
          currentSession: {
            access_token: 'fake-token',
            refresh_token: 'fake-refresh-token',
            user: session.user,
            expires_at: Date.now() + 3600000 // 1 hour from now
          }
        })
      );
    } else {
      window.localStorage.removeItem('supabase.auth.token');
    }
  }
);

// Command to stub API responses
Cypress.Commands.add(
  'mockApiResponse',
  (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    response: Record<string, unknown>
  ) => {
    cy.intercept(
      {
        method,
        url,
      },
      {
        statusCode: 200,
        body: response,
        delay: 100 // Add slight delay to simulate network
      }
    ).as(`mock-${method}-${url}`);
  }
);

// Command to verify user permissions
Cypress.Commands.add(
  'verifyPermission',
  (permission: string, expected: boolean) => {
    // First check if the user is logged in
    cy.window()
      .its('localStorage')
      .invoke('getItem', 'supabase.auth.token')
      .then((authToken) => {
        if (!authToken && expected) {
          throw new Error('User is not logged in');
        }

        if (authToken) {
          const session = JSON.parse(authToken);
          const permissions =
            session.currentSession.user.app_metadata?.permissions || [];

          if (expected) {
            expect(permissions).to.include(permission);
          } else {
            expect(permissions).to.not.include(permission);
          }
        }
      });
  }
);

// Helper function to generate fake authentication tokens
export const generateFakeToken = (
  userData: Pick<AuthUser, 'id' | 'email' | 'role'>
): AuthSession => {
  return {
    access_token: 'fake-jwt-token',
    refresh_token: 'fake-refresh-token',
    expires_at: Date.now() + 3600000,
    user: {
      ...userData,
      aud: 'authenticated',
      app_metadata: {
        provider: 'email',
        role: userData.role || 'user',
        permissions: userData.role === 'admin' ? ['can_moderate', 'can_manage_users'] : []
      },
      user_metadata: {
        avatar_url: null
      },
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString()
    }
  };
};

export type { AuthUser, AuthSession };
