
import { toast } from "sonner";
import config from "@/config";
import { supabase } from "@/integrations/supabase/client";

// Time-to-first-value tracking
interface TTFVData {
  uploadStartTime: number;
  previewReadyTime: number;
  durationMs: number;
}

// Define PostHog type as it's not installed yet
interface PostHogClient {
  capture: (event: string, properties?: Record<string, any>) => void;
}

// This would be initialized when PostHog SDK is installed
let postHogClient: PostHogClient | null = null;

// Initialize Sentry (to be implemented in Week 4)
export const initSentry = () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[Instrumentation] Sentry would be initialized in production");
    return;
  }
  
  // Would be implemented in Week 4
  console.log("[Instrumentation] Sentry initialized");
};

// Initialize PostHog (to be implemented in Week 3)
export const initPostHog = () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[Instrumentation] PostHog would be initialized in production");
    return;
  }
  
  // Would be implemented in Week 3
  console.log("[Instrumentation] PostHog initialized");
};

// Time-to-first-value tracking
const ttfvMap = new Map<string, Partial<TTFVData>>();

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
    
    // Send to PostHog if available
    if (postHogClient) {
      postHogClient.capture('ttfv', { 
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
    const { error } = await supabase
      .from('jobs')
      .update({ false_positive: true })
      .eq('id', jobId);
    
    if (error) throw error;
    
    toast.success("Issue reported successfully");
    console.log(`[Instrumentation] Reported false positive for job ${jobId}`);
  } catch (error) {
    console.error("[Instrumentation] Error reporting false positive:", error);
    toast.error("Failed to report issue");
  }
};

// Crash tracking (placeholder for Sentry integration)
export const logError = (error: Error, context?: Record<string, any>): void => {
  console.error("[Instrumentation] Error:", error, context);
  
  // Would send to Sentry in Week 4 implementation
};

// Conversion tracking will be handled by Stripe webhooks in Week 4
