import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Laptop, FileCloud, Box, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const HeroUploadDemo = () => {
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleUpload = (source: string) => {
    setActiveSource(source);
    setIsProcessing(true);

    // Simulate progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
        }, 500);
      }
    }, 150);
  };

  return (
    <div className="bg-white rounded-xl p-6 border shadow-md">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold">Upload a file to scrub</h3>
        <p className="text-sm text-muted-foreground">
          Remove AI watermarks and provenance data
        </p>
      </div>
      
      {!isProcessing ? (
        <>
          <div 
            className={`dropzone ${isDragging ? 'dropzone-active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleUpload("device");
            }}
            onClick={() => handleUpload("device")}
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-scrub-blue/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-scrub-blue">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <p className="font-medium">Drag & drop or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports txt, md, docx, pdf, png, jpg files up to 10MB
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-xs text-center text-muted-foreground mb-3">or choose a source</p>
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="flex flex-col items-center justify-center gap-2 py-3 h-auto" onClick={() => handleUpload("device")}>
                <Laptop className="h-5 w-5" />
                <span className="text-xs">Device</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center gap-2 py-3 h-auto" onClick={() => handleUpload("google-drive")}>
                <FileCloud className="h-5 w-5" />
                <span className="text-xs">Google Drive</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center gap-2 py-3 h-auto" onClick={() => handleUpload("dropbox")}>
                <Box className="h-5 w-5" />
                <span className="text-xs">Dropbox</span>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {!isComplete ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">example-document.pdf</p>
                  <p className="text-sm text-muted-foreground">2.4 MB</p>
                </div>
                <div className="bg-scrub-blue/10 rounded-full px-3 py-1 text-xs font-medium text-scrub-blue">
                  Processing
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Removing AI watermarks...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">example-document.pdf</p>
                  <p className="text-sm text-muted-foreground">2.4 MB</p>
                </div>
                <div className="bg-scrub-green/10 rounded-full px-3 py-1 text-xs font-medium text-scrub-green flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  <span>Clean</span>
                </div>
              </div>
              <div className="p-4 bg-scrub-green/10 rounded-lg border border-scrub-green/20 text-center">
                <div className="flex items-center justify-center gap-2 text-scrub-green font-medium mb-1">
                  <Check className="h-5 w-5" />
                  <span>No traces found!</span>
                </div>
                <p className="text-sm">Your content is now fingerprint-free</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="text-sm h-9">Copy text</Button>
                <Button className="text-sm h-9">Download</Button>
              </div>
            </>
          )}
        </div>
      )}
      
      <div className="mt-6 pt-5 border-t">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-scrub-green/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-scrub-green" />
          </div>
          <div className="mx-3 flex-1 h-px bg-scrub-green/30" />
          <div className="w-4 h-4 rounded-full bg-scrub-green/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-scrub-green" />
          </div>
          <div className="mx-3 flex-1 h-px bg-scrub-green/30" />
          <div className="w-4 h-4 rounded-full bg-scrub-green/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-scrub-green" />
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Upload</span>
          <span>Process</span>
          <span>Download</span>
        </div>
      </div>
    </div>
  );
};

export default HeroUploadDemo;
