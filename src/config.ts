// Application configuration
export const config = {
  // Supabase configuration 
  supabase: {
    url: "https://rysezrtqehpzonflkezr.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5c2V6cnRxZWhwem9uZmxrZXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTk0NTIsImV4cCI6MjA2MzQzNTQ1Mn0.iuoDyOtcRhK3CpN1Sf48WGP8Y1YPuSm0SYQ250e1xJE"
  },
  
  // Feature flags
  features: {
    enableCloudinary: true, // Changed to true since Cloudinary keys are now configured
    enableWebAssembly: true, // For client-first light scrubs
    enableEdgeProcessing: true // For more intensive tasks
  },
  
  // External services configuration
  externalServices: {
    cloudinary: {
      // No hardcoded values - these will be managed by environment variables
      // and the secure upload signature flow
    },
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

// Environment variables wrapper type-safe access
export const env = {
  // Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Cloudinary - these are only used on the server side
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  
  // Other services
  // OpenAI - this is only used server-side
};

export default config;
