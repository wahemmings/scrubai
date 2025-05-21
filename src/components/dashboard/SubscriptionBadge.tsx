
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/hooks/useSubscription";
import { openCustomerPortal } from "@/services/subscriptionService";

interface SubscriptionBadgeProps {
  subscription: Subscription;
  isLoading: boolean;
}

export const SubscriptionBadge = ({ subscription, isLoading }: SubscriptionBadgeProps) => {
  const handleManageSubscription = async () => {
    const url = await openCustomerPortal();
    if (url) {
      window.location.href = url;
    }
  };

  if (isLoading) {
    return (
      <Badge variant="outline" className="bg-background text-foreground">
        Loading subscription...
      </Badge>
    );
  }
  
  if (!subscription.subscribed) {
    return (
      <Badge variant="outline" className="bg-background text-foreground">
        Free Trial - 6 days left
      </Badge>
    );
  }
  
  const planLabel = subscription.plan_type?.charAt(0).toUpperCase() + subscription.plan_type?.slice(1);
  let variant: "default" | "outline" | "secondary" | "destructive" = "outline";
  
  switch (subscription.plan_type) {
    case 'basic':
      variant = "secondary";
      break;
    case 'pro':
      variant = "default";
      break;
    case 'enterprise':
      // Using default instead of "success" which isn't a valid variant
      variant = "default"; 
      break;
  }
  
  return (
    <Badge variant={variant} className="cursor-pointer" onClick={handleManageSubscription}>
      {planLabel} Plan
      {subscription.current_period_end && (
        <span className="ml-1 text-xs">
          - Renews {new Date(subscription.current_period_end).toLocaleDateString()}
        </span>
      )}
    </Badge>
  );
};
