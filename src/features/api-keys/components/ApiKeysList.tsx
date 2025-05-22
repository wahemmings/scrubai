
import { useState, useEffect } from "react";
import { Key } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/toast/toast-helpers";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useApiKeys } from "../hooks/useApiKeys";
import { ApiKey } from "../types";

export const ApiKeysList = () => {
  const { user } = useAuth();
  const { apiKeys, isLoading, toggleApiKey, revokeApiKey, loadApiKeys } = useApiKeys();

  useEffect(() => {
    if (user) {
      loadApiKeys();
    }
  }, [user, loadApiKeys]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading your API keys...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your API Keys</CardTitle>
        <CardDescription>
          Manage your existing API keys
        </CardDescription>
      </CardHeader>
      <CardContent>
        {apiKeys.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            You haven't created any API keys yet.
          </div>
        ) : (
          <div className="space-y-6">
            {apiKeys.map((key) => (
              <div key={key.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center">
                      <Key className="h-3 w-3 mr-1" />
                      {key.prefix}•••••••••••••••••
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={key.is_active} 
                        onCheckedChange={() => toggleApiKey(key.id, key.is_active)} 
                        id={`toggle-${key.id}`}
                      />
                      <Label htmlFor={`toggle-${key.id}`} className="text-sm">
                        {key.is_active ? "Active" : "Inactive"}
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p>{formatDate(key.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expires</p>
                    <p>{formatDate(key.expires_at)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Used</p>
                    <p>{key.last_used ? formatDate(key.last_used) : "Never"}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeApiKey(key.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
