import { client, getPaginated } from './client';
import { analytics } from './analytics';
import { content } from './content';
import { config } from './config';

// Re-export types
export type {
  APIResponse,
  PaginatedResponse,
  QueryParams,
  APIErrorResponse
} from './types';

export type {
  ContentItem,
  ContentVersion
} from './content';

export type {
  SystemSetting,
  FeatureFlag
} from './config';

// Re-export error class
export { APIError } from './types';

// Export unified API object
export const api = {
  client,
  getPaginated,
  analytics,
  content,
  config
};