
import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';
import config from '@/config';

// Initialize Sentry
export const initSentry = () => {
  Sentry.init({
    dsn: config.externalServices.analytics.sentryDsn,
    integrations: [
      // Use Sentry's built-in integrations
      Sentry.browserTracingIntegration({
        tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
      }),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, // Capture 10% of transactions for performance monitoring.
    // Replay configuration
    replaysSessionSampleRate: 0.1, // This sets the sample rate for session replays. 
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session,
    
    // Set environment
    environment: import.meta.env.MODE,
  });
  console.log("[Sentry] Initialized");
};

// Initialize PostHog
export const initPostHog = () => {
  posthog.init(config.externalServices.analytics.posthogApiKey, {
    api_host: config.externalServices.analytics.posthogHost,
    // Enable debug mode in development
    debug: !import.meta.env.PROD,
    // Disable autotrack in development
    autocapture: import.meta.env.PROD,
    // Set persistence
    persistence: 'localStorage',
    // Capture initial pageview
    capture_pageview: false,
  });
  console.log("[PostHog] Initialized");
};

// Track time-to-first-value (TTFV) for uploads
let uploadStartTime: { [key: string]: number } = {};

export const markUploadStart = (jobId: string) => {
  uploadStartTime[jobId] = Date.now();
};

export const markPreviewReady = (jobId: string) => {
  if (uploadStartTime[jobId]) {
    const duration = Date.now() - uploadStartTime[jobId];
    try {
      posthog.capture('upload_ttfv', { duration });
      Sentry.captureMessage(`Upload TTFV: ${duration}ms`);
      console.log(`[Analytics] Upload TTFV: ${duration}ms`);
    } catch (error) {
      console.error('[Analytics] Error tracking upload TTFV:', error);
    }
    delete uploadStartTime[jobId];
  }
};

// Report false positives
export const reportFalsePositive = (context: Record<string, any>) => {
  try {
    posthog.capture('false_positive', context);
    Sentry.captureMessage('False positive reported', { extra: context });
    console.log('[Analytics] False positive reported', context);
  } catch (error) {
    console.error('[Analytics] Error reporting false positive:', error);
  }
};

// Log errors to Sentry
export const logError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    contexts: {
      ...context,
    },
  });
  console.error('[Sentry] Error captured:', error, context);
};
