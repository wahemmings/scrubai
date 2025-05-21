
import { Card, CardContent } from "@/components/ui/card";
import ProcessingOptions from "@/components/dashboard/ProcessingOptions";
import { ProcessContent } from "@/components/dashboard/ProcessContent";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface ProcessingPanelProps {
  processingType: 'text' | 'document' | 'image';
  uploadedContent: string | File | null;
  onReset: () => void;
  onOptionsChange: (options: Record<string, any>) => void;
}

export const ProcessingPanel = ({
  processingType,
  uploadedContent,
  onReset,
  onOptionsChange
}: ProcessingPanelProps) => {
  const [processingOptions, setProcessingOptions] = useState<Record<string, any>>({});
  
  const handleOptionsChange = (options: Record<string, any>) => {
    setProcessingOptions(options);
    onOptionsChange(options);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Processing Options</h2>
        <ProcessingOptions 
          type={processingType} 
          onChange={handleOptionsChange} 
        />
        
        <Separator className="my-6" />
        
        <ProcessContent
          type={processingType}
          content={uploadedContent}
          options={processingOptions}
          onReset={onReset}
        />
      </CardContent>
    </Card>
  );
};
