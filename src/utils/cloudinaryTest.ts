
// This file now re-exports from the new modular structure
// It exists for backward compatibility
import { testCloudinaryConnection, uploadTestFile } from "./cloudinary";

export { 
  testCloudinaryConnection,
  uploadTestFile
};

export default {
  testCloudinaryConnection,
  uploadTestFile
};
