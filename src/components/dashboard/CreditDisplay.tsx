
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/stores/useAppStore";
import { CreditCard } from "lucide-react";

export const CreditDisplay = () => {
  const { user } = useAuth();
  const { credits, setCredits } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('credits')
          .select('amount')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching credits:', error);
          return;
        }
        
        if (data) {
          setCredits(data.amount);
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCredits();
    
    // Subscribe to credit changes
    const subscription = supabase
      .channel('credits_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'credits', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          if (payload.new && typeof payload.new.amount === 'number') {
            setCredits(payload.new.amount);
          }
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, setCredits]);

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-background text-foreground flex items-center gap-1">
        <CreditCard className="h-3 w-3" />
        Credits: {isLoading ? "..." : credits}
      </Badge>
    </div>
  );
};
