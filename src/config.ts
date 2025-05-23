import config from "@/config";

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: config.externalServices.cloudinary.cloudName || "",
  apiKey: config.externalServices.cloudinary.apiKey || "",
  enabled: !!config.externalServices.cloudinary.cloudName,
  uploadPreset: config.externalServices.cloudinary.uploadPreset || "scrubai_secure", // Use from config
  folder: "scrubai_docs",
};

// Helper functions
export const isCloudinaryEnabled = (): boolean => {
  // Add console logging to help debug
  console.log("Checking if Cloudinary is enabled:", {
    cloudName: cloudinaryConfig.cloudName,
    apiKeyPresent: !!cloudinaryConfig.apiKey,
    enabled: cloudinaryConfig.enabled,
    uploadPreset: cloudinaryConfig.uploadPreset,
    envCloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "not_set",
    envApiKey: import.meta.env.VITE_CLOUDINARY_API_KEY ? "present" : "not_set"
  });
  return !!cloudinaryConfig.cloudName;
};

export const getCloudinaryUrl = (publicId: string, options = {}): string => {
  if (!cloudinaryConfig.cloudName || !publicId) return "";
  
  // Base URL for Cloudinary resources
  const cloudinaryUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${publicId}`;
  console.log("Generated Cloudinary URL:", cloudinaryUrl);
  return cloudinaryUrl;
};

export const getCloudinaryThumbnailUrl = (publicId: string, width = 200): string => {
  if (!cloudinaryConfig.cloudName || !publicId) return "";
  
  // Generate thumbnail URL with specified width
  const thumbnailUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/c_thumb,w_${width}/${publicId}`;
  console.log("Generated Cloudinary thumbnail URL:", thumbnailUrl);
  return thumbnailUrl;
};

// Add function to test cloud name and upload preset configuration
export const getCloudinaryConfig = (): { cloudName: string, apiKey: string, uploadPreset: string, enabled: boolean } => {
  return {
    cloudName: cloudinaryConfig.cloudName,
    apiKey: cloudinaryConfig.apiKey,
    uploadPreset: cloudinaryConfig.uploadPreset,
    enabled: cloudinaryConfig.enabled
  };
};
