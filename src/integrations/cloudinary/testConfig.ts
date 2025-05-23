
import config from "@/config";

// Test Cloudinary configuration
export const testCloudinaryConfig = async (): Promise<any> => {
  const cloudName = config.externalServices.cloudinary.cloudName;
  const apiKey = config.externalServices.cloudinary.apiKey;
  const uploadPreset = config.externalServices.cloudinary.uploadPreset;
  
  return {
    success: !!cloudName,
    config: {
      cloudName,
      apiKey: apiKey ? "✓ Configured" : "✗ Missing",
      uploadPreset,
      enabled: !!cloudName
    }
  };
};
