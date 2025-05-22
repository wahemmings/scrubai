
import { supabase } from "@/integrations/supabase/client";
import { getUploadSignature, secureUploadToCloudinary } from "@/utils/cloudinaryUpload";
import { isCloudinaryEnabled } from "@/integrations/cloudinary/config";
import { toast } from "sonner";

// Function to test Cloudinary connection
export const testCloudinaryConnection = async (user: any): Promise<boolean> => {
  if (!isCloudinaryEnabled()) {
    toast("Cloudinary is not enabled", { 
      description: "Please configure your Cloudinary cloud name in environment variables."
    });
    console.log("Cloudinary not enabled - check your VITE_CLOUDINARY_CLOUD_NAME setting");
    return false;
  }

  try {
    console.log("Testing Cloudinary connection with user:", user?.id);
    
    if (!user) {
      toast("Authentication required", {
        description: "You must be logged in to test Cloudinary connection."
      });
      return false;
    }
    
    // Get current auth session to verify token
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Auth session available:", !!session);
    
    if (!session) {
      toast("No active session found", {
        description: "Please log out and log in again to refresh your session."
      });
      return false;
    }
    
    // Attempt to get upload signature from edge function
    console.log("Requesting upload signature from edge function...");
    const signatureData = await getUploadSignature(user);
    
    if (!signatureData || !signatureData.signature) {
      toast("Invalid Cloudinary signature data");
      console.error("Invalid signature data received:", signatureData);
      return false;
    }
    
    console.log("Cloudinary signature successfully obtained:", signatureData);
    toast("Cloudinary connection successful", {
      description: "Your Cloudinary integration is working correctly."
    });
    return true;
  } catch (error) {
    console.error("Error testing Cloudinary connection:", error);
    
    // Enhanced error handling with specific messages
    if (error instanceof Error) {
      const errorMsg = error.message;
      
      if (errorMsg.includes("Failed to send a request to the Edge Function")) {
        toast("Edge Function connection failed", {
          description: "Make sure your Supabase Edge Function is deployed correctly and your session is valid."
        });
      } else if (errorMsg.includes("Unauthorized") || errorMsg.includes("JWT")) {
        toast("Authentication error", {
          description: "Your session may have expired. Please log out and log in again."
        });
      } else {
        toast("Cloudinary connection failed", {
          description: errorMsg
        });
      }
    } else {
      toast("Cloudinary connection failed", {
        description: "Unknown error"
      });
    }
    return false;
  }
};

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
    const testBlob = new Blob(['Test file content'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'cloudinary-test.txt', { type: 'text/plain' });
    
    // Get upload signature
    toast("Requesting upload signature...");
    const signatureData = await getUploadSignature(user);
    
    // Start upload
    toast("Uploading test file to Cloudinary...");
    
    // Upload to Cloudinary
    const result = await secureUploadToCloudinary(testFile, signatureData);
    
    if (result && result.public_id) {
      toast("Test file uploaded successfully", {
        description: `Public ID: ${result.public_id}`
      });
    } else {
      toast("Test upload failed", {
        description: "Received invalid response from Cloudinary"
      });
    }
  } catch (error) {
    console.error("Error uploading test file:", error);
    
    // Enhanced error handling with specific messages
    if (error instanceof Error) {
      const errorMsg = error.message;
      
      if (errorMsg.includes("Failed to send a request to the Edge Function")) {
        toast("Edge Function connection failed", {
          description: "Make sure your Supabase Edge Function is deployed correctly and secrets are configured."
        });
      } else if (errorMsg.includes("Unauthorized") || errorMsg.includes("JWT")) {
        toast("Authentication error", {
          description: "Your session may have expired. Please log out and log in again."
        });
      } else {
        toast("Test upload failed", {
          description: errorMsg
        });
      }
    } else {
      toast("Test upload failed", {
        description: "Unknown error"
      });
    }
  }
};
