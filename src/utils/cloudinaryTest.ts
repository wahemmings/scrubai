
import { supabase } from "@/integrations/supabase/client";
import { getUploadSignature, secureUploadToCloudinary } from "@/utils/cloudinaryUpload";
import { isCloudinaryEnabled } from "@/integrations/cloudinary/config";
import { toast } from "sonner";

// Function to test Cloudinary connection
export const testCloudinaryConnection = async (user: any): Promise<boolean> => {
  if (!isCloudinaryEnabled()) {
    toast.error("Cloudinary is not enabled", { 
      description: "Please configure your Cloudinary cloud name in environment variables."
    });
    return false;
  }

  try {
    // Attempt to get upload signature from edge function
    const signatureData = await getUploadSignature(user);
    
    if (!signatureData || !signatureData.signature) {
      toast.error("Invalid Cloudinary signature data");
      return false;
    }
    
    toast.success("Cloudinary connection successful", {
      description: "Your Cloudinary integration is working correctly."
    });
    return true;
  } catch (error) {
    console.error("Error testing Cloudinary connection:", error);
    toast.error("Cloudinary connection failed", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
    return false;
  }
};

// Function to upload a test file to Cloudinary
export const uploadTestFile = async (user: any): Promise<void> => {
  if (!isCloudinaryEnabled()) {
    toast.error("Cloudinary is not enabled", {
      description: "Please configure your Cloudinary cloud name in environment variables."
    });
    return;
  }

  try {
    // Create a small test file
    const testBlob = new Blob(['Test file content'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'cloudinary-test.txt', { type: 'text/plain' });
    
    // Get upload signature
    const signatureData = await getUploadSignature(user);
    
    // Start upload
    toast.info("Uploading test file to Cloudinary...");
    
    // Upload to Cloudinary
    const result = await secureUploadToCloudinary(testFile, signatureData);
    
    if (result && result.public_id) {
      toast.success("Test file uploaded successfully", {
        description: `Public ID: ${result.public_id}`
      });
    } else {
      toast.error("Test upload failed", {
        description: "Received invalid response from Cloudinary"
      });
    }
  } catch (error) {
    console.error("Error uploading test file:", error);
    toast.error("Test upload failed", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
