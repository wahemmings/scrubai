
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CREDIT_COSTS } from "./ProcessingService";

interface ProcessingOptionsProps {
  type: "text" | "document" | "image";
  onChange?: (options: Record<string, any>) => void;
}

const ProcessingOptions = ({ type, onChange = () => {} }: ProcessingOptionsProps) => {
  const [options, setOptions] = useState({
    intensity: 50,
    preserveStructure: true,
    removeMetadata: true,
    aiAssisted: false,
  });

  useEffect(() => {
    onChange(options);
  }, [options, onChange]);

  const handleOptionChange = (key: string, value: any) => {
    setOptions((prev) => {
      const updated = { ...prev, [key]: value };
      onChange(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium">Credit Cost</span>
          <p className="text-xs text-muted-foreground">Credits needed to process</p>
        </div>
        <span className="font-bold">{CREDIT_COSTS[type]}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Scrubbing Intensity</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-md">{options.intensity}%</span>
        </div>
        <Slider 
          value={[options.intensity]} 
          min={10} 
          max={100} 
          step={10} 
          onValueChange={(values) => handleOptionChange("intensity", values[0])} 
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="preserve-structure" 
            checked={options.preserveStructure}
            onCheckedChange={(checked) => handleOptionChange("preserveStructure", checked)}
          />
          <label htmlFor="preserve-structure" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Preserve Structure
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remove-metadata" 
            checked={options.removeMetadata}
            onCheckedChange={(checked) => handleOptionChange("removeMetadata", checked)}
          />
          <label htmlFor="remove-metadata" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Remove Metadata
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="ai-assisted" 
            checked={options.aiAssisted}
            onCheckedChange={(checked) => handleOptionChange("aiAssisted", checked)}
          />
          <label htmlFor="ai-assisted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            AI-Assisted (uses more credits)
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOptions;
