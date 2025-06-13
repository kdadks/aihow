import axios from 'axios';
import { APIError, APIResponse, APIErrorResponse } from './types';
import { supabase } from '../../lib/supabase';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Type guard for error responses
function isErrorWithResponse(error: unknown): error is { 
  response?: { 
    data?: APIErrorResponse;
    status?: number;
  };
  message?: string;
} {
  return typeof error === 'object' && error !== null && 'response' in error;
}

// Create axios instance
export const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth
client.interceptors.request.use(
  // @ts-ignore - ignore type errors for now to get the functionality working
  (config) => {
    return Promise.resolve().then(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Initialize headers if needed
      const headers = config.headers || {};
      
      // Set required Supabase REST API headers
      headers['apikey'] = supabaseAnonKey;
      headers['Prefer'] = 'return=representation';  // Get back full response data
      
      // Add auth token if available
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Set the modified headers
      config.headers = headers;

      // If this is a Supabase REST API call, use the Supabase URL
      if (config.url?.includes('/rest/v1/')) {
        config.baseURL = import.meta.env.VITE_SUPABASE_URL;
      }

      return config;
    });
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isErrorWithResponse(error) && error.response?.status === 401) {
      // Handle unauthorized access by signing out
      supabase.auth.signOut();
      window.location.href = '/login';
    }

    if (isErrorWithResponse(error)) {
      return Promise.reject(new APIError({
        response: {
          data: error.response?.data,
          status: error.response?.status
        },
        message: error.message
      }));
    }

    return Promise.reject(new APIError({
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }));
  }
);

// Helper function for paginated requests
export async function getPaginated<T>(
  endpoint: string,
  page: number,
  pageSize: number,
  queryParams: Record<string, any> = {}
): Promise<APIResponse<T[]>> {
  const params = {
    ...queryParams,
    page,
    pageSize
  };

  const response = await client.get<APIResponse<T[]>>(endpoint, { params });
  return response.data;
}

// Export types and utilities
export { APIError };
export type { APIResponse };