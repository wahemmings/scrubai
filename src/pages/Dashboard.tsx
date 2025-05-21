
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import FileUploader from "@/components/dashboard/FileUploader";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProcessingPanel } from "@/components/dashboard/ProcessingPanel";
import { PrivacyToggle } from "@/components/dashboard/PrivacyToggle";
import { UploadSources } from "@/components/dashboard/UploadSources";
import { FileDisplayPanel } from "@/components/dashboard/FileDisplayPanel";
import { useSubscription } from "@/hooks/useSubscription";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [processingType, setProcessingType] = useState("text");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedContent, setUploadedContent] = useState<string | File | null>(null);
  const [processingOptions, setProcessingOptions] = useState<Record<string, any>>({});
  const { refreshSubscription } = useSubscription();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);
  
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
  
  const handleOptionsChange = (options: Record<string, any>) => {
    setProcessingOptions(options);
  };
  
  const handleReset = () => {
    setFileUploaded(false);
    setUploadedContent(null);
  };
  
  const handleFileUploaded = (content: string | File) => {
    setFileUploaded(true);
    setUploadedContent(content);
  };
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-40">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <DashboardHeader />
      
      <Tabs defaultValue="text" className="w-full" onValueChange={(value) => {
        setProcessingType(value);
        handleReset();
      }}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
          </TabsList>
          
          <PrivacyToggle />
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <TabsContent value="text" className="mt-0">
                <FileUploader 
                  type="text" 
                  onFileUploaded={handleFileUploaded}
                />
              </TabsContent>
              <TabsContent value="document" className="mt-0">
                <FileUploader 
                  type="document" 
                  onFileUploaded={handleFileUploaded}
                />
              </TabsContent>
              <TabsContent value="image" className="mt-0">
                <FileUploader 
                  type="image" 
                  onFileUploaded={handleFileUploaded}
                />
              </TabsContent>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2">
            <ProcessingPanel 
              processingType={processingType as 'text' | 'document' | 'image'} 
              uploadedContent={uploadedContent}
              onReset={handleReset}
              onOptionsChange={handleOptionsChange}
            />
            
            <UploadSources />
          </div>
        </div>

        {fileUploaded && (
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            <FileDisplayPanel isOriginal={true} content={uploadedContent} />
            <FileDisplayPanel isOriginal={false} content={uploadedContent} />
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
