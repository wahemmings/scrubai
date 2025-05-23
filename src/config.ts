
// Application configuration
const config = {
  // Supabase configuration 
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://rysezrtqehpzonflkezr.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5c2V6cnRxZWhwem9uZmxrZXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTk0NTIsImV4cCI6MjA2MzQzNTQ1Mn0.iuoDyOtcRhK3CpN1Sf48WGP8Y1YPuSm0SYQ250e1xJE",
    functionsUrl: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || "https://rysezrtqehpzonflkezr.supabase.co/functions/v1"
  },
  
  // Feature flags
  features: {
    // Force enable Cloudinary for debugging
    enableCloudinary: true, // Force to true to debug
    enableWasmProcessing: import.meta.env.VITE_ENABLE_WASM_PROCESSING === 'true' || true,
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || false,
    enableEdgeProcessing: true // For more intensive tasks
  },
  
  // External services configuration
  externalServices: {
    cloudinary: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "da7q81lrh", 
      uploadPreset: "scrubai_secure", 
    },
    analytics: {
      posthogApiKey: import.meta.env.VITE_POSTHOG_API_KEY || "",
      posthogHost: import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com",
      sentryDsn: import.meta.env.VITE_SENTRY_DSN || ""
    }
  },
  
  // API endpoints
  api: {
    baseUrl: import.meta.env.PROD ? 'https://api.scrubai.com' : 'http://localhost:3001',
    routes: {
      process: '/api/process',
      progress: '/api/progress',
      auth: '/api/auth'
    }
  },
  
  // Processing options
  processing: {
    maxFileSizeMB: 10,
    supportedFormats: {
      text: ['.txt', '.md'],
      document: ['.docx', '.pdf'],
      image: ['.png', '.jpg', '.jpeg', '.webp']
    }
  },
  
  // Pricing and subscription
  pricing: {
    free: {
      credits: 5,
      description: 'Free trial with limited credits'
    },
    basic: {
      monthly: 9.99,
      credits: 50,
      description: 'Basic plan for occasional use'
    },
    pro: {
      monthly: 29.99,
      credits: 200,
      description: 'Professional plan for regular use'
    },
    enterprise: {
      monthly: 99.99,
      credits: 1000,
      description: 'Enterprise plan for intensive use'
    }
  }
};

// Environment variables wrapper for type-safe access
export const env = {
  // Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "https://rysezrtqehpzonflkezr.supabase.co",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5c2V6cnRxZWhwem9uZmxrZXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTk0NTIsImV4cCI6MjA2MzQzNTQ1Mn0.iuoDyOtcRhK3CpN1Sf48WGP8Y1YPuSm0SYQ250e1xJE",
  SUPABASE_FUNCTIONS_URL: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || "https://rysezrtqehpzonflkezr.supabase.co/functions/v1",
  
  // Cloudinary - client-side safe values only
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "da7q81lrh",
  CLOUDINARY_UPLOAD_PRESET: "scrubai_secure", 
  
  // Analytics - client-side safe values only
  POSTHOG_API_KEY: import.meta.env.VITE_POSTHOG_API_KEY || "",
  POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST || "",
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || "",
  
  // Feature flags - force enable Cloudinary for debugging
  ENABLE_CLOUDINARY: true, 
  ENABLE_WASM_PROCESSING: import.meta.env.VITE_ENABLE_WASM_PROCESSING === 'true' || true,
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || false,
};

// Log config on initialization for debugging
console.log("App config initialized:", {
  cloudinaryEnabled: config.features.enableCloudinary,
  cloudName: config.externalServices.cloudinary.cloudName,
  uploadPreset: config.externalServices.cloudinary.uploadPreset,
  supabaseUrl: config.supabase.url.substring(0, 15) + '...',
  supabaseFunctionsUrl: config.supabase.functionsUrl,
});

export default config;
