
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
    console.log("Using placeholder image for mock data");
    return "https://via.placeholder.com/800x600?text=Test+Image";
  }
  
  // Base URL for Cloudinary resources
  const cloudinaryUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${publicId}`;
  console.log("Generated Cloudinary URL:", cloudinaryUrl);
  return cloudinaryUrl;
};

export const getCloudinaryThumbnailUrl = (publicId: string, width = 200): string => {
  if (!cloudinaryConfig.cloudName || !publicId) return "";
  
  // For mock data, return placeholder image
  if (publicId.startsWith("mock_") || cloudinaryConfig.cloudName === "demo") {
    console.log("Using placeholder thumbnail for mock data");
    return `https://via.placeholder.com/${width}x${width}?text=Thumbnail`;
  }
  
  // Generate thumbnail URL with specified width
  const thumbnailUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/c_thumb,w_${width}/${publicId}`;
  console.log("Generated Cloudinary thumbnail URL:", thumbnailUrl);
  return thumbnailUrl;
};
