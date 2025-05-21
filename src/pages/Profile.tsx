
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Loading profile...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container max-w-4xl py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-2 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
            <UserRound className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Account Information</h3>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium text-muted-foreground">Email</span>
                <span className="col-span-2">{user.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium text-muted-foreground">User ID</span>
                <span className="col-span-2 text-sm text-muted-foreground">{user.id}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Account Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">Change Password</Button>
              <Button variant="outline" className="text-destructive hover:text-destructive">Delete Account</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Note: Account management features not fully implemented yet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
