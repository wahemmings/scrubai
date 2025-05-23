
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Wrench, Plus } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DocumentToolbarProps {
  isSelectionMode: boolean;
  selectedCount: number;
  onSelectAll: () => void;
  onToggleSelectionMode: () => void;
  onDeleteSelected: () => void;
  onTestCloudinary: () => void;
  onUploadClick: () => void;
  allSelected: boolean;
}

const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  isSelectionMode,
  selectedCount,
  onSelectAll,
  onToggleSelectionMode,
  onDeleteSelected,
  onTestCloudinary,
  onUploadClick,
  allSelected
}) => {
  return (
    <div className="flex gap-2">
      {isSelectionMode ? (
        <>
          <Button variant="outline" onClick={onSelectAll}>
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                disabled={selectedCount === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedCount})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {selectedCount} selected document(s).
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteSelected}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={onToggleSelectionMode}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={onToggleSelectionMode}>
            Select
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={onTestCloudinary}
          >
            <Wrench className="h-4 w-4" />
            Test Cloudinary
          </Button>
          <Button onClick={onUploadClick}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </>
      )}
    </div>
  );
};

export default DocumentToolbar;
