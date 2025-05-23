// Full diagnostics utility to diagnose Cloudinary signature issues
import { supabase } from "@/integrations/supabase/client";
import { getCloudinaryConfig } from "@/integrations/cloudinary/config";

/**
 * A comprehensive diagnostic tool for Cloudinary signatures
 */
export const fullCloudinaryDiagnostics = async (user: any) => {
  if (!user) {
    throw new Error("User authentication required for diagnostics");
  }

  console.group("🔍 CLOUDINARY FULL DIAGNOSTICS");
  try {
    // Step 1: Check client configuration
    console.log("📋 STEP 1: Checking client configuration...");
    const config = getCloudinaryConfig();
    console.log("Client Config:", {
      cloudName: config.cloudName || "MISSING",
      apiKeyPresent: !!config.apiKey,
      uploadPresetPresent: !!config.uploadPreset,
      enabled: config.enabled
    });

    // Step 2: Get authentication token
    console.log("📋 STEP 2: Checking authentication...");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No valid session token found");
    }
    console.log("Authentication OK:", {
      userPresent: !!user,
      tokenPresent: !!session?.access_token,
      tokenLength: session?.access_token?.length || 0
    });

    // Step 3: Try fetching from edge function
    console.log("📋 STEP 3: Testing edge function...");
    const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
    
    if (!functionUrl) {
      throw new Error("VITE_SUPABASE_FUNCTIONS_URL not configured");
    }

    console.log("Calling edge function at:", functionUrl);
    
    const response = await fetch(`${functionUrl}/generate-upload-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'Origin': window.location.origin
      },
      body: JSON.stringify({ 
        user_id: user.id,
        debug_mode: true // Request verbose debug info
      })
    });

    console.log("Edge function response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge function returned error:", response.status, errorText);
      throw new Error(`Edge function error: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    console.log("Edge function raw response:", responseData);

    // Step 4: Validate response structure in detail
    console.log("📋 STEP 4: Validating response structure...");
    
    const keysPresent = Object.keys(responseData);
    console.log("Response keys:", keysPresent);
    
    // Required fields for Cloudinary upload
    const requiredFields = ['signature', 'timestamp', 'api_key', 'cloudName'];
    const fieldPresence = requiredFields.map(field => ({
      field, 
      present: keysPresent.includes(field),
      value: field === 'api_key' ? 
             (responseData.api_key ? "PRESENT" : "MISSING") : 
             (responseData[field] ? "PRESENT" : "MISSING")
    }));
    
    console.log("Required fields check:", fieldPresence);

    // Step 5: Simulate both validation methods
    console.log("📋 STEP 5: Simulating validation...");
    
    const oldValidation = !!(responseData.signature && responseData.cloudName && responseData.apiKey);
    const newValidation = !!(responseData.signature && responseData.cloudName && (responseData.api_key || responseData.apiKey));
    
    console.log("Validation results:", {
      oldValidation,
      newValidation,
      apiKeyPresent: !!responseData.apiKey,
      api_keyPresent: !!responseData.api_key,
    });

    // Step 6: Try forming the upload data
    console.log("📋 STEP 6: Testing upload form construction...");
    
    // CRITICAL: This approach EXACTLY matches what's done in the upload function
    const uploadData = {
      api_key: responseData.api_key || responseData.apiKey,
      timestamp: responseData.timestamp,
      signature: responseData.signature,
      cloudName: responseData.cloudName,
      folder: responseData.folder,
    };
    
    console.log("Upload data that would be used:", uploadData);
    console.log("Is upload data valid:", !!uploadData.api_key && !!uploadData.timestamp && !!uploadData.signature);

    // Return comprehensive diagnosis
    return {
      success: true,
      clientConfig: {
        cloudName: config.cloudName || "MISSING",
        apiKeyPresent: !!config.apiKey,
        uploadPresetPresent: !!config.uploadPreset,
        enabled: config.enabled
      },
      authStatus: {
        authenticated: !!session?.access_token,
      },
      edgeFunction: {
        status: response.status,
        responseKeys: keysPresent,
        requiredFieldStatus: fieldPresence,
      },
      validation: {
        oldValidation,
        newValidation,
        apiKeyPresent: !!responseData.apiKey,
        api_keyPresent: !!responseData.api_key,
        uploadDataValid: !!uploadData.api_key && !!uploadData.timestamp && !!uploadData.signature
      },
      rawResponse: responseData,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Diagnostics failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: Date.now()
    };
  } finally {
    console.groupEnd();
  }
};
