import { supabase } from "@/integrations/supabase/client";

/**
 * Test signature generation functionality
 * This tests the fix for the "Invalid signature data structure" issue
 */
export const testSignatureGeneration = async (user: any) => {
  if (!user) {
    throw new Error("User authentication required for signature test");
  }

  console.log("🧪 Testing signature generation...");
  
  try {
    // Get the current session token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No valid session token found");
    }

    console.log("✅ Session token available");

    // Test the edge function directly
    const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
    
    if (!functionUrl) {
      throw new Error("VITE_SUPABASE_FUNCTIONS_URL not configured");
    }

    console.log("📡 Calling edge function...");

    const response = await fetch(`${functionUrl}/generate-upload-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'Origin': window.location.origin
      },
      body: JSON.stringify({ user_id: user.id })
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge function error:", response.status, errorText);
      throw new Error(`Edge function error: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    console.log("📡 Response data:", responseData);

    // Analyze the response structure
    const analysis = {
      hasSignature: !!responseData.signature,
      hasCloudName: !!responseData.cloudName,
      hasApiKey: !!responseData.apiKey,
      hasCorrectApiKeyField: !!responseData.api_key,
      hasTimestamp: !!responseData.timestamp,
      hasFolder: !!responseData.folder,
      parameterNames: Object.keys(responseData)
    };

    console.log("🔍 Response analysis:", analysis);

    // Test both old and new validation logic
    const validationResult = {
      wouldPassOldValidation: !!(responseData.signature && responseData.cloudName && responseData.apiKey),
      wouldPassNewValidation: !!(responseData.signature && responseData.cloudName && (responseData.api_key || responseData.apiKey))
    };

    console.log("✅ Validation results:", validationResult);

    return {
      success: true,
      responseData,
      analysis,
      validationResult,
      message: validationResult.wouldPassNewValidation ? 
        "✅ Signature generation successful - new validation logic works!" :
        "❌ Signature generation failed - validation logic needs review",
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("❌ Signature test failed:", error);
    throw error;
  }
};
