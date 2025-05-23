
import config from '@/config';
import { markUploadStart, markPreviewReady, reportFalsePositive, logError, initSentry, initPostHog } from './instrumentation';

export const initAnalytics = () => {
  if (!config.features.enableAnalytics) {
    console.log("[Analytics] Analytics disabled by feature flag");
    return;
  }

  // Initialize Sentry
  if (config.analytics.sentry.dsn) {
    initSentry();
  }
  
  // Initialize PostHog
  if (config.analytics.posthog.apiKey) {
    initPostHog();
  }
  
  console.log("[Analytics] Services initialized");
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!config.features.enableAnalytics) return;
  
  // Only track in production to avoid polluting analytics with dev data
  if (import.meta.env.PROD) {
    try {
      console.log(`[Analytics] Event tracked: ${eventName}`, properties);
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error);
    }
  }
};

export const trackError = (error: Error, context?: Record<string, any>) => {
  if (!config.features.enableAnalytics) return;
  
  if (import.meta.env.PROD) {
    // Log to Sentry if available
    logError(error, context);
    
    // Also track as an event
    trackEvent('error', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  } else {
    console.error('[Analytics] Error:', error, context);
  }
};

export {
  markUploadStart,
  markPreviewReady,
  reportFalsePositive,
};
