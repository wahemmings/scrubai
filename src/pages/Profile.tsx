import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { UserRound, CreditCard, Calendar, Hourglass, Shield } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PrivacyControls } from "@/components/compliance/PrivacyControls";

type ProfileData = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

type CreditData = {
  amount: number;
};

type SubscriptionData = {
  plan_type: string;
  status: string;
  current_period_end: string | null;
};

type JobData = {
  id: string;
  job_type: string;
  status: string;
  file_name: string | null;
  created_at: string;
};

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [creditData, setCreditData] = useState<CreditData | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [recentJobs, setRecentJobs] = useState<JobData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setIsLoadingData(true);
      
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfileData(profileData);
        }

        // Fetch credits data
        const { data: creditData, error: creditError } = await supabase
          .from('credits')
          .select('amount')
          .eq('user_id', user.id)
          .maybeSingle();

        if (creditError) {
          console.error('Error fetching credits:', creditError);
        } else {
          setCreditData(creditData);
        }

        // Fetch subscription data
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('plan_type, status, current_period_end')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subscriptionError) {
          console.error('Error fetching subscription:', subscriptionError);
        } else {
          setSubscriptionData(subscriptionData);
        }

        // Fetch recent jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('id, job_type, status, file_name, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
        } else {
          setRecentJobs(jobsData || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: "Could not load your profile data. Please try again later."
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, toast]);

  if (isLoading || isLoadingData) {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getPlanBadgeColor = (plan: string | null) => {
    if (!plan) return "secondary";
    switch (plan.toLowerCase()) {
      case 'free': return "secondary";
      case 'basic': return "primary";
      case 'pro': return "default";
      case 'enterprise': return "destructive";
      default: return "secondary";
    }
  };

  const getStatusBadgeColor = (status: string | null) => {
    if (!status) return "secondary";
    switch (status.toLowerCase()) {
      case 'active': return "success";
      case 'trialing': return "warning";
      case 'past_due': return "destructive";
      case 'canceled': return "secondary";
      default: return "secondary";
    }
  };

  const getJobStatusBadgeColor = (status: string | null) => {
    if (!status) return "secondary";
    switch (status.toLowerCase()) {
      case 'completed': return "success";
      case 'processing': return "warning";
      case 'pending': return "secondary";
      case 'failed': return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="grid gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <UserRound className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="mt-1">{profileData?.full_name || 'Not set'}</p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button variant="outline">Update Profile</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Your current plan and credits</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
                  <div className="mt-1">
                    {subscriptionData ? (
                      <Badge variant={getPlanBadgeColor(subscriptionData.plan_type)}>
                        {subscriptionData.plan_type || 'Free'}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Free</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">
                    {subscriptionData ? (
                      <Badge variant={getStatusBadgeColor(subscriptionData.status)}>
                        {subscriptionData.status || 'Inactive'}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credits</p>
                  <p className="mt-1 font-medium text-xl">{creditData?.amount || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Renewal Date</p>
                  <p className="mt-1">{subscriptionData?.current_period_end ? formatDate(subscriptionData.current_period_end) : 'N/A'}</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-2 justify-end">
                <Button variant="outline">Add Credits</Button>
                <Button>Upgrade Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Hourglass className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>Your latest processing jobs</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recentJobs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        {job.file_name || job.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>{job.job_type}</TableCell>
                      <TableCell>
                        <Badge variant={getJobStatusBadgeColor(job.status)}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(job.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No jobs found. Start processing content to see your history here.
              </div>
            )}
            {recentJobs.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm">View All Jobs</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security & Compliance Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Security & Compliance</CardTitle>
                <CardDescription>Privacy and security settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PrivacyControls />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
