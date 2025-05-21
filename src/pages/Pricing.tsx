
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { PricingCard } from "@/components/pricing/PricingCard";
import { openCustomerPortal } from "@/services/subscriptionService";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Pricing = () => {
  const { user } = useAuth();
  const { subscription, isLoading, refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Check for query parameters that indicate subscription status
    const subscriptionCanceled = searchParams.get('subscription_canceled');
    
    if (subscriptionCanceled === 'true') {
      toast({
        title: "Subscription Canceled",
        description: "Your subscription process was canceled.",
      });
    }
    
    // If we detect a subscription-related query param, refresh the subscription status
    if (subscriptionCanceled) {
      refreshSubscription();
    }
  }, [searchParams, refreshSubscription]);
  
  const handleManageSubscription = async () => {
    const url = await openCustomerPortal();
    if (url) {
      window.location.href = url;
    }
  };
  
  const pricingPlans = [
    {
      title: "Free Trial",
      price: 0,
      planId: "free",
      description: "Perfect for getting started with basic features.",
      features: [
        { name: "5 Credits", included: true },
        { name: "Text Processing", included: true },
        { name: "Document Processing", included: false },
        { name: "Image Processing", included: false },
        { name: "Unlimited Exports", included: false },
      ],
    },
    {
      title: "Basic",
      price: 9.99,
      planId: "basic",
      description: "Great for regular users who need more processing power.",
      isPopular: true,
      features: [
        { name: "50 Credits", included: true },
        { name: "Text Processing", included: true },
        { name: "Document Processing", included: true },
        { name: "Image Processing", included: false },
        { name: "Unlimited Exports", included: false },
      ],
    },
    {
      title: "Pro",
      price: 29.99,
      planId: "pro",
      description: "For professionals who need all features and more resources.",
      features: [
        { name: "200 Credits", included: true },
        { name: "Text Processing", included: true },
        { name: "Document Processing", included: true },
        { name: "Image Processing", included: true },
        { name: "Unlimited Exports", included: true },
      ],
    },
    {
      title: "Enterprise",
      price: 99.99,
      planId: "enterprise",
      description: "For organizations with high-volume processing needs.",
      features: [
        { name: "1000 Credits", included: true },
        { name: "Text Processing", included: true },
        { name: "Document Processing", included: true },
        { name: "Image Processing", included: true },
        { name: "Unlimited Exports", included: true },
      ],
    },
  ];
  
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Select the plan that best suits your needs
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.planId}
            title={plan.title}
            price={plan.price}
            description={plan.description}
            features={plan.features}
            planId={plan.planId}
            isPopular={plan.isPopular}
            isCurrentPlan={
              subscription?.plan_type === plan.planId ||
              (plan.planId === "free" && !subscription?.subscribed)
            }
            onManageSubscription={handleManageSubscription}
          />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-2">
          All plans come with a 14-day money-back guarantee
        </p>
        {!user && (
          <p className="text-sm text-muted-foreground">
            <button 
              className="text-primary underline"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </button> to subscribe to a plan
          </p>
        )}
      </div>
    </div>
  );
};

export default Pricing;
