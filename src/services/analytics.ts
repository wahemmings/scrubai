
import { initPostHog, initSentry } from "./instrumentation";

export const initAnalytics = () => {
  // Initialize Sentry (scheduled for Week 4)
  initSentry();
  
  // Initialize PostHog (scheduled for Week 3)
  initPostHog();
  
  console.log("[Analytics] Services initialized");
};
