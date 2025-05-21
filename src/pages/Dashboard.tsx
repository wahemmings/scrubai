
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop, FileCode, Box } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import FileUploader from "@/components/dashboard/FileUploader";
import ProcessingOptions from "@/components/dashboard/ProcessingOptions";
import { CreditDisplay } from "@/components/dashboard/CreditDisplay";
import { ProcessContent } from "@/components/dashboard/ProcessContent";
import { useAppStore } from "@/stores/useAppStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [processingType, setProcessingType] = useState("text");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedContent, setUploadedContent] = useState<string | File | null>(null);
  const [processingOptions, setProcessingOptions] = useState<Record<string, any>>({});
  const { currentJob } = useAppStore();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);
  
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">ScrubAI Dashboard</h1>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-background text-foreground">
            Free Trial - 6 days left
          </Badge>
          <CreditDisplay />
          <Button size="sm" onClick={() => navigate("/pricing")}>Upgrade</Button>
        </div>
      </div>
      
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
          
          <div className="flex items-center">
            <label htmlFor="private-mode" className="flex items-center cursor-pointer gap-2 text-sm">
              <div className="relative">
                <input type="checkbox" id="private-mode" className="sr-only" />
                <div className="block h-6 w-11 rounded-full bg-muted"></div>
                <div className="dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition"></div>
              </div>
              <div>
                <div className="font-medium">Private Mode</div>
                <div className="text-xs text-muted-foreground">Keep files in memory only</div>
              </div>
            </label>
          </div>
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
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Processing Options</h2>
                <ProcessingOptions 
                  type={processingType as 'text' | 'document' | 'image'} 
                  onChange={handleOptionsChange} 
                />
                
                <Separator className="my-6" />
                
                <ProcessContent
                  type={processingType as 'text' | 'document' | 'image'}
                  content={uploadedContent}
                  options={processingOptions}
                  onReset={handleReset}
                />
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Upload Source</h2>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="flex flex-col items-center justify-center gap-2 py-3 h-auto">
                    <Laptop className="h-5 w-5" />
                    <span className="text-xs">Laptop</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center gap-2 py-3 h-auto">
                    <FileCode className="h-5 w-5" />
                    <span className="text-xs">File Cloud</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center gap-2 py-3 h-auto">
                    <Box className="h-5 w-5" />
                    <span className="text-xs">Box</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {fileUploaded && (
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Original</h2>
                  <Badge variant="outline">
                    {uploadedContent instanceof File 
                      ? `${Math.round(uploadedContent.size / 1024)} KB` 
                      : `${Math.round((uploadedContent?.length || 0) / 1024)} KB`}
                  </Badge>
                </div>
                <div className="min-h-[300px] border rounded-md p-4 bg-muted/30 overflow-auto">
                  {uploadedContent instanceof File ? (
                    <p className="text-muted-foreground text-center mt-32">
                      [File: {uploadedContent.name}]
                    </p>
                  ) : uploadedContent ? (
                    <pre className="text-sm whitespace-pre-wrap">{uploadedContent}</pre>
                  ) : (
                    <p className="text-muted-foreground text-center mt-32">
                      [Original content will display here]
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Scrubbed</h2>
                  <div className="flex items-center gap-2">
                    {currentJob && (
                      <Badge 
                        variant={
                          currentJob.status === 'completed' ? 'success' : 
                          currentJob.status === 'failed' ? 'destructive' : 
                          currentJob.status === 'processing' ? 'warning' : 'secondary'
                        }
                      >
                        {currentJob.status.charAt(0).toUpperCase() + currentJob.status.slice(1)}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {uploadedContent instanceof File 
                        ? `${Math.round(uploadedContent.size / 1024 * 0.95)} KB` 
                        : `${Math.round(((uploadedContent?.length || 0) * 0.95) / 1024)} KB`}
                    </Badge>
                  </div>
                </div>
                <div className="relative min-h-[300px] border rounded-md p-4 bg-muted/30 overflow-auto">
                  {currentJob && currentJob.status === 'processing' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <Progress value={currentJob.progress} className="w-full mb-4" />
                      <p className="text-sm text-muted-foreground">Processing... {currentJob.progress}%</p>
                    </div>
                  ) : currentJob && currentJob.status === 'completed' ? (
                    <pre className="text-sm whitespace-pre-wrap">
                      {/* Simulated scrubbed content */}
                      {uploadedContent instanceof File 
                        ? `[Scrubbed content for ${uploadedContent.name}]` 
                        : typeof uploadedContent === 'string'
                          ? uploadedContent.replace(/\b(?:sensitive|private|confidential)\b/gi, '[REDACTED]')
                          : '[Scrubbed content will display here]'}
                    </pre>
                  ) : (
                    <p className="text-muted-foreground text-center mt-32">
                      [Scrubbed content will display here]
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
