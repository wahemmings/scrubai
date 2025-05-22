
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Subscription } from "@/hooks/useSubscription";

export const checkSubscriptionStatus = async (): Promise<Subscription> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-subscription');
    
    if (error) {
      console.error('Error checking subscription status:', error);
      return { subscribed: false, plan_type: null, current_period_end: null };
    }
    
    return data as Subscription;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { subscribed: false, plan_type: null, current_period_end: null };
  }
};

export const createCheckoutSession = async (plan: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { plan },
    });
    
    if (error) {
      toast.error('Error creating checkout session', {
        description: error.message,
      });
      return null;
    }
    
    return data.url;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast.error('Error creating checkout session', {
      description: errorMessage,
    });
    return null;
  }
};

export const openCustomerPortal = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    
    if (error) {
      toast.error('Error opening customer portal', {
        description: error.message,
      });
      return null;
    }
    
    // Open Stripe customer portal in a new tab
    if (data?.url) {
      window.open(data.url, '_blank');
      return data.url;
    }
    
    toast.error('Invalid response from customer portal');
    return null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast.error('Error opening customer portal', {
      description: errorMessage,
    });
    return null;
  }
};

// Add a function to handle post-checkout updates
export const handlePostCheckout = async (sessionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('verify-checkout', {
      body: { sessionId },
    });
    
    if (error) {
      toast.error('Error verifying checkout', {
        description: error.message,
      });
      return false;
    }
    
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error verifying checkout:', errorMessage);
    return false;
  }
};
