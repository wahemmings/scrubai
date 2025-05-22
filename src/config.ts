// Application configuration
export const config = {
  // Supabase configuration 
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ""
  },
  
  // Feature flags
  features: {
    enableCloudinary: import.meta.env.VITE_ENABLE_CLOUDINARY === 'true' || false,
    enableWebAssembly: true, // For client-first light scrubs
    enableEdgeProcessing: true // For more intensive tasks
  },
  
  // External services configuration
  externalServices: {
    cloudinary: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
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

// Environment variables wrapper for type-safe access
export const env = {
  // Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  
  // Cloudinary - these are only used on the server side
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
  
  // Other services
  // These are only referenced here to document what's needed,
  // but they should only be accessed in edge functions
  // OPENAI_API_KEY: (server-side only)
  // CLOUDINARY_API_KEY: (server-side only) 
  // CLOUDINARY_API_SECRET: (server-side only)
  // STRIPE_SECRET_KEY: (server-side only)
  // STRIPE_WEBHOOK_SECRET: (server-side only)
};

export default config;
