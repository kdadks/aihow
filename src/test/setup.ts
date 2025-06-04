import '@testing-library/jest-dom';
import { expect, beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Cleanup DOM after each test
beforeEach(() => {
  // Reset handler mocks
  vi.resetModules();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
