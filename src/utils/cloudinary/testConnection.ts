
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { testEdgeFunctionClient, testEdgeFunctionDirect, testCloudinaryConfig } from '@/integrations/cloudinary/diagnostics';

// Test the connection to Cloudinary through Supabase edge function
export const testCloudinaryConnection = async (user: any) => {
  if (!user) {
    toast.error('Authentication required', {
      description: 'You must be logged in to test the Cloudinary connection'
    });
    return null;
  }
  
  toast('Testing Cloudinary connection...', {
    description: 'Checking configuration and connectivity'
  });
  
  try {
    // First test using the Supabase client
    const clientResult = await testEdgeFunctionClient(user);
    
    if (clientResult.success) {
      toast.success('Cloudinary connection successful', {
        description: 'Edge function test passed'
      });
      console.log('Edge function test result:', clientResult);
      return clientResult;
    } else {
      console.log('Client test failed, trying direct fetch...');
      
      // Fall back to direct fetch if client fails
      const directResult = await testEdgeFunctionDirect(user);
      
      if (directResult.success) {
        toast.success('Cloudinary connection successful', {
          description: 'Direct edge function test passed'
        });
        console.log('Direct edge function test result:', directResult);
        return directResult;
      } else {
        // If both tests fail, check configuration
        const configResult = await testCloudinaryConfig();
        
        if (!configResult.success) {
          toast.error('Cloudinary configuration error', {
            description: 'Your Cloudinary configuration is incomplete'
          });
        } else {
          toast.error('Cloudinary connection failed', {
            description: 'Unable to connect to Cloudinary through edge function'
          });
        }
        
        console.error('Edge function tests failed:', {
          clientError: clientResult.error,
          directError: directResult.error,
          configResult
        });
        return { success: false, clientError: clientResult.error, directError: directResult.error };
      }
    }
  } catch (error) {
    console.error('Cloudinary test failed:', error);
    toast.error('Connection test failed', {
      description: error instanceof Error ? error.message : 'Unknown error'
    });
    return { success: false, error };
  }
};

// Export for backward compatibility
export default testCloudinaryConnection;
