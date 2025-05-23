
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "@/components/ui/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { JobsTable } from "@/components/dashboard/JobsTable";
import { DocumentSearchToolbar } from "@/components/dashboard/DocumentSearchToolbar";
import { UploaderDialog } from "@/components/dashboard/UploaderDialog";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [showUploader, setShowUploader] = useState(false);
  const [searchParams] = useSearchParams();
  const { refreshSubscription } = useSubscription();
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const { currentJob } = useAppStore();
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  
  useEffect(() => {
    // Check for successful subscription
    const subscriptionSuccess = searchParams.get('subscription_success');
    
    if (subscriptionSuccess === 'true') {
      toast({
        title: "Subscription Successful",
        description: "Thank you for subscribing to ScrubAI!",
        variant: "default",
      });
      refreshSubscription();
    }
  }, [searchParams, refreshSubscription]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      
      setIsLoadingJobs(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Failed to load jobs",
          description: "There was an error loading your jobs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingJobs(false);
      }
    };
    
    fetchJobs();
  }, [user, currentJob]);
  
  const handleFileUploaded = (jobId: string, fileData: any) => {
    toast({
      title: "Processing complete",
      description: "Your document has been successfully processed.",
      variant: "default",
    });
    setShowUploader(false);
  };
  
  if (authLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-40">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <DashboardHeader onNewScrub={() => setShowUploader(true)} />
          
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <DashboardOverview jobs={jobs} />
          </div>
          
          <div className="mt-8">
            <DocumentSearchToolbar onNewScrub={() => setShowUploader(true)} />
            <JobsTable jobs={jobs} isLoading={isLoadingJobs} />
          </div>
          
          <UploaderDialog 
            open={showUploader} 
            onOpenChange={setShowUploader}
            onFileUploaded={handleFileUploaded}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
