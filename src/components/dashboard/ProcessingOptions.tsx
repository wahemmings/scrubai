
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ProcessingOptionsProps {
  type: string;
}

const ProcessingOptions = ({ type }: ProcessingOptionsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Cleaning Method</h3>
        <RadioGroup defaultValue="light" className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light" className="cursor-pointer flex flex-col">
              <span>Light Scrub</span>
              <span className="text-xs text-muted-foreground">Metadata & control characters</span>
            </Label>
          </div>
          
          {(type === "text" || type === "document") && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rewrite" id="rewrite" />
              <Label htmlFor="rewrite" className="cursor-pointer flex flex-col">
                <span>Rewrite</span>
                <span className="text-xs text-muted-foreground">LLM paraphrase (5 credits)</span>
              </Label>
            </div>
          )}
          
          {type === "image" && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="repaint" id="repaint" />
              <Label htmlFor="repaint" className="cursor-pointer flex flex-col">
                <span>Repaint</span>
                <span className="text-xs text-muted-foreground">Pixel-level noise (3 credits)</span>
              </Label>
            </div>
          )}
        </RadioGroup>
      </div>
      
      {(type === "text" || type === "document") && (
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Preservation Level</h3>
            <span className="text-sm text-muted-foreground">Medium</span>
          </div>
          <Slider defaultValue={[50]} max={100} step={1} />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>More changes</span>
            <span>Exact match</span>
          </div>
        </div>
      )}
      
      {type === "image" && (
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Detection Sensitivity</h3>
            <span className="text-sm text-muted-foreground">Medium</span>
          </div>
          <Slider defaultValue={[60]} max={100} step={1} />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Basic</span>
            <span>Aggressive</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingOptions;
