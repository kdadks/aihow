/**
 * Security headers configuration for admin routes
 * Implements recommended security headers to protect against common web vulnerabilities
 */
export const adminSecurityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; frame-ancestors 'none';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-Admin-Protected': 'true'
} as const;

/**
 * Type definition for admin security headers
 */
export type AdminSecurityHeaders = typeof adminSecurityHeaders;