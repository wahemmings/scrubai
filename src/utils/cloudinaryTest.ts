
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUploadSignature, secureUploadToCloudinary } from "./cloudinaryUpload";
import { testEdgeFunctionClient, testEdgeFunctionDirect, testCloudinaryConfig } from "./diagnostics";
import config from "@/config";

// Test the direct connection to the edge function
export const testCloudinaryEdgeFunction = async (user: any) => {
  if (!user) {
    toast.error("Authentication required", {
      description: "You need to be logged in to test Cloudinary connection"
    });
    return;
  }

  toast.info("Testing edge function connection...");
  
  try {
    // Test both methods of connecting to the edge function
    const clientTest = await testEdgeFunctionClient(user);
    
    if (clientTest.success) {
      toast.success("Edge function connection successful via Supabase client", {
        description: `Successfully connected to the edge function and received valid response with signature.`
      });
      return clientTest;
    }
    
    // If client method fails, try direct method
    const directTest = await testEdgeFunctionDirect(user);
    
    if (directTest.success) {
      toast.success("Edge function connection successful via direct API call", {
        description: `Successfully connected to the edge function directly.`
      });
      return directTest;
    }
    
    // Both methods failed
    toast.error("Edge function connection failed", {
      description: "Could not connect to the edge function using either method. Check browser console for details."
    });
    
    console.error("Edge function client test failed:", clientTest.error || clientTest.message);
    console.error("Edge function direct test failed:", directTest.error || directTest.message);
    
    return directTest;
  } catch (error) {
    toast.error("Edge function test error", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
    console.error("Edge function test error:", error);
    return {
      success: false,
      message: "Exception when testing edge function",
      error
    };
  }
};

// Test the Cloudinary connection by checking configuration
export const testCloudinaryConnection = async (user: any) => {
  toast.info("Testing Cloudinary connection...");
  
  // First, check if Cloudinary is properly configured
  const configTest = testCloudinaryConfig();
  
  if (!configTest.success) {
    toast.error("Cloudinary configuration error", {
      description: configTest.message
    });
    console.error("Cloudinary configuration error:", configTest);
    return configTest;
  }
  
  // Next, test edge function connection
  const edgeFunctionResult = await testCloudinaryEdgeFunction(user);
  
  if (!edgeFunctionResult.success) {
    // Error message already shown by testCloudinaryEdgeFunction
    return edgeFunctionResult;
  }
  
  toast.success("Cloudinary connection successful", {
    description: "Your application is properly configured to use Cloudinary"
  });
  
  return edgeFunctionResult;
};

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
