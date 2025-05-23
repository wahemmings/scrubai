
// Application configuration
const config = {
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    functionsUrl: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || ''
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
