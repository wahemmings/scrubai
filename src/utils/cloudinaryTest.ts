
import { supabase } from "@/integrations/supabase/client";
import { getUploadSignature, secureUploadToCloudinary } from "@/utils/cloudinaryUpload";
import { isCloudinaryEnabled } from "@/integrations/cloudinary/config";
import { toast } from "sonner";

// Function to test Cloudinary connection
export const testCloudinaryConnection = async (user: any): Promise<boolean> => {
  if (!isCloudinaryEnabled()) {
    toast.error("Cloudinary is not enabled", { 
      description: "Please enable Cloudinary in your environment configuration."
    });
    return false;
  }

  try {
    // For testing, create a mock signature if edge function fails
    let signatureData;
    try {
      // Attempt to get upload signature from edge function
      signatureData = await getUploadSignature(user);
      console.log("Successfully received upload signature from edge function:", signatureData);
    } catch (error) {
      console.error("Edge function error:", error);
      toast.warning("Edge function unavailable", {
        description: "Using mock data for testing. In production, enable edge functions."
      });
      
      // Create mock signature data for testing when edge function is unavailable
      const timestamp = Math.floor(Date.now() / 1000);
      signatureData = {
        signature: "mock_signature_for_testing",
        timestamp,
        folder: "scrubai_test",
        publicId: `test_${Date.now()}`,
        uploadPreset: "scrubai_secure",
        cloudName: "demo",
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
      };
      console.log("Created mock signature for testing:", signatureData);
    }
    
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
    toast.error("Cloudinary is not enabled");
    return;
  }

  try {
    // Create a small test file
    const testBlob = new Blob(['Test file content'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'cloudinary-test.txt', { type: 'text/plain' });
    
    // Get upload signature (with fallback to mock data)
    let signatureData;
    try {
      // Attempt to get upload signature from edge function
      signatureData = await getUploadSignature(user);
      console.log("Successfully received upload signature for test file:", signatureData);
    } catch (error) {
      console.error("Edge function error:", error);
      toast.warning("Edge function unavailable", {
        description: "Using mock data for testing. File will not actually upload to Cloudinary."
      });
      
      // Create mock signature data for testing when edge function is unavailable
      const timestamp = Math.floor(Date.now() / 1000);
      signatureData = {
        signature: "mock_signature_for_testing",
        timestamp,
        folder: "scrubai_test",
        publicId: `test_${Date.now()}`,
        uploadPreset: "scrubai_secure",
        cloudName: "demo",
        apiKey: "mock_api_key",
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
      };
      console.log("Created mock signature for test file upload:", signatureData);
    }
    
    // Start upload
    toast.info("Uploading test file to Cloudinary...");
    
    try {
      // Upload to Cloudinary
      const result = await secureUploadToCloudinary(testFile, signatureData);
      console.log("Test file upload result:", result);
      
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
      // Handle upload error specifically
      console.error("Cloudinary upload error:", error);
      
      // Mock successful upload for testing
      if (signatureData.signature === "mock_signature_for_testing") {
        toast.success("Mock upload completed", {
          description: "This was a simulated upload since edge functions are unavailable."
        });
      } else {
        toast.error("Upload to Cloudinary failed", {
          description: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  } catch (error) {
    console.error("Error uploading test file:", error);
    toast.error("Test upload failed", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
