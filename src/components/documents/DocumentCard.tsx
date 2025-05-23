
import React from "react";
import { FileText, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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

interface DocumentCardProps {
  document: {
    id: number;
    name: string;
    type: string;
    size: string;
    lastModified: string;
    contentPath?: string;
  };
  isSelectable: boolean;
  isSelected: boolean;
  onToggleSelection: (id: number) => void;
  onDelete: (id: number) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isSelectable,
  isSelected,
  onToggleSelection,
  onDelete
}) => {
  return (
    <Card 
      className={`cursor-pointer ${isSelectable ? 'relative' : ''} hover:bg-accent/50 transition-colors`}
    >
      <CardContent className="pt-6">
        {isSelectable && (
          <div className="absolute top-2 left-2">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(document.id)}
              aria-label={`Select ${document.name}`}
            />
          </div>
        )}
        <div className="flex items-center justify-center h-20 w-20 bg-primary/10 rounded mx-auto mb-4">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        <h3 className="font-medium text-center">{document.name}</h3>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{document.type}</span>
          <span>{document.size}</span>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Last modified: {document.lastModified}
        </p>
        
        {!isSelectable && (
          <div className="mt-4 flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete document?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{document.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(document.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
