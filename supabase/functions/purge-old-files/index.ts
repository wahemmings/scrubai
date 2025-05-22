
// purge-old-files/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cloudinary API URL
const CLOUDINARY_API_URL = 'https://api.cloudinary.com/v1_1';

// Create a Supabase client with service_role key to bypass RLS
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteOldCloudinaryResources(daysOld: number): Promise<{success: boolean, deletedCount?: number, error?: string}> {
  try {
    // Get Cloudinary credentials
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');
    
    if (!cloudName || !apiKey || !apiSecret) {
      return { success: false, error: 'Missing Cloudinary credentials' };
    }
    
    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffTimestamp = Math.floor(cutoffDate.getTime() / 1000);
    
    // Find resources to delete
    const { data: jobsToDelete, error: dbError } = await supabase
      .from('jobs')
      .select('id, original_content_path, processed_content_path')
      .lt('created_at', cutoffDate.toISOString());
    
    if (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: 'Database query failed' };
    }
    
    // Collect all public IDs to delete
    const publicIdsToDelete: string[] = [];
    jobsToDelete?.forEach(job => {
      if (job.original_content_path) publicIdsToDelete.push(job.original_content_path);
      if (job.processed_content_path) publicIdsToDelete.push(job.processed_content_path);
    });
    
    if (publicIdsToDelete.length === 0) {
      return { success: true, deletedCount: 0 };
    }
    
    // Delete resources from Cloudinary
    const basicAuth = btoa(`${apiKey}:${apiSecret}`);
    const response = await fetch(`${CLOUDINARY_API_URL}/${cloudName}/resources/image/upload`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_ids: publicIdsToDelete,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary API error:', errorText);
      return { success: false, error: `Cloudinary API error: ${response.status}` };
    }
    
    // Delete the jobs from the database
    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .lt('created_at', cutoffDate.toISOString());
    
    if (deleteError) {
      console.error('Error deleting jobs:', deleteError);
      return { success: false, error: 'Failed to delete jobs from database' };
    }
    
    return { success: true, deletedCount: publicIdsToDelete.length };
  } catch (error) {
    console.error('Error in deleteOldCloudinaryResources:', error);
    return { success: false, error: error.message };
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // This function should be triggered by a cron job
    // Check for authorization if called manually
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const { data: purgeResult } = await deleteOldCloudinaryResources(30);
      
      return new Response(
        JSON.stringify(purgeResult),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    } else {
      // Verify the token if this is called with auth
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Delete files older than 30 days
    const purgeResult = await deleteOldCloudinaryResources(30);
    
    return new Response(
      JSON.stringify(purgeResult),
      { 
        status: purgeResult.success ? 200 : 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error purging old files:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
