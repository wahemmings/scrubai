
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileUploader from "@/components/dashboard/FileUploader";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded: (jobId: string, fileData: any) => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onOpenChange,
  onFileUploaded
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <FileUploader 
            type="document" 
            onFileUploaded={onFileUploaded} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
