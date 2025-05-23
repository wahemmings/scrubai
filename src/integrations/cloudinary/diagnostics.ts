
import { supabase } from "@/integrations/supabase/client";
import config from "@/config";

// Test the Cloudinary configuration
export const diagnoseCloudinayConfiguration = async (): Promise<any> => {
  try {
    const cloudName = config.externalServices.cloudinary.cloudName;
    const apiKey = config.externalServices.cloudinary.apiKey;
    const uploadPreset = config.externalServices.cloudinary.uploadPreset;
    
    const result = {
      success: true,
      configuration: {
        cloudName,
        apiKey: apiKey ? "✓ Configured" : "✗ Missing",
        uploadPreset,
        envVars: {
          VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "Not set",
          VITE_CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY ? "✓ Set" : "✗ Not set",
          VITE_ENABLE_CLOUDINARY: import.meta.env.VITE_ENABLE_CLOUDINARY
        }
      }
    };
    
    return result;
  } catch (error) {
    console.error("Diagnostics error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Test direct access to Cloudinary
export const testDirectCloudinaryAccess = async (): Promise<any> => {
  try {
    const cloudName = config.externalServices.cloudinary.cloudName;
    if (!cloudName) {
      return { 
        success: false, 
        error: "No Cloudinary cloud name configured" 
      };
    }
    
    // Try to fetch a simple resource from Cloudinary to test connection
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/sample.jpg`;
    
    const response = await fetch(url, {
      method: 'HEAD',
    });
    
    if (response.ok) {
      return { 
        success: true,
        message: "Successfully connected to Cloudinary",
        details: {
          url,
          status: response.status,
          statusText: response.statusText,
        }
      };
    } else {
      return {
        success: false,
        error: `Failed to connect to Cloudinary: ${response.status} ${response.statusText}`,
        details: {
          url,
          status: response.status,
          statusText: response.statusText,
        }
      };
    }
  } catch (error) {
    console.error("Direct Cloudinary test error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Export testing functions to be used by other modules
export const testEdgeFunctionClient = async (user: any): Promise<any> => {
  try {
    if (!user) {
      throw new Error("User is required for edge function test");
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No valid session token found");
    }
    
    // Test the edge function with a test mode flag
    const { data, error } = await supabase.functions.invoke('generate-upload-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ 
        user_id: user.id,
        test_mode: true
      })
    });
    
    if (error) {
      console.error("Edge function test error:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Edge function test error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};

// Test edge function with direct fetch
export const testEdgeFunctionDirect = async (user: any): Promise<any> => {
  try {
    if (!user) {
      throw new Error("User is required for edge function test");
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No valid session token found");
    }
    
    const functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 
                       `${config.supabase.url}/functions/v1`;
    
    const response = await fetch(`${functionsUrl}/generate-upload-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ 
        user_id: user.id,
        test_mode: true
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return { 
        success: false, 
        error: `Edge function direct fetch failed: ${response.status} ${errorText}` 
      };
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Direct edge function test error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};

// Test Cloudinary configuration
export const testCloudinaryConfig = async (): Promise<any> => {
  const cloudName = config.externalServices.cloudinary.cloudName;
  const apiKey = config.externalServices.cloudinary.apiKey;
  const uploadPreset = config.externalServices.cloudinary.uploadPreset;
  
  return {
    success: !!cloudName,
    config: {
      cloudName,
      apiKey: apiKey ? "✓ Configured" : "✗ Missing",
      uploadPreset,
      enabled: !!cloudName
    }
  };
};
