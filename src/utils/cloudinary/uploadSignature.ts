import { supabase } from "@/integrations/supabase/client";
import config from "@/config";

// Get secure upload signature from Supabase edge function
export const getUploadSignature = async (user: any) => {
  if (!user) {
    throw new Error("Authentication required");
  }
  
  try {
    console.log("Requesting upload signature for user:", user.id);
    
    // Check that the user has a valid session token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No valid session token found");
    }
    
    // Add detailed logging for edge function call
    console.log("Calling generate-upload-signature edge function");
    
    // More detailed request logging
    console.log("Request details:", {
      method: 'POST',
      user_id: user.id,
      has_access_token: !!session?.access_token,
      token_preview: session?.access_token ? `${session.access_token.substring(0, 10)}...` : 'none',
      token_length: session?.access_token?.length || 0
    });
    
    // Get base URL for edge functions 
    const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || null;
    
    // Try direct fetch first if we have a function URL, otherwise fall back to supabase client
    try {
      let responseData;
      
      if (functionUrl) {
        console.log("Using direct fetch to edge function at:", functionUrl + "/generate-upload-signature");
        
        // Try direct fetch first (sometimes more reliable in development)
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
          const errorText = await response.text();
          console.error("Direct fetch error:", response.status, errorText);
          throw new Error(`Direct edge function error: ${response.status} ${errorText || response.statusText}`);
        }
        
        responseData = await response.json();
      } else {
        // Otherwise use Supabase client 
        console.log("Using Supabase client for edge function invocation");
        const { data, error } = await supabase.functions.invoke('generate-upload-signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ user_id: user.id })
        });
        
        if (error) {
          console.error("Edge function error:", error);
          throw new Error(`Edge function error: ${error.message || JSON.stringify(error)}`);
        }
        
        if (!data) {
          console.error("No signature data returned from edge function");
          throw new Error("No signature data returned from edge function");
        }
        
        responseData = data;
      }
      
      // Check if the response contains the expected fields
      if (!responseData.signature || !responseData.cloudName || !responseData.apiKey) {
        console.error("Invalid signature data structure:", responseData);
        throw new Error("Invalid signature data structure returned from edge function");
      }
      
      console.log("Upload signature received successfully:", {
        cloudName: responseData.cloudName,
        folder: responseData.folder,
        uploadPreset: responseData.uploadPreset || 'scrubai_secure',
        timestamp: responseData.timestamp
      });
      
      return responseData;
    } catch (error) {
      console.error("Edge function request error:", error);
      throw new Error(`Failed to get upload signature: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error getting upload signature:", error);
    throw error;
  }
};
