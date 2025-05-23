
import { supabase } from "@/integrations/supabase/client";
import config from "@/config";

// Test edge function with Supabase client
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
