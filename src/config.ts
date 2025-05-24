// Application configuration
const config = {
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://rysezrtqehpzonflkezr.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5c2V6cnRxZWhwem9uZmxrZXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTk0NTIsImV4cCI6MjA2MzQzNTQ1Mn0.iuoDyOtcRhK3CpN1Sf48WGP8Y1YPuSm0SYQ250e1xJE',
    functionsUrl: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 'https://rysezrtqehpzonflkezr.supabase.co/functions/v1'
  },
  
  // API configuration
  api: {
    baseUrl: '/api',
    routes: {
      progress: '/progress',
      upload: '/upload',
      documents: '/documents'
    }
  },
  
  // External services
  externalServices: {
    cloudinary: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
      apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
      uploadPreset: 'scrubai_secure'
    },
    // Add analytics section inside externalServices
    analytics: {
      sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
      posthogApiKey: import.meta.env.VITE_POSTHOG_API_KEY || '',
      posthogHost: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'
    }
  },
  
  // Feature flags
  features: {
    enableCloudinary: import.meta.env.VITE_ENABLE_CLOUDINARY === 'true',
    enableWasmProcessing: import.meta.env.VITE_ENABLE_WASM_PROCESSING === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
  },
  
  // Processing configuration
  processing: {
    maxFileSizeMB: 10,
    supportedFormats: {
      document: ['.pdf', '.docx', '.doc', '.txt'],
      image: ['.jpg', '.jpeg', '.png', '.webp']
    }
  },
  
  // Analytics configuration - maintaining this for backward compatibility
  analytics: {
    posthog: {
      apiKey: import.meta.env.VITE_POSTHOG_API_KEY || '',
      host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'
    },
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN || ''
    }
  }
};

export default config;
