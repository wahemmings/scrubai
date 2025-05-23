
import { supabase } from "@/integrations/supabase/client";
import { cloudinaryConfig, getCloudinaryConfig } from "./config";

/**
 * Test the edge function with the client
 */
export const testEdgeFunctionClient = async (user: any): Promise<any> => {
  if (!user) {
    return {
      success: false,
      error: "Authentication required"
    };
  }
  
  try {
    console.log("Testing edge function with client...");
    
    // Check that the user has a valid session token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No valid session token found");
    }
    
    // Call the edge function in test mode
    const { data, error } = await supabase.functions.invoke('generate-upload-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: { 
        user_id: user.id,
        test_mode: true 
      }
    });
    
    if (error) {
      console.error("Edge function test error:", error);
      return {
        success: false,
        error: error.message || JSON.stringify(error),
      };
    }
    
    console.log("Edge function test response:", data);
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Edge function test error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

/**
 * Test the edge function with direct REST call
 */
export const testEdgeFunctionDirect = async (user: any): Promise<any> => {
  if (!user) {
    return {
      success: false,
      error: "Authentication required"
    };
  }
  
  try {
    console.log("Testing edge function with direct call...");
    
    // Check that the user has a valid session token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No valid session token found");
    }
    
    // Get the function URL from environment variables
    const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 
                         `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.functions.supabase.co`;
    
    if (!functionUrl) {
      throw new Error("Supabase functions URL is not configured");
    }
    
    // Call the edge function directly
    const response = await fetch(`${functionUrl}/generate-upload-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'Origin': window.location.origin
      },
      body: JSON.stringify({ 
        user_id: user.id,
        test_mode: true 
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Edge function direct call failed: ${response.status} ${errorText || response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Edge function direct test response:", data);
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Edge function direct test error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

/**
 * Test Cloudinary configuration
 */
export const testCloudinaryConfig = async (): Promise<any> => {
  const config = getCloudinaryConfig();
  
  return {
    success: !!config.cloudName,
    config: {
      cloudName: config.cloudName,
      apiKey: config.apiKey ? "✓ Configured" : "✗ Missing",
      uploadPreset: config.uploadPreset,
      enabled: config.enabled
    }
  };
};

/**
 * Comprehensive diagnostic function to check Cloudinary configuration
 * This will help troubleshoot connection issues
 */
export const diagnoseCloudinayConfiguration = async () => {
  // Check client-side configuration
  console.group("🔍 Cloudinary Configuration Diagnostics");
  
  try {
    // 1. Check client-side environment variables
    console.log("Environment Variables:", {
      CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "❌ Missing",
      CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
      CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "❌ Missing",
      ENABLE_CLOUDINARY: import.meta.env.VITE_ENABLE_CLOUDINARY || "❌ Missing"
    });

    // 2. Check config object
    const config = getCloudinaryConfig();
    console.log("Configuration Object:", {
      cloudName: config.cloudName || "❌ Missing",
      apiKeyPresent: !!config.apiKey ? "✅ Set" : "❌ Missing",
      uploadPreset: config.uploadPreset || "❌ Missing",
      enabled: config.enabled ? "✅ Enabled" : "❌ Disabled"
    });

    // 3. Check authentication status
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Supabase Authentication:", {
      authenticated: !!session ? "✅ Authenticated" : "❌ Not authenticated",
      sessionExpires: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : "N/A",
      hasAccessToken: !!session?.access_token ? "✅ Valid token" : "❌ No access token"
    });

    // 4. Test Edge Function
    console.log("Testing Edge Function connectivity...");
    
    try {
      if (!session?.access_token) {
        console.error("Cannot test edge function without authentication");
        return {
          clientConfigOk: !!config.cloudName,
          authenticated: false,
          edgeFunctionAccessible: false,
          supabaseSecretsConfigured: false
        };
      }
      
      // Simple edge function call to test connection
      const { data, error } = await supabase.functions.invoke('generate-upload-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ test_mode: true })
      });
      
      if (error) {
        console.error("Edge function error:", error);
        return {
          clientConfigOk: !!config.cloudName,
          authenticated: true,
          edgeFunctionAccessible: false,
          supabaseSecretsConfigured: false,
          error: error.message
        };
      }
      
      if (!data) {
        console.error("No data returned from edge function");
        return {
          clientConfigOk: !!config.cloudName,
          authenticated: true,
          edgeFunctionAccessible: true,
          supabaseSecretsConfigured: false,
          error: "Empty response from edge function"
        };
      }
      
      // Check if we got valid data back
      const secretsConfigured = data.environmentCheck && data.environmentCheck.hasApiSecret;
      console.log("Edge Function Response:", {
        edgeFunctionAccessible: "✅ Accessible",
        supabaseSecretsConfigured: secretsConfigured ? "✅ Configured" : "❌ Missing",
        cloudNameMatches: data.cloudName === config.cloudName ? "✅ Matches" : "❌ Mismatch"
      });
      
      return {
        clientConfigOk: !!config.cloudName,
        authenticated: true,
        edgeFunctionAccessible: true,
        supabaseSecretsConfigured: secretsConfigured,
        cloudNameMatches: data.cloudName === config.cloudName,
      };
    } catch (error) {
      console.error("Edge function connectivity test failed:", error);
      return {
        clientConfigOk: !!config.cloudName,
        authenticated: !!session,
        edgeFunctionAccessible: false,
        supabaseSecretsConfigured: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  } catch (error) {
    console.error("Diagnostics failed:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  } finally {
    console.groupEnd();
  }
};

/**
 * Function to test direct Cloudinary connectivity (without Supabase)
 * This can help determine if the issue is with Cloudinary or Supabase
 */
export const testDirectCloudinaryAccess = async () => {
  console.group("🔍 Direct Cloudinary API Test");
  
  try {
    // Only attempt if we have a cloud name
    const { cloudName, apiKey } = getCloudinaryConfig();
    
    if (!cloudName) {
      console.error("Cannot test Cloudinary API without cloud name");
      return { success: false, error: "Missing cloud name" };
    }
    
    // Test if we can reach the Cloudinary API (just a ping, not a full upload)
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/ping`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary ping failed:", errorText);
      return { 
        success: false, 
        status: response.status,
        error: errorText 
      };
    }
    
    const result = await response.json();
    console.log("Cloudinary ping successful:", result);
    return { 
      success: true,
      cloudName,
      apiKeyProvided: !!apiKey,
      response: result
    };
  } catch (error) {
    console.error("Direct Cloudinary test failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  } finally {
    console.groupEnd();
  }
};
