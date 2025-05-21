
import { useState, useRef } from "react";
import { useAppStore } from "@/stores/useAppStore";
import config from "@/config";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  type: "text" | "document" | "image";
  onFileUploaded: (jobId: string, fileData: any) => void;
}

const FileUploader = ({ type, onFileUploaded }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { decrementCredits, setCurrentJob } = useAppStore();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const isValidFileType = (file: File) => {
    const supportedFormats = config.processing.supportedFormats[type];
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    return supportedFormats.includes(fileExt);
  };
  
  const isValidFileSize = (file: File) => {
    return file.size <= config.processing.maxFileSizeMB * 1024 * 1024;
  };
  
  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      if (!isValidFileType(file)) {
        setError(`Invalid file type. Supported formats for ${type}: ${config.processing.supportedFormats[type].join(', ')}`);
        return;
      }
      
      if (!isValidFileSize(file)) {
        setError(`File size exceeds the maximum limit of ${config.processing.maxFileSizeMB}MB`);
        return;
      }
      
      // Generate a unique job ID
      const jobId = uuidv4();
      
      // Create a job entry in our store
      setCurrentJob({
        id: jobId,
        progress: 0,
        status: 'pending',
        message: 'Preparing to process...'
      });
      
      // For text and small documents, use WebAssembly processing (client-first approach)
      if (type === "text" || (type === "document" && file.size < 1 * 1024 * 1024)) {
        if (config.features.enableWebAssembly) {
          // In a real implementation, we would load and use a WebAssembly module here
          // For now, we'll simulate processing with a timeout
          setTimeout(() => {
            decrementCredits(1);
            onFileUploaded(jobId, { fileName: file.name, fileSize: file.size });
            setIsProcessing(false);
          }, 800);
        } else {
          // Fall back to server processing if WebAssembly is disabled
          uploadToServer(file, jobId);
        }
      } else {
        // For larger files or images, use server processing
        uploadToServer(file, jobId);
      }
    } catch (err) {
      console.error("Error processing file:", err);
      setError("An error occurred while processing the file. Please try again.");
      setIsProcessing(false);
    }
  };
  
  const uploadToServer = async (file: File, jobId: string) => {
    try {
      // In a real implementation, we would upload the file to our server
      // For now, we'll simulate uploading with a timeout
      toast({
        title: "Processing larger file",
        description: "Your file is being processed on our secure servers."
      });
      
      setTimeout(() => {
        decrementCredits(type === "image" ? 2 : 1); // Images cost more credits
        onFileUploaded(jobId, { fileName: file.name, fileSize: file.size });
        setIsProcessing(false);
      }, 1500);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("An error occurred while uploading the file. Please try again.");
      setIsProcessing(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value);
  };
  
  const handleTextSubmit = () => {
    if (fileContent.trim()) {
      setIsProcessing(true);
      
      // Generate a unique job ID
      const jobId = uuidv4();
      
      // Create a job entry in our store
      setCurrentJob({
        id: jobId,
        progress: 0,
        status: 'pending',
        message: 'Preparing to process text...'
      });
      
      // Process text (client-side for small content)
      setTimeout(() => {
        decrementCredits(1);
        onFileUploaded(jobId, { text: fileContent });
        setIsProcessing(false);
      }, 800);
    } else {
      setError("Please enter or paste some text before submitting.");
    }
  };
  
  if (type === "text") {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Enter or paste text</h2>
        <textarea 
          className="w-full min-h-[300px] p-3 border rounded-md resize-y" 
          placeholder="Enter or paste the text you want to scrub here..."
          onChange={handleTextChange}
          value={fileContent}
          disabled={isProcessing}
        ></textarea>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleTextSubmit} 
          disabled={isProcessing || !fileContent.trim()}
          className="w-full"
        >
          {isProcessing ? "Processing..." : "Process Text"}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Upload {type === "document" ? "document" : "image"}
      </h2>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept={config.processing.supportedFormats[type].join(",")}
        disabled={isProcessing}
      />
      
      <div 
        className={`dropzone ${isDragging ? 'dropzone-active' : ''} min-h-[300px]`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 bg-scrub-blue/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-scrub-blue">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <p className="font-medium">{isProcessing ? "Processing file..." : "Drag & drop or click to upload"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {type === "document" 
              ? `Supports ${config.processing.supportedFormats.document.join(', ')} files up to ${config.processing.maxFileSizeMB}MB` 
              : `Supports ${config.processing.supportedFormats.image.join(', ')} files up to ${config.processing.maxFileSizeMB}MB`}
          </p>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUploader;
