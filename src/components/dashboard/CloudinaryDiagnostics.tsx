
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { runFullDiagnostics, testEdgeFunctionClient, testEdgeFunctionDirect, testCloudinaryConfig } from "@/utils/diagnostics";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DiagnosticResultProps {
  success: boolean;
  message: string;
  details?: any;
  error?: any;
  isExpanded?: boolean;
}

const DiagnosticResult: React.FC<DiagnosticResultProps> = ({ 
  success, 
  message, 
  details, 
  error,
  isExpanded = false
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  
  return (
    <Alert className={`mb-4 ${success ? 'bg-green-50 dark:bg-green-950/30 border-green-200' : 'bg-red-50 dark:bg-red-950/30 border-red-200'}`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {success ? (
            <Check className="h-5 w-5 text-green-600 mr-2" />
          ) : (
            <X className="h-5 w-5 text-red-600 mr-2" />
          )}
          <AlertTitle className="font-semibold">{message}</AlertTitle>
        </div>
        
        {(details || error) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="ml-auto"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        )}
      </div>
      
      {expanded && (details || error) && (
        <AlertDescription className="mt-4">
          {details && (
            <div className="bg-background p-3 rounded-md my-2">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-md my-2 border border-red-200">
              <h4 className="text-sm font-medium mb-1">Error Details:</h4>
              <pre className="text-xs overflow-auto whitespace-pre-wrap text-red-600">
                {typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error)}
              </pre>
            </div>
          )}
        </AlertDescription>
      )}
    </Alert>
  );
};

interface CloudinaryDiagnosticsProps {
  user: any;
  onClose?: () => void;
}

const CloudinaryDiagnostics: React.FC<CloudinaryDiagnosticsProps> = ({ user, onClose }) => {
  const [results, setResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  const handleRunTest = async (testType: string) => {
    if (!user) {
      toast.error("You need to be logged in to run diagnostics");
      return;
    }
    
    setIsRunning(true);
    try {
      let testResult;
      
      switch (testType) {
        case "edgeFunctionClient":
          testResult = await testEdgeFunctionClient(user);
          setResults({ edgeFunctionClient: testResult });
          break;
        case "edgeFunctionDirect":
          testResult = await testEdgeFunctionDirect(user);
          setResults({ edgeFunctionDirect: testResult });
          break;
        case "cloudinaryConfig":
          testResult = testCloudinaryConfig();
          setResults({ cloudinaryConfig: testResult });
          break;
        case "full":
          const fullResults = await runFullDiagnostics(user);
          setResults(fullResults);
          break;
        default:
          toast.error("Unknown test type");
      }
    } catch (error) {
      toast.error("Error running diagnostics", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setResults(null); // Clear results when changing tabs
  };
  
  const getSummaryStatus = () => {
    if (!results) return null;
    
    const allTests = Object.values(results) as DiagnosticResultProps[];
    const passedTests = allTests.filter(test => test.success).length;
    
    return {
      total: allTests.length,
      passed: passedTests,
      success: passedTests === allTests.length
    };
  };
  
  const summaryStatus = getSummaryStatus();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cloudinary Connection Diagnostics</CardTitle>
            <CardDescription>
              Test your Cloudinary integration and identify issues
            </CardDescription>
          </div>
          {summaryStatus && (
            <Badge variant={summaryStatus.success ? "outline" : "destructive"}>
              {summaryStatus.passed}/{summaryStatus.total} Tests Passed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Tests</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Diagnostics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Run these individual tests to check specific components of your Cloudinary integration.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3">
                <Button 
                  onClick={() => handleRunTest("cloudinaryConfig")} 
                  disabled={isRunning}
                  className="flex-col h-auto py-4"
                >
                  <span className="font-semibold">Check Configuration</span>
                  <span className="text-xs mt-1 text-muted">Verify Cloudinary settings</span>
                </Button>
                
                <Button 
                  onClick={() => handleRunTest("edgeFunctionClient")} 
                  disabled={isRunning}
                  className="flex-col h-auto py-4"
                  variant="outline"
                >
                  <span className="font-semibold">Test Edge Function</span>
                  <span className="text-xs mt-1 text-muted">Via Supabase client</span>
                </Button>
                
                <Button 
                  onClick={() => handleRunTest("edgeFunctionDirect")} 
                  disabled={isRunning}
                  className="flex-col h-auto py-4"
                  variant="outline"
                >
                  <span className="font-semibold">Test Direct Connection</span>
                  <span className="text-xs mt-1 text-muted">Direct API call</span>
                </Button>
              </div>
              
              {results && Object.keys(results).length === 1 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
                  {Object.entries(results).map(([key, result]: [string, any]) => (
                    <DiagnosticResult 
                      key={key}
                      success={result.success}
                      message={result.message}
                      details={result.details}
                      error={result.error}
                      isExpanded={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Run a comprehensive diagnostic suite to test all aspects of your Cloudinary integration.
                </p>
                <Button 
                  onClick={() => handleRunTest("full")} 
                  disabled={isRunning}
                  className="flex items-center"
                >
                  {isRunning ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  )}
                  Run Full Diagnostics
                </Button>
              </div>
              
              {results && Object.keys(results).length > 1 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Diagnostic Results:</h3>
                  <ScrollArea className="h-[400px] pr-4">
                    <Accordion type="single" collapsible defaultValue="supabase">
                      <AccordionItem value="supabase">
                        <AccordionTrigger className="flex items-center">
                          <div className="flex items-center">
                            {results.supabase.success ? (
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-600 mr-2" />
                            )}
                            <span>Supabase Connection</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <DiagnosticResult 
                            success={results.supabase.success}
                            message={results.supabase.message}
                            details={results.supabase.details}
                            error={results.supabase.error}
                          />
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="cloudinaryConfig">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            {results.cloudinaryConfig.success ? (
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-600 mr-2" />
                            )}
                            <span>Cloudinary Configuration</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <DiagnosticResult 
                            success={results.cloudinaryConfig.success}
                            message={results.cloudinaryConfig.message}
                            details={results.cloudinaryConfig.details}
                            error={results.cloudinaryConfig.error}
                          />
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="edgeFunctionClient">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            {results.edgeFunctionClient.success ? (
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-600 mr-2" />
                            )}
                            <span>Edge Function (Supabase Client)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <DiagnosticResult 
                            success={results.edgeFunctionClient.success}
                            message={results.edgeFunctionClient.message}
                            details={results.edgeFunctionClient.details}
                            error={results.edgeFunctionClient.error}
                          />
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="edgeFunctionDirect">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            {results.edgeFunctionDirect.success ? (
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-600 mr-2" />
                            )}
                            <span>Edge Function (Direct Call)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <DiagnosticResult 
                            success={results.edgeFunctionDirect.success}
                            message={results.edgeFunctionDirect.message}
                            details={results.edgeFunctionDirect.details}
                            error={results.edgeFunctionDirect.error}
                          />
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="cloudinaryDirectUpload">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            {results.cloudinaryDirectUpload.success ? (
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-600 mr-2" />
                            )}
                            <span>Cloudinary Direct Upload</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <DiagnosticResult 
                            success={results.cloudinaryDirectUpload.success}
                            message={results.cloudinaryDirectUpload.message}
                            details={results.cloudinaryDirectUpload.details}
                            error={results.cloudinaryDirectUpload.error}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </ScrollArea>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CloudinaryDiagnostics;
