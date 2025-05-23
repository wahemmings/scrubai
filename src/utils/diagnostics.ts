
import { supabase } from "@/integrations/supabase/client";
import config from "@/config";

interface DiagnosticResult {
  success: boolean;
  message: string;
  details?: any;
  error?: any;
}

/**
 * Tests the connection to Supabase
 */
export const testSupabaseConnection = async (): Promise<DiagnosticResult> => {
  try {
    const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
    
    if (error) {
      return {
        success: false,
        message: "Supabase connection failed",
        error
      };
    }
    
    // Check authentication status
    const { data: authData } = await supabase.auth.getSession();
    const isAuthenticated = !!authData.session;
    
    return {
      success: true,
      message: `Supabase connection successful. Auth status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`,
      details: {
        projectUrl: config.supabase.url,
        isAuthenticated,
        hasSession: !!authData.session
      }
    };
  } catch (error) {
    return {
      success: false,
      message: "Exception when testing Supabase connection",
      error
    };
  }
};

/**
 * Tests Cloudinary configuration
 */
export const testCloudinaryConfig = (): DiagnosticResult => {
  const cloudName = config.externalServices.cloudinary.cloudName;
  const uploadPreset = config.externalServices.cloudinary.uploadPreset;
  
  if (!cloudName) {
    return {
      success: false,
      message: "Missing Cloudinary cloud name",
      details: {
        environmentVariable: "VITE_CLOUDINARY_CLOUD_NAME",
        configValue: cloudName
      }
    };
  }
  
  if (!uploadPreset) {
    return {
      success: false,
      message: "Missing Cloudinary upload preset",
      details: {
        configValue: uploadPreset,
        defaultValue: "scrubai_secure"
      }
    };
  }
  
  return {
    success: true,
    message: "Cloudinary configuration is valid",
    details: {
      cloudName,
      uploadPreset,
      isEnabled: config.features.enableCloudinary
    }
  };
};

/**
 * Tests the Supabase Edge Function directly using fetch
 */
export const testEdgeFunctionDirect = async (user: any): Promise<DiagnosticResult> => {
  if (!user) {
    return {
      success: false,
      message: "No authenticated user for edge function test",
    };
  }
  
  try {
    // Get authentication token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return {
        success: false,
        message: "No access token available for edge function test",
      };
    }
    
    // Get the Supabase URL from config or env
    const supabaseUrl = config.supabase.url;
    const projectRef = supabaseUrl.match(/\/\/([^.]+)/)?.[1] || "";
    
    if (!projectRef) {
      return {
        success: false,
        message: "Could not extract project reference from Supabase URL",
        details: { supabaseUrl }
      };
    }
    
    // Build the edge function URL
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/generate-upload-signature`;
    
    console.log("Attempting direct edge function call to:", edgeFunctionUrl);
    
    // Call the edge function directly with fetch
    const response = await fetch(edgeFunctionUrl, {
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
        message: `Edge function direct call failed with status: ${response.status}`,
        error: errorText,
        details: {
          status: response.status,
          statusText: response.statusText,
          url: edgeFunctionUrl
        }
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      message: "Edge function direct call successful",
      details: {
        url: edgeFunctionUrl,
        responseKeys: Object.keys(data),
        hasSignature: !!data.signature,
        hasApiKey: !!data.apiKey,
        cloudName: data.cloudName
      }
    };
  } catch (error) {
    return {
      success: false,
      message: "Exception when calling edge function directly",
      error
    };
  }
};

/**
 * Tests the Supabase Edge Function using the supabase client
 */
export const testEdgeFunctionClient = async (user: any): Promise<DiagnosticResult> => {
  if (!user) {
    return {
      success: false,
      message: "No authenticated user for edge function test",
    };
  }
  
  try {
    // Get authentication token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return {
        success: false,
        message: "No access token available for edge function test",
      };
    }
    
    console.log("Attempting edge function call via Supabase client");
    
    // Call the edge function using the Supabase client
    const { data, error } = await supabase.functions.invoke('generate-upload-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user_id: user.id,
        timestamp: Math.floor(Date.now() / 1000)
      })
    });
    
    if (error) {
      return {
        success: false,
        message: "Edge function call via client failed",
        error,
      };
    }
    
    if (!data) {
      return {
        success: false,
        message: "Edge function call succeeded but returned no data",
      };
    }
    
    return {
      success: true,
      message: "Edge function call via client successful",
      details: {
        responseKeys: Object.keys(data),
        hasSignature: !!data.signature,
        hasApiKey: !!data.apiKey,
        cloudName: data.cloudName
      }
    };
  } catch (error) {
    return {
      success: false,
      message: "Exception when calling edge function via client",
      error
    };
  }
};

/**
 * Tests a direct upload to Cloudinary (without signature)
 */
export const testCloudinaryDirectUpload = async (): Promise<DiagnosticResult> => {
  try {
    const cloudName = config.externalServices.cloudinary.cloudName;
    const uploadPreset = config.externalServices.cloudinary.uploadPreset;
    
    if (!cloudName || !uploadPreset) {
      return {
        success: false,
        message: "Missing Cloudinary configuration for direct upload test",
        details: { cloudName, uploadPreset }
      };
    }
    
    // Create a small test file
    const blob = new Blob(['test file content'], { type: 'text/plain' });
    const testFile = new File([blob], 'test-file.txt', { type: 'text/plain' });
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('upload_preset', uploadPreset);
    
    console.log("Attempting direct Cloudinary upload with preset:", uploadPreset);
    
    // Upload directly to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: "Direct Cloudinary upload failed",
        error: errorData,
        details: {
          status: response.status,
          statusText: response.statusText
        }
      };
    }
    
    const result = await response.json();
    
    return {
      success: true,
      message: "Direct Cloudinary upload successful",
      details: {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format
      }
    };
  } catch (error) {
    return {
      success: false,
      message: "Exception when testing direct Cloudinary upload",
      error
    };
  }
};

/**
 * Runs a comprehensive set of diagnostic tests
 */
export const runFullDiagnostics = async (user: any) => {
  const results = {
    supabase: await testSupabaseConnection(),
    cloudinaryConfig: testCloudinaryConfig(),
    edgeFunctionClient: await testEdgeFunctionClient(user),
    edgeFunctionDirect: await testEdgeFunctionDirect(user),
    cloudinaryDirectUpload: await testCloudinaryDirectUpload()
  };
  
  return results;
};
