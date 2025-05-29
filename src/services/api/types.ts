import axios from 'axios';

export interface APIResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> extends APIResponse {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryParams {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface APIErrorResponse {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// Export the class directly, not as a type
export class APIError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, any>;

  constructor(
    error: { 
      response?: { 
        data?: APIErrorResponse; 
        status?: number;
      };
      message?: string;
    }
  ) {
    const message = error.response?.data?.message || error.message || 'Unknown error occurred';
    super(message);
    
    this.name = 'APIError';
    this.code = error.response?.data?.code || 'UNKNOWN_ERROR';
    this.status = error.response?.status || 500;
    this.details = error.response?.data?.details;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, APIError.prototype);
  }
}