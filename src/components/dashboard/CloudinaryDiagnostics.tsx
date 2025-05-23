import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { getCloudinaryConfig, isCloudinaryEnabled } from "@/integrations/cloudinary/config";
import { diagnoseCloudinayConfiguration, testDirectCloudinaryAccess } from "@/integrations/cloudinary/diagnostics";
import { testCloudinaryConnection, uploadTestFile } from "@/utils/cloudinaryTest";
import { testSignatureGeneration } from "@/utils/cloudinary/signatureTest";
import { fullCloudinaryDiagnostics } from "@/utils/cloudinary/fullDiagnostics";

interface CloudinaryDiagnosticsProps {
  user?: any;
}

export function CloudinaryDiagnostics({ user: initialUser }: CloudinaryDiagnosticsProps) {
  const [user, setUser] = useState<any>(initialUser || null);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [directTestResult, setDirectTestResult] = useState<any>(null);
  const [signatureTestResult, setSignatureTestResult] = useState<any>(null);
  const [fullDiagnosticsResult, setFullDiagnosticsResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isDirectTestRunning, setIsDirectTestRunning] = useState(false);
  const [isSignatureTestRunning, setIsSignatureTestRunning] = useState(false);
  const [isFullDiagnosticsRunning, setIsFullDiagnosticsRunning] = useState(false);
  
  // Get the current user if not provided as prop
  useEffect(() => {
    if (!initialUser) {
      const getUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      };
      getUser();
    }
  }, [initialUser]);
  
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

  const runSignatureTest = async () => {
    if (!user) return;
    
    setIsSignatureTestRunning(true);
    try {
      const result = await testSignatureGeneration(user);
      setSignatureTestResult(result);
    } catch (error) {
      setSignatureTestResult({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      });
    } finally {
      setIsSignatureTestRunning(false);
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
  
  const runFullDiagnostics = async () => {
    if (!user) return;
    
    setIsFullDiagnosticsRunning(true);
    try {
      const result = await fullCloudinaryDiagnostics(user);
      setFullDiagnosticsResult(result);
    } catch (error) {
      setFullDiagnosticsResult({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      });
    } finally {
      setIsFullDiagnosticsRunning(false);
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
            
            <div className="font-medium">API Key:</div>
            <div>{config.apiKey ? '✅ Set' : '❌ Not set'}</div>
            
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

        {signatureTestResult && (
          <Alert className={signatureTestResult.validationResult?.wouldPassNewValidation ? 'bg-green-50' : 'bg-red-50'}>
            <AlertTitle>
              {signatureTestResult.validationResult?.wouldPassNewValidation ? 'Signature Test Passed' : 'Signature Test Failed'}
            </AlertTitle>
            <AlertDescription>
              <pre className="mt-2 w-full overflow-auto text-xs p-2 rounded bg-slate-100">
                {JSON.stringify(signatureTestResult, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}

        {fullDiagnosticsResult && (
          <Alert className={fullDiagnosticsResult.success ? 'bg-blue-50' : 'bg-red-50'}>
            <AlertTitle>
              Advanced Diagnostics Results
            </AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-2">
                {fullDiagnosticsResult.success ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="font-medium">Client Config:</div>
                      <div>{fullDiagnosticsResult.clientConfig?.cloudName !== "MISSING" ? '✅ OK' : '❌ Missing'}</div>
                      
                      <div className="font-medium">Authentication:</div>
                      <div>{fullDiagnosticsResult.authStatus?.authenticated ? '✅ OK' : '❌ Failed'}</div>
                      
                      <div className="font-medium">Edge Function:</div>
                      <div>{fullDiagnosticsResult.edgeFunction?.status === 200 ? '✅ Responded' : '❌ Failed'}</div>
                      
                      <div className="font-medium">api_key Present:</div>
                      <div>{fullDiagnosticsResult.validation?.api_keyPresent ? '✅ Yes' : '❌ No'}</div>
                      
                      <div className="font-medium">apiKey Present:</div>
                      <div>{fullDiagnosticsResult.validation?.apiKeyPresent ? '✅ Yes' : '❌ No'}</div>
                      
                      <div className="font-medium">Validation Result:</div>
                      <div>{fullDiagnosticsResult.validation?.newValidation ? '✅ Passes' : '❌ Fails'}</div>
                    </div>
                    
                    <h4 className="font-medium mt-2">Response Structure:</h4>
                    <pre className="w-full overflow-auto text-xs p-2 rounded bg-slate-100">
                      {JSON.stringify(fullDiagnosticsResult.rawResponse, null, 2)}
                    </pre>
                  </>
                ) : (
                  <pre className="w-full overflow-auto text-xs p-2 rounded bg-slate-100">
                    {JSON.stringify(fullDiagnosticsResult, null, 2)}
                  </pre>
                )}
              </div>
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
        
        <Button variant="secondary" onClick={runSignatureTest} disabled={!user || isSignatureTestRunning}>
          {isSignatureTestRunning ? 'Testing Signature...' : 'Test Signature Fix'}
        </Button>
        
        <Button variant="secondary" onClick={runUploadTest} disabled={!user}>
          Test Upload
        </Button>
        
        <Button variant="destructive" onClick={runFullDiagnostics} disabled={!user || isFullDiagnosticsRunning}>
          {isFullDiagnosticsRunning ? 'Running Advanced Diagnostics...' : 'Run Advanced Diagnostics'}
        </Button>
      </CardFooter>
    </Card>
  );
}

