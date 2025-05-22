
import { Button } from "@/components/ui/button";
import { CreditDisplay } from "@/components/dashboard/CreditDisplay";
import { SubscriptionBadge } from "@/components/dashboard/SubscriptionBadge";
import { useSubscription } from "@/hooks/useSubscription";
import { BellIcon, PlusIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  onNewScrub?: () => void;
}

export const DashboardHeader = ({ onNewScrub }: DashboardHeaderProps) => {
  const { subscription, isLoading } = useSubscription();
  const { user } = useAuth();
  
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-3">
        <CreditDisplay />
        <SubscriptionBadge 
          subscription={subscription} 
          isLoading={isLoading} 
        />
        <Button variant="outline" size="icon" className="rounded-full">
          <BellIcon className="h-4 w-4" />
        </Button>
        <Button onClick={onNewScrub}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Scrub
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
