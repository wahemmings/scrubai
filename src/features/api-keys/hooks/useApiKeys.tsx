
import { useState, useCallback } from "react";
import { toast } from "@/hooks/toast/toast-helpers";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ApiKey } from "../types";

export const useApiKeys = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadApiKeys = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setApiKeys(data as ApiKey[] || []);
    } catch (error) {
      console.error("Error loading API keys:", error);
      toast({
        title: "Error loading API keys",
        description: "There was an error loading your API keys. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const toggleApiKey = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      setApiKeys(keys => keys.map(key => 
        key.id === id ? { ...key, is_active: !isActive } : key
      ));

      toast({
        title: `API key ${!isActive ? 'activated' : 'deactivated'}`,
        description: `The API key has been ${!isActive ? 'activated' : 'deactivated'} successfully.`,
        type: "success",
      });
    } catch (error) {
      console.error("Error toggling API key:", error);
      toast({
        title: "Error updating API key",
        description: "There was an error updating your API key. Please try again.",
        type: "error",
      });
    }
  };

  const revokeApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApiKeys(keys => keys.filter(key => key.id !== id));

      toast({
        title: "API key revoked",
        description: "The API key has been permanently revoked.",
        type: "success",
      });
    } catch (error) {
      console.error("Error revoking API key:", error);
      toast({
        title: "Error revoking API key",
        description: "There was an error revoking your API key. Please try again.",
        type: "error",
      });
    }
  };

  return {
    apiKeys,
    isLoading,
    loadApiKeys,
    toggleApiKey,
    revokeApiKey
  };
};
