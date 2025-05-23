
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
      body: { user_id: user.id, _dummy_query: "test" as any } // Fix type error by casting
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
