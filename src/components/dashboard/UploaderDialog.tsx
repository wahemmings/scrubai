
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploader from "@/components/dashboard/FileUploader";

interface UploaderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded: (jobId: string, fileData: any) => void;
}

export function UploaderDialog({ open, onOpenChange, onFileUploaded }: UploaderDialogProps) {
  const [processingType, setProcessingType] = useState("text");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">New Document Scrub</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="text" className="w-full" onValueChange={(value) => {
          setProcessingType(value);
        }}>
          <TabsList className="mb-6">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <FileUploader 
              type="text" 
              onFileUploaded={onFileUploaded}
            />
          </TabsContent>
          <TabsContent value="document">
            <FileUploader 
              type="document" 
              onFileUploaded={onFileUploaded}
            /> 
          </TabsContent>
          <TabsContent value="image">
            <FileUploader 
              type="image" 
              onFileUploaded={onFileUploaded}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
