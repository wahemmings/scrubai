import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Key, Copy, RefreshCw, AlertTriangle, Shield } from "lucide-react";
import { toast } from "@/hooks/toast/toast-helpers";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Interface for API key data
interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  last_used: string | null;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

const ApiKeys = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      loadApiKeys();
    }
  }, [user, authLoading, navigate]);

  const loadApiKeys = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user?.id);

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
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Key name required",
        description: "Please enter a name for the API key.",
        type: "error",
      });
      return;
    }

    try {
      setIsCreatingKey(true);

      // Generate a secure API key
      const fullKey = `sk_${uuidv4().replace(/-/g, '')}`;
      const keyPrefix = fullKey.substring(0, 7);
      
      // Hash the key for storage (in a real app, use a proper cryptographic hash)
      const hashedKey = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(fullKey)
      );
      const hashBase64 = btoa(
        String.fromCharCode(...new Uint8Array(hashedKey))
      );

      // Set expiry for 1 year from now
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      // Store the key in the database (only the hash and prefix)
      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user?.id,
          name: newKeyName,
          key_hash: hashBase64,
          prefix: keyPrefix,
          expires_at: expiresAt.toISOString(),
          is_active: true
        });

      if (error) throw error;

      // Show the full key to the user once (will not be accessible again)
      setNewKey(fullKey);
      setNewKeyName("");
      loadApiKeys();

    } catch (error) {
      console.error("Error creating API key:", error);
      toast({
        title: "Error creating API key",
        description: "There was an error creating your API key. Please try again.",
        type: "error",
      });
    } finally {
      setIsCreatingKey(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "API key copied to clipboard.",
          type: "success",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Could not copy API key to clipboard.",
          type: "error",
        });
      });
  };

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (authLoading || isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-40">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">API Keys</h1>
      
      <div className="grid gap-6">
        {/* Security Notice */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-700 dark:text-yellow-400">Security Notice</CardTitle>
            </div>
            <CardDescription>
              Your API keys carry many privileges. Please keep them secure and never share them in publicly accessible areas.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>API keys are encrypted in transit and at rest</li>
              <li>Keys are shown only once when created - save them securely</li>
              <li>All API requests are logged for security monitoring</li>
              <li>Rotate your keys regularly as a security best practice</li>
            </ul>
          </CardContent>
        </Card>
      
        {/* Create New Key */}
        <Card>
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
            <CardDescription>
              Generate a new API key to access the ScrubAI API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              
              {newKey && (
                <div className="p-4 border rounded bg-black text-white overflow-x-auto">
                  <div className="flex items-center justify-between">
                    <p className="font-mono">{newKey}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(newKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-yellow-400 mt-2">
                    <AlertTriangle className="h-3 w-3 inline-block mr-1" />
                    Save this key now. You won't be able to see it again!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={createApiKey}
              disabled={isCreatingKey || !newKeyName.trim()}
            >
              {isCreatingKey ? "Creating..." : "Generate API Key"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Existing Keys */}
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
      </div>
    </div>
  );
};

export default ApiKeys;
