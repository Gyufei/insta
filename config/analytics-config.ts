/**
 * Analytics configuration constants
 * Centralized configuration for Google Analytics and other analytics services
 */

// Google Analytics configuration with default fallback
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-5LQD7PLMH8';

// Analytics configuration object for future extensibility
export const ANALYTICS_CONFIG = {
  googleAnalytics: {
    measurementId: GA_ID,
    enabled: !!GA_ID,
  },
  // Future analytics services can be added here
  // mixpanel: { ... },
  // amplitude: { ... },
} as const;