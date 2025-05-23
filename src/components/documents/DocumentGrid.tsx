
import React from "react";
import DocumentCard from "./DocumentCard";
import CloudinaryDocumentCard from "@/components/dashboard/CloudinaryDocumentCard";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  contentPath?: string;
}

interface DocumentGridProps {
  isLoading: boolean;
  documents: Document[];
  isSelectionMode: boolean;
  selectedDocuments: number[];
  onToggleSelection: (id: number) => void;
  onDeleteDocument: (id: number) => void;
  onUploadClick: () => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  isLoading,
  documents,
  isSelectionMode,
  selectedDocuments,
  onToggleSelection,
  onDeleteDocument,
  onUploadClick
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <p>Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No documents yet</h3>
          <p className="text-muted-foreground mb-6">Upload your first document to get started</p>
          <Button onClick={onUploadClick}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {documents.map(doc => (
        doc.contentPath ? (
          <CloudinaryDocumentCard
            key={doc.id}
            document={doc}
            isSelectable={isSelectionMode}
            isSelected={selectedDocuments.includes(doc.id)}
          />
        ) : (
          <DocumentCard
            key={doc.id}
            document={doc}
            isSelectable={isSelectionMode}
            isSelected={selectedDocuments.includes(doc.id)}
            onToggleSelection={onToggleSelection}
            onDelete={onDeleteDocument}
          />
        )
      ))}
    </div>
  );
};

export default DocumentGrid;
