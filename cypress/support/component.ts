/// <reference types="cypress" />
import * as React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './commands';

// Import existing test utilities if available
import type { MountReturn } from 'cypress/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

interface MountOptions {
  routerProps?: Record<string, unknown>;
  queryClientProps?: Record<string, unknown>;
  [key: string]: unknown;
}

// Augment the Cypress namespace to include type definitions for our custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom mount command for React components
       * @param component React component to mount 
       * @param options Mount options including router and query client props
       */
      mount: typeof mount & {
        (component: React.ReactNode, options?: MountOptions): Chainable<MountReturn>
      };
    }
  }
}

// Add custom mount command for component testing
Cypress.Commands.add('mount', (component: React.ReactNode, options: MountOptions = {}) => {
  const { routerProps = {}, queryClientProps = {}, ...mountOptions } = options;

  const wrapped = React.createElement(
    QueryClientProvider,
    { client: queryClient, ...queryClientProps },
    React.createElement(
      MemoryRouter,
      routerProps,
      component
    )
  );

  return mount(wrapped, mountOptions);
});

// Import global styles
import '../../src/index.css';

// Reset test data before each test
beforeEach(() => {
  queryClient.clear();
});

// Add custom window types
declare global {
  interface Window {
    Cypress: typeof Cypress & {
      // Add any additional Cypress properties used in tests
      [key: string]: unknown;
    };
  }
}
