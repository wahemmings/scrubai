
import { supabase } from "@/integrations/supabase/client";
import config from "@/config";

// Test the edge function with the client
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

// Test the edge function with direct REST call
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
    
    // Get the function URL
    const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 
                         `${config.supabase.functionsUrl}`;
    
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
