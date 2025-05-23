
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { getCloudinaryConfig, isCloudinaryEnabled } from "@/integrations/cloudinary/config";
import { diagnoseCloudinayConfiguration, testDirectCloudinaryAccess } from "@/integrations/cloudinary/diagnostics";
import { testCloudinaryConnection, uploadTestFile } from "@/utils/cloudinary/testUpload";

export function CloudinaryDiagnostics() {
  const [user, setUser] = useState<any>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [directTestResult, setDirectTestResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isDirectTestRunning, setIsDirectTestRunning] = useState(false);
  
  // Get the current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);
  
  // Get basic config info
  const config = getCloudinaryConfig();
  
  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const result = await diagnoseCloudinayConfiguration();
      setDiagnosisResult(result);
    } catch (error) {
      setDiagnosisResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsRunning(false);
    }
  };
  
  const runDirectTest = async () => {
    setIsDirectTestRunning(true);
    try {
      const result = await testDirectCloudinaryAccess();
      setDirectTestResult(result);
    } catch (error) {
      setDirectTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsDirectTestRunning(false);
    }
  };
  
  const runConnectionTest = async () => {
    if (user) {
      await testCloudinaryConnection(user);
    }
  };
  
  const runUploadTest = async () => {
    if (user) {
      await uploadTestFile(user);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cloudinary Diagnostics</CardTitle>
        <CardDescription>Troubleshoot your Cloudinary connection issues</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h3 className="text-lg font-medium">Basic Configuration</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Cloud Name:</div>
            <div>{config.cloudName || 'Not set'}</div>
            
            <div className="font-medium">Upload Preset:</div>
            <div>{config.uploadPreset || 'Not set'}</div>
            
            <div className="font-medium">Status:</div>
            <div>{isCloudinaryEnabled() ? '✅ Enabled' : '❌ Disabled'}</div>
            
            <div className="font-medium">Authenticated:</div>
            <div>{user ? '✅ Yes' : '❌ No'}</div>
          </div>
        </section>
        
        {diagnosisResult && (
          <Alert className={diagnosisResult.error ? 'bg-red-50' : 'bg-green-50'}>
            <AlertTitle>
              {diagnosisResult.error ? 'Diagnosis Failed' : 'Diagnosis Results'}
            </AlertTitle>
            <AlertDescription>
              <pre className="mt-2 w-full overflow-auto text-xs p-2 rounded bg-slate-100">
                {JSON.stringify(diagnosisResult, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}
        
        {directTestResult && (
          <Alert className={directTestResult.success ? 'bg-green-50' : 'bg-red-50'}>
            <AlertTitle>
              {directTestResult.success ? 'Direct Test Successful' : 'Direct Test Failed'}
            </AlertTitle>
            <AlertDescription>
              <pre className="mt-2 w-full overflow-auto text-xs p-2 rounded bg-slate-100">
                {JSON.stringify(directTestResult, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-3">
        <Button onClick={runDiagnostics} disabled={isRunning}>
          {isRunning ? 'Running Diagnostics...' : 'Run Full Diagnostics'}
        </Button>
        
        <Button variant="outline" onClick={runDirectTest} disabled={isDirectTestRunning}>
          {isDirectTestRunning ? 'Testing...' : 'Test Direct Access'}
        </Button>
        
        <Button variant="secondary" onClick={runConnectionTest} disabled={!user}>
          Test Edge Function
        </Button>
        
        <Button variant="secondary" onClick={runUploadTest} disabled={!user}>
          Test Upload
        </Button>
      </CardFooter>
    </Card>
  );
}
