
import { supabase } from "@/integrations/supabase/client";
import { getUploadSignature, secureUploadToCloudinary } from "@/utils/cloudinaryUpload";
import { isCloudinaryEnabled, getCloudinaryConfig } from "@/integrations/cloudinary/config";
import { toast } from "sonner";

// Function to test Cloudinary connection
export const testCloudinaryConnection = async (user: any): Promise<boolean> => {
  // Force enabled for testing
  console.log("Starting Cloudinary connection test...");
  const config = getCloudinaryConfig();
  console.log("Environment check:", {
    cloudinaryEnabled: config.enabled,
    cloudName: config.cloudName,
    uploadPreset: config.uploadPreset,
    userAuthenticated: !!user
  });
  
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
    toast("Contacting edge function...", { 
      description: "Requesting upload signature from Supabase Edge Function" 
    });
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      console.log("Auth check before edge function call:", {
        hasAuthUser: !!authUser,
        userId: authUser?.id
      });
    } catch (authError) {
      console.error("Auth check failed:", authError);
    }
    
    // Test with detailed error handling
    const signatureData = await getUploadSignature(user);
    
    if (!signatureData || !signatureData.signature) {
      toast.error("Invalid Cloudinary signature data");
      console.error("Invalid signature data received:", signatureData);
      return false;
    }
    
    console.log("Cloudinary signature successfully obtained:", {
      cloudName: signatureData.cloudName,
      timestamp: signatureData.timestamp,
      hasSignature: !!signatureData.signature,
      folder: signatureData.folder,
      uploadPreset: signatureData.uploadPreset || 'default'
    });
    
    toast.success("Cloudinary connection successful", {
      description: `Connected to cloud: ${signatureData.cloudName}, preset: ${signatureData.uploadPreset || 'scrubai_secure'}`
    });
    return true;
  } catch (error) {
    console.error("Error testing Cloudinary connection:", error);
    
    // Enhanced error handling with specific messages
    if (error instanceof Error) {
      const errorMsg = error.message;
      console.log("Error message details:", errorMsg);
      
      if (errorMsg.includes("Failed to fetch") || errorMsg.includes("send a request")) {
        toast.error("Edge Function connection failed", {
          description: "Unable to reach the Supabase Edge Function. Check edge function logs."
        });
      } else if (errorMsg.includes("Unauthorized") || errorMsg.includes("JWT")) {
        toast.error("Authentication error", {
          description: "Your session may have expired. Please log out and log in again."
        });
      } else if (errorMsg.includes("Missing Cloudinary credentials")) {
        toast.error("Cloudinary credentials missing", {
          description: "Make sure all required Cloudinary secrets are configured in Supabase."
        });
      } else {
        toast.error("Cloudinary connection failed", {
          description: errorMsg
        });
      }
    } else {
      toast.error("Cloudinary connection failed", {
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
    const testBlob = new Blob(['Test file content for Cloudinary integration'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'cloudinary-test.txt', { type: 'text/plain' });
    
    // Get upload signature
    toast("Requesting upload signature...");
    const signatureData = await getUploadSignature(user);
    
    // Log the signature data for debugging
    console.log("Upload signature received for test:", {
      cloudName: signatureData.cloudName,
      hasApiKey: !!signatureData.apiKey,
      folder: signatureData.folder,
      uploadPreset: signatureData.uploadPreset || 'default'
    });
    
    // Start upload
    toast("Uploading test file to Cloudinary...");
    
    // Upload to Cloudinary
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
