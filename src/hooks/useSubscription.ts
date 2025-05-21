
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { checkSubscriptionStatus } from '@/services/subscriptionService';

export interface Subscription {
  subscribed: boolean;
  plan_type: string | null;
  current_period_end: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription>({
    subscribed: false,
    plan_type: null,
    current_period_end: null,
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription({ subscribed: false, plan_type: null, current_period_end: null });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const status = await checkSubscriptionStatus();
        setSubscription(status);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const refreshSubscription = async () => {
    setIsLoading(true);
    try {
      const status = await checkSubscriptionStatus();
      setSubscription(status);
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    subscription,
    refreshSubscription,
  };
};
