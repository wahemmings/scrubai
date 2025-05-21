
// Application configuration
export const config = {
  // Supabase configuration (already configured in client.ts)
  supabase: {
    url: "https://rysezrtqehpzonflkezr.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5c2V6cnRxZWhwem9uZmxrZXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTk0NTIsImV4cCI6MjA2MzQzNTQ1Mn0.iuoDyOtcRhK3CpN1Sf48WGP8Y1YPuSm0SYQ250e1xJE"
  },
  
  // Feature flags
  features: {
    enableCloudinary: false, // Disabled in prod as specified
    enableWebAssembly: true, // For client-first light scrubs
    enableEdgeProcessing: true // For more intensive tasks
  },
  
  // API endpoints
  api: {
    baseUrl: import.meta.env.PROD ? 'https://api.scrubai.com' : 'http://localhost:3001',
    routes: {
      process: '/api/process',
      progress: '/api/progress'
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
  }
};

export default config;
