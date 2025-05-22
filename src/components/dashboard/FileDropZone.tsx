
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import config from "@/config";

interface FileDropZoneProps {
  type: "document" | "image";
  isProcessing: boolean;
  onFileSelected: (file: File) => void;
  error: string | null;
}

const FileDropZone = ({ type, isProcessing, onFileSelected, error }: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelected(files[0]);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };
  
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

export default FileDropZone;
