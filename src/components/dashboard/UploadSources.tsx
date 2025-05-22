
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop, FileCode, Box, Cloud, HardDrive } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface UploadSourcesProps {
  onSourceSelect: (source: string) => void;
}

export const UploadSources = ({ onSourceSelect }: UploadSourcesProps) => {
  const handleSourceClick = (source: string) => {
    if (source !== "laptop") {
      toast({
        title: "Feature coming soon",
        description: `${source} integration will be available in a future update.`,
        variant: "default",
      });
      return;
    }
    onSourceSelect(source);
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Source</h2>
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("laptop")}
          >
            <Laptop className="h-5 w-5" />
            <span className="text-xs">Local Device</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("google-drive")}
          >
            <Cloud className="h-5 w-5" />
            <span className="text-xs">Google Drive</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("dropbox")}
          >
            <Box className="h-5 w-5" />
            <span className="text-xs">Dropbox</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("onedrive")}
          >
            <HardDrive className="h-5 w-5" />
            <span className="text-xs">OneDrive</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("cloud-storage")}
          >
            <FileCode className="h-5 w-5" />
            <span className="text-xs">Cloud Storage</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("box")}
          >
            <Box className="h-5 w-5" />
            <span className="text-xs">Box</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
