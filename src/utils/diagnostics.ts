
// This file is kept for backward compatibility
// New implementations should use the files in src/integrations/cloudinary/diagnostics.ts
import { 
  testEdgeFunctionClient,
  testEdgeFunctionDirect, 
  testCloudinaryConfig 
} from '@/integrations/cloudinary/diagnostics';
import config from '@/config';

export { testEdgeFunctionClient, testEdgeFunctionDirect, testCloudinaryConfig };

// Export the full Cloudinary configuration function
export const getCloudinaryConfiguration = () => {
  return {
    cloudName: config.externalServices.cloudinary.cloudName,
    apiKey: config.externalServices.cloudinary.apiKey,
    uploadPreset: config.externalServices.cloudinary.uploadPreset,
    enabled: !!config.externalServices.cloudinary.cloudName
  };
};
