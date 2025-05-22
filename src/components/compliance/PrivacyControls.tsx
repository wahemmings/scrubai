
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trash2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/toast/toast-helpers";
import { useNavigate } from "react-router-dom";

export const PrivacyControls = () => {
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  // Function to handle data deletion (GDPR/CCPA compliance)
  const handleDeleteAllData = async () => {
    if (!user) return;
    
    try {
      setIsDeleting(true);
      
      // Delete all related data from different tables
      // Note: These operations depend on proper RLS policies and cascade delete setup
      
      // 1. Delete jobs data
      await supabase
        .from('jobs')
        .delete()
        .eq('user_id', user.id);
      
      // 2. Delete credits data
      await supabase
        .from('credits')
        .delete()
        .eq('user_id', user.id);
      
      // 3. Delete subscription data
      await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id);
      
      // 4. Delete profile data
      await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      // 5. Finally delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      // Sign out the user
      await signOut();
      
      // Show success notification
      toast({
        title: "Account deleted successfully",
        description: "All your data has been permanently erased from our systems.",
        type: "success"
      });
      
      // Close dialog and navigate to home
      setIsDialogOpen(false);
      navigate("/");
      
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error deleting account",
        description: error?.message || "An unexpected error occurred. Please contact support.",
        type: "error",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Controls</CardTitle>
        <CardDescription>
          Manage your data privacy settings and rights under GDPR and CCPA regulations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Your Right to be Forgotten</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Under GDPR (EU) and CCPA (California) regulations, you have the right to request deletion of all your personal data.
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Erase My Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Permanently Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. It will permanently delete your account and all associated data from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                By confirming, we will:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                <li>Delete all your uploaded files</li>
                <li>Delete your processing history</li>
                <li>Remove all your personal information</li>
                <li>Cancel any active subscriptions</li>
                <li>Delete your user account</li>
              </ul>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAllData}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Permanently Delete Everything"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
