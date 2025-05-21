
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface SubscriptionStatus {
  subscribed: boolean;
  plan_type: string | null;
  current_period_end: string | null;
}

export const checkSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-subscription');
    
    if (error) {
      console.error('Error checking subscription status:', error);
      return { subscribed: false, plan_type: null, current_period_end: null };
    }
    
    return data as SubscriptionStatus;
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
      toast({
        title: 'Error creating checkout session',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
    
    return data.url;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast({
      title: 'Error creating checkout session',
      description: errorMessage,
      variant: 'destructive',
    });
    return null;
  }
};

export const openCustomerPortal = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    
    if (error) {
      toast({
        title: 'Error opening customer portal',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
    
    return data.url;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast({
      title: 'Error opening customer portal',
      description: errorMessage,
      variant: 'destructive',
    });
    return null;
  }
};
