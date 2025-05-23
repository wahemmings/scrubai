
// Export connection testing functions
export * from "./connection";
export * from "./upload";

// For backward compatibility
import { testCloudinaryConnection } from "./connection";
import { uploadTestFile } from "./upload";

// Re-export using the old names for backward compatibility
export default {
  testCloudinaryConnection,
  uploadTestFile
};
