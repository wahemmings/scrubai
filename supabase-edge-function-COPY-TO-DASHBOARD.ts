import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.167.0/node/crypto.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment Variables - Override these in Supabase Dashboard
// Settings -> Edge Functions -> Environment Variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// Cloudinary Configuration - Set these in Supabase Environment Variables
const CLOUDINARY_CLOUD_NAME = Deno.env.get('CLOUDINARY_CLOUD_NAME');
const CLOUDINARY_API_KEY = Deno.env.get('CLOUDINARY_API_KEY');
const CLOUDINARY_API_SECRET = Deno.env.get('CLOUDINARY_API_SECRET');

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Missing required Cloudinary environment variables');
}
const CLOUDINARY_UPLOAD_PRESET = Deno.env.get('CLOUDINARY_UPLOAD_PRESET') ?? 'scrubai_secure';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Generate HMAC-SHA1 signature for Cloudinary upload
 * @param params - Upload parameters to sign
 * @param apiSecret - Cloudinary API secret
 * @returns Hex-encoded signature
 */
function generateSignature(params: Record<string, string | number>, apiSecret: string): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return createHmac('sha1', apiSecret)
    .update(sortedParams)
    .digest('hex');
}

/**
 * Main Edge Function Handler
 * Generates secure upload signatures for Cloudinary
 */
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authenticate user via Supabase
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: 'No authorization header',
        message: 'Authentication required'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ 
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate Cloudinary configuration
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return new Response(JSON.stringify({ 
        error: 'Cloudinary configuration missing',
        message: 'Server configuration error',
        details: {
          cloudName: !!CLOUDINARY_CLOUD_NAME,
          apiKey: !!CLOUDINARY_API_KEY,
          apiSecret: !!CLOUDINARY_API_SECRET
        }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate upload parameters
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `scrubai/${user.id}`;

    // Parameters for signature generation (must match Cloudinary upload)
    const params = {
      timestamp,
      folder,
      upload_preset: CLOUDINARY_UPLOAD_PRESET
    };

    // Generate secure signature
    const signature = generateSignature(params, CLOUDINARY_API_SECRET);

    // Return upload configuration
    return new Response(JSON.stringify({
      // Signature data
      signature,
      timestamp,
      
      // Cloudinary configuration
      cloudName: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      folder,
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
      
      // Additional metadata
      user_id: user.id,
      generated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'Failed to generate upload signature'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
