
// Application configuration
export const config = {
  // Supabase configuration (already configured in client.ts)
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
      cloudName: "da7q81lrh", // Cloudinary cloud name
      apiKey: "975886951787346", // Cloudinary API key
      apiSecret: "XTBAs9PqAWdZ32ibhSN5h9FYMuY", // Cloudinary API secret
    },
    openai: {
      apiKey: "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", // OpenAI API key
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

export default config;
