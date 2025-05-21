
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createCheckoutSession } from "@/services/subscriptionService";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: PricingFeature[];
  planId: string;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  onManageSubscription?: () => void;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  planId,
  isPopular = false,
  isCurrentPlan = false,
  onManageSubscription,
}: PricingCardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const url = await createCheckoutSession(planId);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not initiate subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={`w-full ${isPopular ? "border-primary shadow-lg" : ""} ${isCurrentPlan ? "border-green-500" : ""}`}>
      <CardHeader>
        {isPopular && (
          <div className="rounded-full text-xs font-semibold uppercase tracking-wide text-primary mb-2 bg-primary/10 self-start px-3 py-1">
            Most Popular
          </div>
        )}
        {isCurrentPlan && (
          <div className="rounded-full text-xs font-semibold uppercase tracking-wide text-green-500 mb-2 bg-green-500/10 self-start px-3 py-1">
            Current Plan
          </div>
        )}
        <CardTitle>{title}</CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className={`h-4 w-4 ${feature.included ? "text-primary" : "text-muted-foreground"}`} />
              <span className={feature.included ? "" : "text-muted-foreground line-through"}>{feature.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {isCurrentPlan ? (
          <Button className="w-full" onClick={onManageSubscription}>
            Manage Subscription
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={handleSubscribe}
            disabled={isLoading}
            variant={isPopular ? "default" : "outline"}
          >
            {isLoading ? "Processing..." : "Subscribe"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
