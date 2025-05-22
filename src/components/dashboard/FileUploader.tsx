import { useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TextUploader from "./TextUploader";
import FileDropZone from "./FileDropZone";
import { isValidFileType, isValidFileSize, processFile } from "@/services/fileProcessor";
import config from "@/config";

interface FileUploaderProps {
  type: "text" | "document" | "image";
  onFileUploaded: (jobId: string, fileData: any) => void;
}

const FileUploader = ({ type, onFileUploaded }: FileUploaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { decrementCredits, setCurrentJob } = useAppStore();
  const { user } = useAuth();
  
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
      
      const { jobId, data } = await processFile(file, type as "document" | "image", user, setCurrentJob, decrementCredits);
      onFileUploaded(jobId, data);
    } catch (err) {
      console.error("Error processing file:", err);
      setError(`An error occurred while processing the file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // If type is text, render TextUploader
  if (type === "text") {
    return <TextUploader onFileUploaded={onFileUploaded} />;
  }
  
  // Otherwise render FileDropZone
  return (
    <FileDropZone 
      type={type as "document" | "image"} 
      isProcessing={isProcessing} 
      onFileSelected={handleFileSelected} 
      error={error} 
    />
  );
};

export default FileUploader;
