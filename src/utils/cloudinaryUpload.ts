
// This file is kept for backward compatibility
// New implementations should use the files in src/utils/cloudinary/index.ts

import { getUploadSignature } from './cloudinary/uploadSignature';
import { secureUploadToCloudinary } from './cloudinary/fileUpload';
import { uploadToServer } from './cloudinary/serverUpload';

// Export utilities for backward compatibility
export { 
  getUploadSignature,
  secureUploadToCloudinary,
  uploadToServer
};
