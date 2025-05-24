
import { supabase } from "@/integrations/supabase/client";
import config from "@/config";

// Test edge function client connectivity
export const testEdgeFunctionClient = async (user: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-upload-signature', {
      body: { user_id: user.id }
    });

    if (error) throw error;
    
    return { 
      success: true, 
      data,
      message: 'Edge function client test successful'
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Edge function client test failed'
    };
  }
};

// Test edge function direct connectivity
export const testEdgeFunctionDirect = async (user: any) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No valid session token found");
    }

    const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
    if (!functionUrl) {
      throw new Error("VITE_SUPABASE_FUNCTIONS_URL not configured");
    }

    const response = await fetch(`${functionUrl}/generate-upload-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'Origin': window.location.origin
      },
      body: JSON.stringify({ user_id: user.id })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return { 
      success: true, 
      data,
      message: 'Edge function direct test successful'
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Edge function direct test failed'
    };
  }
};

// Test Cloudinary configuration
export const testCloudinaryConfig = () => {
  const cloudinaryConfig = config.externalServices.cloudinary;
  const enabled = config.features.enableCloudinary;
  
  return {
    status: enabled ? 'enabled' : 'disabled',
    cloudName: cloudinaryConfig.cloudName,
    apiKey: cloudinaryConfig.apiKey,
    uploadPreset: cloudinaryConfig.uploadPreset,
    enabled,
    hasCloudName: !!cloudinaryConfig.cloudName,
    hasApiKey: !!cloudinaryConfig.apiKey,
    hasUploadPreset: !!cloudinaryConfig.uploadPreset,
    message: enabled ? 'Cloudinary configuration loaded' : 'Cloudinary disabled in configuration'
  };
};

// Export the Cloudinary configuration function
export const getCloudinaryConfiguration = () => {
  const cloudinaryConfig = config.externalServices.cloudinary;
  const enabled = config.features.enableCloudinary;
  
  return {
    cloudName: cloudinaryConfig.cloudName,
    apiKey: cloudinaryConfig.apiKey,
    uploadPreset: cloudinaryConfig.uploadPreset,
    enabled
  };
};
