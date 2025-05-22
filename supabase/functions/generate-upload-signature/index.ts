
// generate-upload-signature/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { v4 as uuid } from "https://esm.sh/uuid@9";
import { createHash, createHmac } from "https://deno.land/std@0.167.0/node/crypto.ts";

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client for checking authentication
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate a Cloudinary API signature
function generateSignature(params: Record<string, string | number>, apiSecret: string): string {
  const paramStr = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return createHmac('sha256', apiSecret)
    .update(paramStr)
    .digest('hex');
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get authorization token and verify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the user's session from their JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get Cloudinary credentials from environment variables
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');
    const uploadPreset = Deno.env.get('CLOUDINARY_UPLOAD_PRESET') || 'scrubai_secure';
    
    // Validate required Cloudinary credentials
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials:', { 
        hasCloudName: !!cloudName, 
        hasApiKey: !!apiKey, 
        hasApiSecret: !!apiSecret 
      });
      
      return new Response(
        JSON.stringify({ error: 'Cloudinary configuration not found' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate parameters for Cloudinary upload
    const timestamp = Math.floor(Date.now() / 1000);
    const userId = user.id;
    const publicId = `${userId}/${uuid()}`;
    const folder = `scrubai/${userId}`;
    
    // Parameters to sign
    const paramsToSign = {
      timestamp,
      folder,
      upload_preset: uploadPreset,
      public_id: publicId,
    };
    
    // Generate signature
    const signature = generateSignature(paramsToSign, apiSecret);
    
    // Return the signature and parameters needed for the frontend
    return new Response(
      JSON.stringify({
        signature,
        timestamp,
        folder,
        publicId,
        uploadPreset,
        cloudName,
        apiKey,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error generating upload signature:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
