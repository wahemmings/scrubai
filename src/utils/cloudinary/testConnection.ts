
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { testEdgeFunctionClient, testEdgeFunctionDirect, testCloudinaryConfig } from "../diagnostics";

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
