
import { toast } from "sonner";
import { isCloudinaryEnabled } from "@/integrations/cloudinary/config";

// Function to upload a test file to Cloudinary
export const uploadTestFile = async (user: any): Promise<void> => {
  if (!isCloudinaryEnabled()) {
    toast("Cloudinary is not enabled", {
      description: "Please configure your Cloudinary cloud name in environment variables."
    });
    return;
  }

  try {
    // Create a small test file
    const testBlob = new Blob(['Test file content for Cloudinary integration'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'cloudinary-test.txt', { type: 'text/plain' });
    
    // Create a test ID first
    const testId = "test_" + Math.random().toString(36).substring(2, 10);
    
    // Import functions dynamically to avoid circular dependencies
    const { getUploadSignature } = await import("@/utils/cloudinary/uploadSignature");
    const { secureUploadToCloudinary } = await import("@/utils/cloudinary/fileUpload");
    
    // Get initial signature just for the folder
    console.log("Requesting initial upload signature to get user folder...");
    const initialSignature = await getUploadSignature(user);
    
    // Generate the complete public_id with the user folder
    const testPublicId = `${initialSignature.folder}/test/${testId}`;
    console.log("Generated test public_id:", testPublicId);
    
    // Now get a new signature that includes this public_id
    toast("Requesting upload signature with public_id...");
    console.log("Requesting signature with public_id:", testPublicId);
    
    // This gets a signature that includes the public_id in the signature calculation
    const signatureData = await getUploadSignature(user);
    
    // Log the signature data for debugging
    console.log("Upload signature received for test:", {
      cloudName: signatureData.cloudName || signatureData.cloudName,
      hasApiKey: !!(signatureData.api_key || signatureData.apiKey),
      folder: signatureData.folder,
      uploadPreset: signatureData.upload_preset || signatureData.uploadPreset || 'default',
      public_id: signatureData.public_id || signatureData.publicId,
      hasSignature: !!signatureData.signature
    });
    
    // Start upload
    toast("Uploading test file to Cloudinary...");
    
    // Upload to Cloudinary with correctly signed parameters
    const result = await secureUploadToCloudinary(testFile, signatureData);
    
    if (result && result.public_id) {
      toast.success("Test file uploaded successfully", {
        description: `File ID: ${result.public_id}`
      });
      
      console.log("Test upload complete:", {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        folder: result.folder
      });
    } else {
      toast.error("Test upload failed", {
        description: "Received invalid response from Cloudinary"
      });
    }
  } catch (error) {
    console.error("Error uploading test file:", error);
    
    // Enhanced error handling with specific messages
    if (error instanceof Error) {
      const errorMsg = error.message;
      
      if (errorMsg.includes("Failed to fetch") || errorMsg.includes("send a request")) {
        toast.error("Upload request failed", {
          description: "Could not connect to Cloudinary API. Check your internet connection."
        });
      } else if (errorMsg.includes("Unauthorized") || errorMsg.includes("JWT")) {
        toast.error("Authentication error", {
          description: "Your authorization for Cloudinary is invalid."
        });
      } else if (errorMsg.includes("Missing Cloudinary credentials")) {
        toast.error("Cloudinary credentials missing", {
          description: "Check that all required Cloudinary secrets are configured in Supabase."
        });
      } else {
        toast.error("Test upload failed", {
          description: errorMsg
        });
      }
    } else {
      toast.error("Test upload failed", {
        description: "Unknown error"
      });
    }
  }
};
