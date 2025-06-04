import { defineConfig } from 'cypress';
import { resolve } from 'path';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        failed(message) {
          console.error(message);
          return null;
        }
      });

      // Set up reporter configuration
      const reportsFolder = resolve(process.cwd(), 'cypress', 'reports');
      config.reporter = 'cypress/reporters/performance.ts';
      config.reporterOptions = {
        reportDir: reportsFolder,
        overwrite: false,
        html: false,
        json: true,
      };

      return config;
    },

    env: {
      apiUrl: 'http://localhost:5173/api',
      // Feature flags for tests
      enableMocking: true,
      enableNetworkDebug: false,
      enablePerformanceReporting: true,
    },

    // Test configuration
    testIsolation: true,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    
    // Viewport configuration
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Retry configuration
    retries: {
      runMode: 2,      // Retry failed tests up to 2 times in CI
      openMode: 0      // Don't retry in interactive mode
    },

    // Screenshot configuration
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: true,

    // Video configuration
    videosFolder: 'cypress/videos',
    videoCompression: 32,
    
    // Component testing configuration
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 50,
  },

  // Component Testing Config
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'cypress/component/**/*.cy.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
  },
});
