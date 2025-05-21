
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  storage: string;
  cta: string;
  highlight?: boolean;
  badge?: string;
}

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  const plans: Plan[] = [
    {
      name: "Free Trial",
      price: "$0",
      description: "Try ScrubAI for 7 days with limited features",
      storage: "None",
      features: [
        { name: "25 light scrubs/day", included: true },
        { name: "3 GPU credits", included: true },
        { name: "Text & document processing", included: true },
        { name: "Basic image processing", included: true },
        { name: "Rewrite capability", included: false },
        { name: "Private mode", included: false },
      ],
      cta: "Start for free",
    },
    {
      name: "Student",
      price: "$7",
      description: "Special discount for students with an .edu email",
      storage: "7-day retention",
      badge: "POPULAR",
      highlight: true,
      features: [
        { name: "50 light scrubs/day", included: true },
        { name: "20 GPU credits/month", included: true },
        { name: "Rewrite Beta access", included: true },
        { name: "Text & document processing", included: true },
        { name: "Full image processing", included: true },
        { name: "Private mode", included: true },
      ],
      cta: "Get student plan",
    },
    {
      name: "Creator",
      price: "$15",
      description: "Ideal for freelancers and content creators",
      storage: "7-day retention",
      features: [
        { name: "Unlimited light scrubs", included: true },
        { name: "100 rewrites/month", included: true },
        { name: "40 GPU credits/month", included: true },
        { name: "Text & document processing", included: true },
        { name: "Full image processing", included: true },
        { name: "Private mode", included: true },
      ],
      cta: "Start creating",
    },
    {
      name: "Pro",
      price: "$30",
      description: "Perfect for small teams and agencies",
      storage: "30-day retention",
      features: [
        { name: "Unlimited light scrubs", included: true },
        { name: "400 rewrites/month", included: true },
        { name: "150 GPU credits/month", included: true },
        { name: "Priority processing", included: true },
        { name: "API access", included: true },
        { name: "Team member seats (3)", included: true },
      ],
      cta: "Go pro",
    }
  ];

  return (
    <div className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your needs. All plans include a 7-day free trial.
          </p>
          
          <div className="mt-8 inline-flex items-center p-1 bg-muted rounded-full">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly <span className="ml-1 text-xs bg-scrub-green text-white px-1.5 py-0.5 rounded-full">Save 20%</span>
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`rounded-xl border ${plan.highlight ? 'border-scrub-blue shadow-lg shadow-scrub-blue/10' : 'bg-card shadow-sm'} p-6 relative`}
            >
              {plan.badge && (
                <span className="absolute top-0 right-6 -translate-y-1/2 bg-scrub-blue text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {plan.badge}
                </span>
              )}
              <div className="mb-5">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2 mb-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-scrub-green" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-muted" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>
                      {feature.name}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-scrub-green" />
                  <span>Storage: {plan.storage}</span>
                </div>
              </div>
              
              <Button 
                className={`mt-6 w-full ${plan.highlight ? 'bg-scrub-blue hover:bg-scrub-blue-dark' : ''}`}
                variant={plan.highlight ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 border rounded-lg p-6 bg-muted/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-bold">Pay-as-you-go Credits</h3>
              <p className="text-muted-foreground">Need more flexibility? Purchase credits only when you need them.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-3 bg-card rounded-lg border shadow-sm">
                <div className="font-bold text-lg">$10</div>
                <div className="text-sm text-muted-foreground">100 credits</div>
              </div>
              <Button>Buy credits</Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "What's the difference between light scrub and rewrite?",
                a: "Light scrub removes metadata and control characters without changing the content, while rewrite uses our LLM to paraphrase the content, which is more effective against sophisticated watermarks."
              },
              {
                q: "How long do you store my uploaded files?",
                a: "By default, we don't store your files unless you're on a paid plan. With Private Mode enabled, files are only kept in memory and deleted immediately after processing."
              },
              {
                q: "What types of watermarks can ScrubAI detect?",
                a: "ScrubAI can detect and remove common AI watermarks including Unicode control characters, statistical patterns, EXIF data, and more."
              },
              {
                q: "Can I use ScrubAI for commercial purposes?",
                a: "Yes, our Creator and Pro plans are designed for commercial use, including content marketing and professional editing."
              }
            ].map((faq, idx) => (
              <div key={idx} className="border-b pb-4">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
