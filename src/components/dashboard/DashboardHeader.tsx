
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CreditDisplay } from "@/components/dashboard/CreditDisplay";
import { SubscriptionBadge } from "@/components/dashboard/SubscriptionBadge";
import { useSubscription } from "@/hooks/useSubscription";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { subscription, isLoading } = useSubscription();
  
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">ScrubAI Dashboard</h1>
      <div className="flex items-center gap-3">
        <SubscriptionBadge 
          subscription={subscription} 
          isLoading={isLoading} 
        />
        <CreditDisplay />
        <Button size="sm" onClick={() => navigate("/pricing")}>
          {subscription.subscribed ? "Manage Plan" : "Upgrade"}
        </Button>
      </div>
    </div>
  );
};
