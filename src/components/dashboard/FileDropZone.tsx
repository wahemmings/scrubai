
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileType, ImageIcon } from "lucide-react";
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
  
  // Determine which icon to use based on type
  const IconComponent = type === "document" ? FileType : ImageIcon;
  
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
        className={`dropzone ${isDragging ? 'dropzone-active' : ''} min-h-[300px] transition-all bg-muted/30 dark:bg-muted/10`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin">
                <Upload className="h-12 w-12 text-scrub-blue" />
              </div>
              <p className="font-medium text-center">Processing file...</p>
              <p className="text-sm text-muted-foreground">This might take a moment</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-scrub-blue/10 rounded-full flex items-center justify-center mb-4 transition-all group-hover:bg-scrub-blue/20">
                <IconComponent className="h-8 w-8 text-scrub-blue" />
              </div>
              <p className="font-medium">Drag & drop or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                {type === "document" 
                  ? `Supports ${config.processing.supportedFormats.document.join(', ')} files up to ${config.processing.maxFileSizeMB}MB` 
                  : `Supports ${config.processing.supportedFormats.image.join(', ')} files up to ${config.processing.maxFileSizeMB}MB`}
              </p>
            </>
          )}
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
