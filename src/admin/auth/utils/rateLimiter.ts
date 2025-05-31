import rateLimit from 'express-rate-limit';

/**
 * Rate limiting configuration for admin authentication
 * Prevents brute force attacks by limiting login attempts
 */
export const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

/**
 * Type definition for the rate limiter configuration
 */
export type AdminRateLimiterConfig = {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
};