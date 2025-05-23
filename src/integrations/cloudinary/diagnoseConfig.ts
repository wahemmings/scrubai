
import config from "@/config";

// Test the Cloudinary configuration
export const diagnoseCloudinayConfiguration = async (): Promise<any> => {
  try {
    const cloudName = config.externalServices.cloudinary.cloudName;
    const apiKey = config.externalServices.cloudinary.apiKey;
    const uploadPreset = config.externalServices.cloudinary.uploadPreset;
    
    const result = {
      success: true,
      configuration: {
        cloudName,
        apiKey: apiKey ? "✓ Configured" : "✗ Missing",
        uploadPreset,
        envVars: {
          VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "Not set",
          VITE_CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY ? "✓ Set" : "✗ Not set",
          VITE_ENABLE_CLOUDINARY: import.meta.env.VITE_ENABLE_CLOUDINARY
        }
      }
    };
    
    return result;
  } catch (error) {
    console.error("Diagnostics error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
