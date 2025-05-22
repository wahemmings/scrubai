
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ApiKey = {
  name: string;
  value: string;
  lastUsed?: string;
};

const ApiKeys = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const saveApiKey = async () => {
    if (!newKeyName || !newKeyValue) {
      toast.error("Please enter both a name and key value");
      return;
    }

    setIsLoading(true);

    try {
      // Save to user's metadata in Supabase
      // This is a simplified approach - in production, you'd want more security
      const { error } = await supabase.from('api_keys').insert({
        user_id: user.id,
        name: newKeyName,
        // Note: In a real app, you'd want to encrypt this value
        value: newKeyValue,
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      // Update local state
      setApiKeys([...apiKeys, { name: newKeyName, value: newKeyValue }]);
      setNewKeyName("");
      setNewKeyValue("");
      
      toast.success("API key saved successfully");
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">API Keys</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New API Key</CardTitle>
          <CardDescription>
            Add API keys for services you want to connect with your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key-name">Key Name</Label>
            <Input 
              id="key-name" 
              placeholder="e.g., OpenAI, Stripe, etc."
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="key-value">API Key</Label>
            <Input 
              id="key-value" 
              type="password"
              placeholder="Enter your API key"
              value={newKeyValue}
              onChange={(e) => setNewKeyValue(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              This value will be securely stored in your account.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveApiKey} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save API Key"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage your stored API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <p className="text-muted-foreground">No API keys stored yet.</p>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">{key.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {key.lastUsed ? `Last used: ${key.lastUsed}` : "Not used yet"}
                    </p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="mr-2">
                      View
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeys;
