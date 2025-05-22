
import { toast } from "sonner";
import config from "@/config";
import { supabase } from "@/integrations/supabase/client";
import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';

// Time-to-first-value tracking
interface TTFVData {
  uploadStartTime: number;
  previewReadyTime: number;
  durationMs: number;
}

// Store timing data temporarily
const ttfvMap = new Map<string, Partial<TTFVData>>();

// Initialize Sentry
export const initSentry = () => {
  if (!import.meta.env.PROD) {
    console.log("[Instrumentation] Sentry would be initialized in production");
    return;
  }

  try {
    Sentry.init({
      dsn: config.externalServices.analytics.sentryDsn,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay()
      ],
      // Performance monitoring
      tracesSampleRate: 0.1,
      // Session replay for errors
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE
    });
    console.log("[Instrumentation] Sentry initialized");
  } catch (error) {
    console.error("[Instrumentation] Failed to initialize Sentry:", error);
  }
};

// Initialize PostHog
export const initPostHog = () => {
  if (!import.meta.env.PROD) {
    console.log("[Instrumentation] PostHog would be initialized in production");
    return;
  }
  
  try {
    posthog.init(config.externalServices.analytics.posthogApiKey, {
      api_host: config.externalServices.analytics.posthogHost,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true
    });
    console.log("[Instrumentation] PostHog initialized");
  } catch (error) {
    console.error("[Instrumentation] Failed to initialize PostHog:", error);
  }
};

// Time-to-first-value tracking
export const markUploadStart = (jobId: string): void => {
  const startTime = performance.now();
  ttfvMap.set(jobId, { uploadStartTime: startTime });
  console.log(`[Instrumentation] Job ${jobId} upload started at ${startTime}ms`);
};

export const markPreviewReady = (jobId: string): void => {
  const previewReadyTime = performance.now();
  const data = ttfvMap.get(jobId) || {};
  
  data.previewReadyTime = previewReadyTime;
  
  if (data.uploadStartTime) {
    data.durationMs = previewReadyTime - data.uploadStartTime;
    ttfvMap.set(jobId, data as Partial<TTFVData>);
    
    console.log(`[Instrumentation] Job ${jobId} preview ready at ${previewReadyTime}ms. Total time: ${data.durationMs}ms`);
    
    // Track in analytics system if available
    if (config.features.enableAnalytics && import.meta.env.PROD) {
      posthog.capture('ttfv', { 
        ms: data.durationMs, 
        jobId 
      });
    }
    
    // Clean up after sending
    setTimeout(() => {
      ttfvMap.delete(jobId);
    }, 1000);
  }
};

// Complaints tracking
export const reportFalsePositive = async (jobId: string): Promise<void> => {
  try {
    // Update to use the false_positive column
    const { error } = await supabase
      .from('jobs')
      .update({ false_positive: true })
      .eq('id', jobId);
    
    if (error) throw error;
    
    // Track the false positive report in analytics
    if (config.features.enableAnalytics && import.meta.env.PROD) {
      posthog.capture('false_positive_report', { jobId });
    }
    
    toast.success("Issue reported successfully");
    console.log(`[Instrumentation] Reported false positive for job ${jobId}`);
  } catch (error) {
    console.error("[Instrumentation] Error reporting false positive:", error);
    toast.error("Failed to report issue");
  }
};

// Error tracking
export const logError = (error: Error, context?: Record<string, any>): void => {
  console.error("[Instrumentation] Error:", error, context);
  
  // Send to Sentry if available
  if (config.features.enableAnalytics && import.meta.env.PROD) {
    Sentry.captureException(error, {
      extra: context
    });
  }
};

// Track subscription conversions
export const trackSubscription = (plan: string, userId?: string): void => {
  if (config.features.enableAnalytics && import.meta.env.PROD) {
    posthog.capture('subscription_converted', {
      plan,
      userId
    });
  }
  
  console.log(`[Instrumentation] Subscription tracked: ${plan}`);
};

// Track feature usage
export const trackFeatureUsage = (feature: string, metadata?: Record<string, any>): void => {
  if (config.features.enableAnalytics && import.meta.env.PROD) {
    posthog.capture('feature_used', {
      feature,
      ...metadata
    });
  }
};
