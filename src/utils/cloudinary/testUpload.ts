
import { toast } from "sonner";
import { getUploadSignature, secureUploadToCloudinary } from "./uploadService";

// Upload a test file to Cloudinary
export const uploadTestFile = async (user: any) => {
  if (!user) {
    toast.error("Authentication required", {
      description: "You need to be logged in to upload test files"
    });
    return;
  }

  toast.info("Uploading test file to Cloudinary...");
  
  try {
    // Get upload signature
    const signatureData = await getUploadSignature(user);
    
    if (!signatureData) {
      toast.error("Failed to get upload signature");
      return;
    }
    
    // Create a small test file
    const blob = new Blob(['test file content from ScrubAI'], { type: 'text/plain' });
    const testFile = new File([blob], 'scrubai-test.txt', { type: 'text/plain' });
    
    // Upload to Cloudinary
    const result = await secureUploadToCloudinary(testFile, signatureData);
    
    toast.success("Test file uploaded successfully", {
      description: `File uploaded with public ID: ${result.public_id}`
    });
    
    return result;
  } catch (error) {
    toast.error("Test file upload failed", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
    console.error("Test upload error:", error);
  }
};
