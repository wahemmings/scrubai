
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
import FileUploader from "@/components/dashboard/FileUploader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, FilterIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [processingType, setProcessingType] = useState("text");
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
  
  if (authLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-40">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  const handleFileUploaded = (jobId: string, fileData: any) => {
    toast({
      title: "Processing complete",
      description: "Your document has been successfully processed.",
      variant: "success",
    });
    setShowUploader(false);
  };
  
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Document History</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input 
                    placeholder="Search files..." 
                    className="pl-8 w-[250px]"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <Button variant="outline" size="icon">
                  <FilterIcon className="h-4 w-4" />
                </Button>
                <Button onClick={() => setShowUploader(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Scrub
                </Button>
              </div>
            </div>

            <JobsTable jobs={jobs} isLoading={isLoadingJobs} />
          </div>
          
          <Dialog open={showUploader} onOpenChange={setShowUploader}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">New Document Scrub</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="text" className="w-full" onValueChange={(value) => {
                setProcessingType(value);
              }}>
                <TabsList className="mb-6">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="document">Documents</TabsTrigger>
                  <TabsTrigger value="image">Images</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text">
                  <FileUploader 
                    type="text" 
                    onFileUploaded={handleFileUploaded}
                  />
                </TabsContent>
                <TabsContent value="document">
                  <FileUploader 
                    type="document" 
                    onFileUploaded={handleFileUploaded}
                  /> 
                </TabsContent>
                <TabsContent value="image">
                  <FileUploader 
                    type="image" 
                    onFileUploaded={handleFileUploaded}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
