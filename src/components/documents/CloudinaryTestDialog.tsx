
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CloudinaryDiagnostics } from "@/components/dashboard/CloudinaryDiagnostics";

interface CloudinaryTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTestConnection: () => void;
  onUploadTestFile: () => void;
  cloudinaryEnabled: boolean;
  user: any;
}

const CloudinaryTestDialog: React.FC<CloudinaryTestDialogProps> = ({
  open,
  onOpenChange,
  onTestConnection,
  onUploadTestFile,
  cloudinaryEnabled,
  user
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Test Cloudinary Integration</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Tests</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Diagnostics</TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Test your Cloudinary integration with these options:
              </p>
              <div className="flex flex-col gap-4">
                <Button onClick={onTestConnection}>
                  Test Connection
                </Button>
                <Button variant="outline" onClick={onUploadTestFile}>
                  Upload Test File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Cloudinary Status: {cloudinaryEnabled ? 
                  <span className="text-green-500 font-medium">Enabled</span> : 
                  <span className="text-red-500 font-medium">Disabled</span>
                }
              </p>
            </div>
          </TabsContent>
          <TabsContent value="advanced">
            <CloudinaryDiagnostics user={user} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CloudinaryTestDialog;
