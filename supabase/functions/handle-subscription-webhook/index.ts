
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logEvent = (event: string, details?: any) => {
  console.log(`[WEBHOOK] ${event} - ${JSON.stringify(details || {})}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") || "";
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
    
    if (!endpointSecret || !stripeKey) {
      throw new Error("Missing Stripe configuration");
    }
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      logEvent("Webhook signature verification failed", err);
      return new Response(JSON.stringify({ error: "Webhook signature verification failed" }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
    
    logEvent("Received webhook event", { type: event.type });
    
    // Initialize Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );
    
    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Record the conversion in our database
        if (session.customer && session.subscription) {
          const { data, error } = await supabaseAdmin.from('subscription_events').insert({
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            event_type: 'conversion',
            metadata: {
              checkout_session_id: session.id,
              mode: session.mode
            }
          });
          
          if (error) {
            logEvent("Error recording conversion", error);
          } else {
            logEvent("Conversion recorded successfully");
          }
        }
        break;
        
      // Add other event types as needed
        
      default:
        logEvent(`Unhandled event type: ${event.type}`);
    }
    
    return new Response(JSON.stringify({ received: true }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logEvent("Error processing webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
