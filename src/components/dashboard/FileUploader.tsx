
import { useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TextUploader from "./TextUploader";
import FileDropZone from "./FileDropZone";
import { UploadSources } from "./UploadSources";
import { isValidFileType, isValidFileSize, processFile } from "@/services/fileProcessor";
import config from "@/config";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import useJobProgress from "@/hooks/useJobProgress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FileUploaderProps {
  type: "text" | "document" | "image";
  onFileUploaded: (jobId: string, fileData: any) => void;
}

const FileUploader = ({ type, onFileUploaded }: FileUploaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSourceSelector, setShowSourceSelector] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  
  const { decrementCredits, setCurrentJob } = useAppStore();
  const { user } = useAuth();
  
  // Use the job progress hook to track upload progress
  const { progress, status } = useJobProgress({ 
    jobId: jobId || undefined,
    onComplete: (completedJobId) => {
      toast({
        title: "Upload complete",
        description: "Your file has been processed successfully.",
        variant: "success",
      });
      if (jobId) {
        onFileUploaded(jobId, { success: true });
      }
    },
    onFail: (failedJobId, errorMessage) => {
      toast({
        title: "Upload failed",
        description: errorMessage || "An error occurred during processing.",
        variant: "destructive",
      });
      setError(errorMessage || "Processing failed");
      setIsProcessing(false);
    }
  });
  
  const handleSourceSelect = (source: string) => {
    setSelectedSource(source);
    setShowSourceSelector(false);
    // Only "laptop" is actually implemented, others are placeholders
    if (source !== "laptop") {
      toast({
        title: "Coming soon",
        description: `${source} integration will be available in a future update.`,
        variant: "default",
      });
      // Revert to file dropzone for now
      setSelectedSource("laptop");
    }
  };
  
  const handleFileSelected = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      if (!isValidFileType(file, type)) {
        setError(`Invalid file type. Supported formats for ${type}: ${config.processing.supportedFormats[type].join(', ')}`);
        setIsProcessing(false);
        return;
      }
      
      if (!isValidFileSize(file)) {
        setError(`File size exceeds the maximum limit of ${config.processing.maxFileSizeMB}MB`);
        setIsProcessing(false);
        return;
      }
      
      toast({
        title: "Processing started",
        description: "Your file is being processed. Please wait...",
      });
      
      const result = await processFile(file, type as "document" | "image", user, setCurrentJob, decrementCredits);
      setJobId(result.jobId);
      
      // If process completes without progress tracking
      if (!jobId && !error) {
        onFileUploaded(result.jobId, result.data);
      }
    } catch (err) {
      console.error("Error processing file:", err);
      setError(`An error occurred while processing the file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      toast({
        title: "Error",
        description: `Failed to process file: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      if (!jobId) {
        setIsProcessing(false);
      }
    }
  };
  
  const handleReset = () => {
    setShowSourceSelector(true);
    setSelectedSource(null);
    setError(null);
    setIsProcessing(false);
    setJobId(null);
  };
  
  // If type is text, render TextUploader
  if (type === "text") {
    return <TextUploader onFileUploaded={onFileUploaded} />;
  }
  
  // Show upload sources selector
  if (showSourceSelector) {
    return <UploadSources onSourceSelect={handleSourceSelect} />;
  }
  
  // Otherwise render FileDropZone
  return (
    <div className="space-y-4">
      <FileDropZone 
        type={type as "document" | "image"} 
        isProcessing={isProcessing} 
        onFileSelected={handleFileSelected} 
        error={error} 
      />
      
      {isProcessing && (
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Processing</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">{status === 'processing' ? 'Your file is being processed...' : status}</p>
        </div>
      )}
      
      <button 
        className="text-sm text-muted-foreground hover:text-foreground mt-2"
        onClick={handleReset}
      >
        ← Back to upload sources
      </button>
    </div>
  );
};

export default FileUploader;
