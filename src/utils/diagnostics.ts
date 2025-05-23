import { supabase } from "@/integrations/supabase/client";
import config from "@/config";

// Test the edge function client connection
export const testEdgeFunctionClient = async (user: any) => {
  try {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return {
        success: false,
        message: "No valid session token found",
        error: "Authentication required"
      };
    }
    
    // Call the edge function using the Supabase client
    const { data, error } = await supabase.functions.invoke('generate-upload-signature', {
      method: 'POST',
      body: { user_id: user.id, _dummy_query: "test" }
    });
    
    if (error) {
      return {
        success: false,
        message: "Edge function client connection failed",
        error
      };
    }
    
    return {
      success: true,
      message: "Edge function client connection successful",
      data
    };
  } catch (error) {
    return {
      success: false,
      message: "Edge function client connection failed with exception",
      error
    };
  }
};

// Test direct connection to edge function
export const testEdgeFunctionDirect = async (user: any) => {
  try {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return {
        success: false,
        message: "No valid session token found",
        error: "Authentication required"
      };
    }
    
    const supabaseFunctionsUrl = config.supabase.functionsUrl || 
                               `${config.supabase.url}/functions/v1`;
    
    // Make direct fetch request to the edge function
    const response = await fetch(`${supabaseFunctionsUrl}/generate-upload-signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ 
        user_id: user.id,
        timestamp: Math.floor(Date.now() / 1000)
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Edge function direct connection failed: ${response.status} ${response.statusText}`,
        error: errorText
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      message: "Edge function direct connection successful",
      data
    };
  } catch (error) {
    return {
      success: false,
      message: "Edge function direct connection failed with exception",
      error
    };
  }
};

// Test cloudinary configuration
export const testCloudinaryConfig = () => {
  const cloudName = config.externalServices.cloudinary.cloudName;
  const uploadPreset = config.externalServices.cloudinary.uploadPreset;
  
  if (!cloudName) {
    return {
      success: false,
      message: "Cloudinary cloud name is not configured",
      error: "Missing CLOUDINARY_CLOUD_NAME"
    };
  }
  
  if (!uploadPreset) {
    return {
      success: false,
      message: "Cloudinary upload preset is not configured",
      error: "Missing CLOUDINARY_UPLOAD_PRESET"
    };
  }
  
  return {
    success: true,
    message: "Cloudinary configuration is valid",
    data: {
      cloudName,
      uploadPreset
    }
  };
};

// Run all diagnostics for Cloudinary integration
export const runFullDiagnostics = async (user: any) => {
  // Test Supabase connection
  const supabaseTest = {
    success: !!supabase,
    message: supabase ? "Supabase client initialized successfully" : "Supabase client failed to initialize",
    details: {
      url: config.supabase.url ? "configured" : "missing",
      anonKey: config.supabase.anonKey ? "configured" : "missing"
    }
  };

  // Test Cloudinary configuration
  const cloudinaryConfigTest = testCloudinaryConfig();
  
  // Test Edge Function via Supabase client
  const edgeFunctionClientTest = await testEdgeFunctionClient(user);
  
  // Test Edge Function via direct fetch
  const edgeFunctionDirectTest = await testEdgeFunctionDirect(user);
  
  // Test direct upload to Cloudinary
  const testFile = new File(["test"], "test.txt", { type: "text/plain" });
  let cloudinaryDirectUploadTest: {
    success: boolean;
    message: string;
    error?: any;
    details?: {
      apiKeyProvided?: boolean;
      signatureProvided?: boolean;
      cloudName?: string;
    };
  } = {
    success: false,
    message: "Cloudinary direct upload not tested",
    error: "Test skipped"
  };
  
  // Only test direct upload if edge function test was successful
  if (edgeFunctionClientTest.success || edgeFunctionDirectTest.success) {
    try {
      const signatureData = edgeFunctionClientTest.success 
                          ? edgeFunctionClientTest.data 
                          : edgeFunctionDirectTest.data;
      
      if (signatureData && signatureData.signature) {
        // Create a dummy FormData object to test the upload process
        const formData = new FormData();
        formData.append('file', testFile);
        formData.append('api_key', signatureData.apiKey);
        formData.append('timestamp', signatureData.timestamp.toString());
        formData.append('signature', signatureData.signature);
        
        // Don't actually perform the upload, just verify that we could
        cloudinaryDirectUploadTest = {
          success: true,
          message: "Cloudinary direct upload preparation successful",
          details: {
            apiKeyProvided: !!signatureData.apiKey,
            signatureProvided: !!signatureData.signature,
            cloudName: signatureData.cloudName
          }
        };
      }
    } catch (error) {
      cloudinaryDirectUploadTest = {
        success: false,
        message: "Cloudinary direct upload test failed",
        error
      };
    }
  }
  
  // Return all test results
  return {
    supabase: supabaseTest,
    cloudinaryConfig: cloudinaryConfigTest,
    edgeFunctionClient: edgeFunctionClientTest,
    edgeFunctionDirect: edgeFunctionDirectTest,
    cloudinaryDirectUpload: cloudinaryDirectUploadTest
  };
};
