
import { useState } from "react";
import { Copy, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/toast/toast-helpers";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from "uuid";

export const CreateApiKeyCard = () => {
  const { user } = useAuth();
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);

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

  return (
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
  );
};
