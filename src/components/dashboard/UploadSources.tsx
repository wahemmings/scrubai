
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop, FileCode, Box } from "lucide-react";

export const UploadSources = () => {
  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Source</h2>
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="flex flex-col items-center justify-center gap-2 py-3 h-auto">
            <Laptop className="h-5 w-5" />
            <span className="text-xs">Laptop</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center gap-2 py-3 h-auto">
            <FileCode className="h-5 w-5" />
            <span className="text-xs">File Cloud</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center gap-2 py-3 h-auto">
            <Box className="h-5 w-5" />
            <span className="text-xs">Box</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
