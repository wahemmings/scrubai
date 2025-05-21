
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { processContent, CREDIT_COSTS } from "./ProcessingService";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/stores/useAppStore";
import { Badge } from "@/components/ui/badge";

interface ProcessContentProps {
  type: 'text' | 'document' | 'image';
  content: string | File | null;
  options: Record<string, any>;
  onReset: () => void;
}

export const ProcessContent = ({ type, content, options, onReset }: ProcessContentProps) => {
  const { currentJob, credits } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const requiredCredits = CREDIT_COSTS[type];

  const handleStartProcessing = async () => {
    if (!content) {
      toast.error("No content to process");
      return;
    }
    
    if (credits < requiredCredits) {
      toast.error(`Insufficient credits`, {
        description: `You need ${requiredCredits} credits for this operation, but you only have ${credits} credits.`
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      const result = await processContent({
        type,
        content,
        options,
      });
      
      if (result.success) {
        toast.success("Processing completed", {
          description: result.message
        });
      } else {
        toast.error("Processing failed", {
          description: result.message
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error("Processing failed", {
        description: errorMessage
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getProgressStatus = () => {
    if (!currentJob) return null;
    
    switch (currentJob.status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'processing':
        return <Badge variant="warning">Processing</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center mb-2">
        <Button 
          className="w-full" 
          disabled={!content || isProcessing || credits < requiredCredits} 
          onClick={handleStartProcessing}
        >
          {isProcessing ? "Processing..." : `Start Processing (${requiredCredits} Credit${requiredCredits !== 1 ? 's' : ''})`}
        </Button>
      </div>
      
      {currentJob && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress</span>
            {getProgressStatus()}
          </div>
          <Progress value={currentJob.progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{currentJob.progress}%</p>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" disabled={!content || isProcessing}>
          Preview
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1" 
          disabled={isProcessing} 
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
