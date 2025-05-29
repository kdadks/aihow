import axios from 'axios';
import { APIError, APIResponse, APIErrorResponse } from './types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Type guard for error responses
function isErrorWithResponse(error: unknown): error is { 
  response?: { 
    data?: APIErrorResponse;
    status?: number;
  };
  message?: string;
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'message' in error)
  );
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
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(new APIError({
      message: error instanceof Error ? error.message : 'Request failed'
    }));
  }
);

// Add response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isErrorWithResponse(error) && error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
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
  const { data } = await client.get<APIResponse<T[]>>(endpoint, {
    params: {
      page,
      pageSize,
      ...queryParams
    }
  });
  return data;
}

// Export types and utilities
export { APIError };
export type { APIResponse };