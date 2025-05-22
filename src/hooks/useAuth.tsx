
import { useEffect, useState, createContext, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
  }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Show toast on auth events
        if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in successfully",
            description: `Welcome${session?.user?.email ? `, ${session.user.email}` : ''}!`,
            type: "success"
          });
          
          // Log security event (in a real app, this would go to a security monitoring system)
          console.log('Security event: user_signed_in', {
            user_id: session?.user?.id,
            timestamp: new Date().toISOString(),
            method: 'password', // simplified for demo
            ip_address: 'client-side' // in real app, this would be captured server-side
          });
        } else if (event === 'SIGNED_OUT') {
          // Clear any sensitive data from memory
          sessionStorage.removeItem('tempUserData');
          
          toast({
            title: "Signed out successfully",
            description: "You have been signed out.",
            type: "success"
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password recovery initiated",
            description: "Follow the instructions in your email to reset your password.",
            type: "info"
          });
        } else if (event === 'TOKEN_REFRESHED') {
          // Silent refresh, no toast needed
          console.log('Security event: token_refreshed', {
            user_id: session?.user?.id,
            timestamp: new Date().toISOString()
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: {
          // Use PKCE flow for added security
          flowType: 'pkce'
        }
      });
      return { error };
    } catch (e) {
      const error = e as Error;
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          // Use PKCE flow for added security
          flowType: 'pkce'
        }
      });
      return { error };
    } catch (e) {
      const error = e as Error;
      return { error };
    }
  };

  const signOut = async () => {
    // Clear any cached data first
    sessionStorage.clear();
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app`,
        flowType: 'pkce', // Use PKCE flow for added security
        queryParams: {
          access_type: 'offline', // Get refresh token
          prompt: 'consent'
        }
      },
    });
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      return { error };
    } catch (e) {
      const error = e as Error;
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
