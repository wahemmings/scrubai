
// schedule-purge-cron/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with service_role key to bypass RLS
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // This function sets up the cron job that runs the purge daily
    // It should be run once during application setup
    
    // Check that pg_cron and pg_net extensions are available
    const { data: extensions, error: extensionsError } = await supabase
      .from('pg_extension')
      .select('*')
      .in('extname', ['pg_cron', 'pg_net']);
    
    if (extensionsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to check extensions', details: extensionsError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const pgCronAvailable = extensions?.some(ext => ext.extname === 'pg_cron');
    const pgNetAvailable = extensions?.some(ext => ext.extname === 'pg_net');
    
    if (!pgCronAvailable || !pgNetAvailable) {
      return new Response(
        JSON.stringify({ 
          error: 'Required extensions not enabled', 
          missing: [
            !pgCronAvailable ? 'pg_cron' : null, 
            !pgNetAvailable ? 'pg_net' : null
          ].filter(Boolean) 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create the SQL query to set up the cron job
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const projectId = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1] ?? '';
    
    const cronSql = `
      SELECT cron.schedule(
        'purge-old-files-daily',
        '0 0 * * *', -- Run at midnight every day
        $$
        SELECT net.http_post(
          url := 'https://${projectId}.supabase.co/functions/v1/purge-old-files',
          headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${anonKey}"}'::jsonb,
          body := '{"source": "cron"}'::jsonb
        ) AS request_id;
        $$
      );
    `;
    
    // Execute the SQL to schedule the cron job
    const { error: cronError } = await supabase.rpc('exec_sql', { sql: cronSql });
    
    if (cronError) {
      return new Response(
        JSON.stringify({ error: 'Failed to schedule cron job', details: cronError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Purge cron job scheduled successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error scheduling purge cron:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
