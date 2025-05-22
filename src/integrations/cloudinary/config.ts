
import config from "@/config";

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: config.externalServices.cloudinary.cloudName || "demo",
  enabled: true, // Always enabled for testing
  uploadPreset: "scrubai_secure",
  folder: "scrubai_docs",
};

// Helper functions
export const isCloudinaryEnabled = (): boolean => {
  return true; // Always return true to ensure feature is available for testing
};

export const getCloudinaryUrl = (publicId: string, options = {}): string => {
  if (!cloudinaryConfig.cloudName || !publicId) return "";
  
  // For mock data, return placeholder image
  if (publicId.startsWith("mock_") || cloudinaryConfig.cloudName === "demo") {
    return "https://via.placeholder.com/800x600?text=Test+Image";
  }
  
  // Base URL for Cloudinary resources
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${publicId}`;
};

export const getCloudinaryThumbnailUrl = (publicId: string, width = 200): string => {
  if (!cloudinaryConfig.cloudName || !publicId) return "";
  
  // For mock data, return placeholder image
  if (publicId.startsWith("mock_") || cloudinaryConfig.cloudName === "demo") {
    return `https://via.placeholder.com/${width}x${width}?text=Thumbnail`;
  }
  
  // Generate thumbnail URL with specified width
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/c_thumb,w_${width}/${publicId}`;
};
