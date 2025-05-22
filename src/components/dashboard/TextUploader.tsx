
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { v4 as uuidv4 } from "uuid";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "@/components/ui/use-toast";
import { markUploadStart } from "@/services/instrumentation";

interface TextUploaderProps {
  onFileUploaded: (jobId: string, fileData: any) => void;
}

const TextUploader = ({ onFileUploaded }: TextUploaderProps) => {
  const [fileContent, setFileContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { decrementCredits, setCurrentJob } = useAppStore();
  
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
};

export default TextUploader;
