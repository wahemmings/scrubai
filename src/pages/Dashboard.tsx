import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop, FileCode, Box } from "lucide-react";
import FileUploader from "@/components/dashboard/FileUploader";
import ProcessingOptions from "@/components/dashboard/ProcessingOptions";

const Dashboard = () => {
  const [processingType, setProcessingType] = useState("text");
  const [fileUploaded, setFileUploaded] = useState(false);
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">ScrubAI Dashboard</h1>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-background text-foreground">
            Free Trial - 6 days left
          </Badge>
          <Badge variant="outline" className="bg-background text-foreground">
            Credits: 22
          </Badge>
          <Button size="sm">Upgrade</Button>
        </div>
      </div>
      
      <Tabs defaultValue="text" className="w-full" onValueChange={setProcessingType}>
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
                  onFileUploaded={() => setFileUploaded(true)}
                />
              </TabsContent>
              <TabsContent value="document" className="mt-0">
                <FileUploader 
                  type="document" 
                  onFileUploaded={() => setFileUploaded(true)}
                />
              </TabsContent>
              <TabsContent value="image" className="mt-0">
                <FileUploader 
                  type="image" 
                  onFileUploaded={() => setFileUploaded(true)}
                />
              </TabsContent>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Processing Options</h2>
                <ProcessingOptions type={processingType} />
                
                <Separator className="my-6" />
                
                <div className="space-y-3">
                  <Button className="w-full" disabled={!fileUploaded}>
                    Start Processing
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" disabled={!fileUploaded}>
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" disabled={!fileUploaded}>
                      Reset
                    </Button>
                  </div>
                </div>
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
                  <Badge variant="outline">3.2 KB</Badge>
                </div>
                <div className="min-h-[300px] border rounded-md p-4 bg-muted/30">
                  <p className="text-muted-foreground text-center mt-32">
                    [Original content will display here]
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Scrubbed</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-scrub-amber/10 text-scrub-amber border-scrub-amber/20">Processing</Badge>
                    <Badge variant="outline">3.1 KB</Badge>
                  </div>
                </div>
                <div className="relative min-h-[300px] border rounded-md p-4 bg-muted/30">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <Progress value={35} className="w-full mb-4" />
                    <p className="text-sm text-muted-foreground">Processing... 35%</p>
                  </div>
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
