
import config from "@/config";

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: config.externalServices.cloudinary.cloudName || "",
  enabled: !!config.externalServices.cloudinary.cloudName,
  uploadPreset: "scrubai_secure",
  folder: "scrubai_docs",
};

// Helper functions
export const isCloudinaryEnabled = (): boolean => {
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
