// generate-upload-signature/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { v4 as uuid } from "https://esm.sh/uuid@9";
import { createHash, createHmac } from "https://deno.land/std@0.167.0/node/crypto.ts";

// Set up CORS headers for browser requests - more permissive for debugging
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, origin, accept',
  'Access-Control-Max-Age': '86400', // 24 hours cache for preflight requests
};

// Create a Supabase client for checking authentication
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log environment variables for debugging (safe, no secrets revealed)
console.log("Edge function environment check:", {
  hasSupabaseUrl: !!supabaseUrl,
  hasSupabaseAnonKey: !!supabaseAnonKey,
  hasCloudName: !!Deno.env.get('CLOUDINARY_CLOUD_NAME'),
  hasApiKey: !!Deno.env.get('CLOUDINARY_API_KEY'),
  hasApiSecret: !!Deno.env.get('CLOUDINARY_API_SECRET'),
  hasUploadPreset: !!Deno.env.get('CLOUDINARY_UPLOAD_PRESET'),
});

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
  console.log("Edge function called: generate-upload-signature");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get authorization token and verify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Log auth header info (safe, no token revealed)
    console.log("Auth header check:", {
      hasHeader: true,
      headerLength: authHeader.length,
      headerType: authHeader.startsWith('Bearer ') ? 'Bearer' : 'Unknown'
    });
    
    // Get the user's session from their JWT token with more detailed error handling
    const token = authHeader.replace('Bearer ', '');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      console.log("Auth response details:", {
        hasUser: !!user,
        userId: user?.id || 'none',
        hasError: !!authError,
        errorMessage: authError?.message || 'none',
        tokenLength: token.length
      });
      
      if (authError || !user) {
        console.error("Authentication error:", authError);
        return new Response(
          JSON.stringify({ 
            error: 'Unauthorized', 
            details: authError?.message || 'Invalid or expired token',
            code: 'AUTH_ERROR',
            tokenIssue: token.length < 50 ? 'Token appears too short' : 'Token format may be invalid'
          }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log("Authenticated user:", user.id);
      
      // Get Cloudinary credentials from environment variables
      const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
      const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
      const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');
      const uploadPreset = Deno.env.get('CLOUDINARY_UPLOAD_PRESET') || 'scrubai_secure';
      
      // Log available environment variables for debugging
      console.log("Environment check:", {
        hasCloudName: !!cloudName,
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        hasUploadPreset: !!uploadPreset
      });
      
      // Allow test mode for diagnostics
      const requestData = await req.json().catch(() => ({}));
      if (requestData?.test_mode === true) {
        console.log("Test mode detected, returning environment check");
        return new Response(
          JSON.stringify({
            status: "test_successful",
            cloudName,
            environmentCheck: {
              hasCloudName: !!cloudName,
              hasApiKey: !!apiKey, 
              hasApiSecret: !!apiSecret,
              hasUploadPreset: !!uploadPreset
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate required Cloudinary credentials
      if (!cloudName || !apiKey || !apiSecret) {
        console.error('Missing Cloudinary credentials:', { 
          hasCloudName: !!cloudName, 
          hasApiKey: !!apiKey, 
          hasApiSecret: !!apiSecret 
        });
        return new Response(
          JSON.stringify({
            error: 'Cloudinary configuration not found',
            details: 'Check that all required secrets are configured in the Supabase dashboard',
            missing: {
              cloudName: !cloudName,
              apiKey: !apiKey,
              apiSecret: !apiSecret
            }
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Parse the request body
      const { user_id, public_id = null } = requestData;
      
      if (user_id !== user.id) {
        console.warn("User ID mismatch:", { requestUserId: user_id, tokenUserId: user.id });
      }
      
      // Prepare parameters for Cloudinary signature
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = `scrubai/${user.id}`; // User-specific folder for better organization
      
      // Create parameters object for signature generation
      const params: Record<string, string | number> = {
        timestamp,
        folder
      };
      
      // Add public_id if specified
      if (public_id) {
        params.public_id = public_id;
      }
      
      // Add upload preset if available
      if (uploadPreset) {
        params.upload_preset = uploadPreset;
      }
      
      // Generate signature
      const signature = generateSignature(params, apiSecret);
      
      // Generate response with necessary credentials for client-side upload
      const responseData = {
        signature,
        timestamp,
        cloudName,
        apiKey,
        folder,
        uploadPreset
      };
      
      if (public_id) {
        Object.assign(responseData, { publicId: public_id });
      }
      
      console.log("Generated signature successfully for user:", user.id);
      
      return new Response(
        JSON.stringify(responseData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Unexpected authentication error:", error);
      return new Response(
        JSON.stringify({ 
          error: 'Authentication processing error', 
          details: error instanceof Error ? error.message : 'Unknown error',
          code: 'AUTH_PROCESSING_ERROR'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
