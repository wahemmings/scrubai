
import { useState, useEffect } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const { user, signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    company: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the tab from URL query parameter
  const query = new URLSearchParams(location.search);
  const defaultTab = query.get("tab") === "signup" ? "signup" : "signin";
  const isReset = query.get("reset") === "true";

  useEffect(() => {
    if (isReset) {
      toast({
        title: "Password reset link clicked",
        description: "Please set your new password below",
      });
    }
  }, [isReset, toast]);

  // If user is already authenticated, redirect to app
  if (user) {
    return <Navigate to="/app" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        // Explicitly show error message for login failures
        console.error("Login error:", error.message);
        let errorMessage = "Invalid email or password";
        
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: errorMessage,
        });
      } else {
        navigate("/app");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitialSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both email and password.",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters.",
      });
      return;
    }
    
    // Set flag to show profile form
    setShowProfileForm(true);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate profile data
    if (!profileData.firstName || !profileData.lastName) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both first and last name.",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Call signUp with user metadata
      const { error } = await signUp(email, password);
      
      if (error) {
        console.error("Signup error:", error.message);
        
        let errorMessage = error.message;
        if (error.message.includes("already registered")) {
          errorMessage = "This email is already registered. Please sign in instead.";
        }
        
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: errorMessage,
        });
      } else {
        // Create initial credit for new user and store profile data
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Insert user profile data
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({ 
                id: user.id, 
                full_name: `${profileData.firstName} ${profileData.lastName}`,
                // Add any additional profile fields here
              });
            
            if (profileError) {
              console.error('Error creating user profile:', profileError);
            }
            
            // Add initial credits
            const { error: creditsError } = await supabase
              .from('credits')
              .insert({ user_id: user.id, amount: 5 });
            
            if (creditsError) {
              console.error('Error creating initial credits:', creditsError);
            }
          }
        } catch (err) {
          console.error('Error setting up user account:', err);
        }

        toast({
          title: "Account created successfully",
          description: "We've created your account. You may need to verify your email before signing in.",
          type: "success"
        });
        
        // Reset form and return to sign-in tab
        setShowProfileForm(false);
        setEmail("");
        setPassword("");
        setProfileData({
          firstName: "",
          lastName: "",
          company: "",
        });
      }
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(resetEmail);
      if (error) {
        toast({
          variant: "destructive",
          title: "Password reset failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Check your email for the reset link.",
        });
        setIsResetMode(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isResetMode) {
    return (
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset your password</CardTitle>
            <CardDescription className="text-center">
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input 
                  id="reset-email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => setIsResetMode(false)}
            >
              Back to sign in
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
            <CardDescription className="text-center">
              Please provide some additional information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  value={profileData.firstName} 
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  value={profileData.lastName} 
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization (Optional)</Label>
                <Input 
                  id="company" 
                  placeholder="ACME Corp" 
                  value={profileData.company} 
                  onChange={(e) => setProfileData({...profileData, company: e.target.value})} 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => setShowProfileForm(false)}
            >
              Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to ScrubAI</CardTitle>
          <CardDescription className="text-center">
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input 
                    id="signin-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input 
                    id="signin-password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto font-normal text-sm text-right w-full"
                  onClick={() => setIsResetMode(true)}
                >
                  Forgot your password?
                </Button>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleInitialSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Continue"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={signInWithGoogle}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
