
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FileImage, FileSpreadsheet, File } from "lucide-react";
import { getCloudinaryThumbnailUrl } from "@/integrations/cloudinary/config";

interface CloudinaryDocumentCardProps {
  document: {
    id: number;
    name: string;
    type: string;
    contentPath?: string;
    size: string;
    lastModified: string;
  };
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

const CloudinaryDocumentCard: React.FC<CloudinaryDocumentCardProps> = ({
  document,
  isSelectable = false,
  isSelected = false,
  onSelect,
  onDelete,
}) => {
  // Determine which icon to use based on document type
  const getDocumentIcon = () => {
    const type = document.type.toLowerCase();
    
    if (type === "pdf") return <FileText className="h-10 w-10 text-primary" />;
    if (type === "docx" || type === "doc") return <FileText className="h-10 w-10 text-blue-500" />;
    if (type === "xlsx" || type === "xls") return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(type)) return <FileImage className="h-10 w-10 text-purple-500" />;
    
    return <File className="h-10 w-10 text-muted-foreground" />;
  };

  // Determine if we should show a thumbnail from Cloudinary
  const shouldShowThumbnail = () => {
    if (!document.contentPath) return false;
    
    const type = document.type.toLowerCase();
    return ["jpg", "jpeg", "png", "webp", "gif", "pdf"].includes(type);
  };

  // Get thumbnail URL if available
  const getThumbnailUrl = () => {
    if (!document.contentPath || !shouldShowThumbnail()) return null;
    
    return getCloudinaryThumbnailUrl(document.contentPath);
  };

  const thumbnailUrl = getThumbnailUrl();

  return (
    <Card className={`cursor-pointer ${isSelectable ? 'relative' : ''} hover:bg-accent/50 transition-colors`}>
      <CardContent className="pt-6">
        {/* Document preview */}
        <div className="flex items-center justify-center h-32 w-full bg-primary/5 rounded mb-4 overflow-hidden">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={document.name} 
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                
                // Use global document object instead of the document prop
                const iconElement = window.document.createElement('div');
                iconElement.className = 'flex items-center justify-center h-20 w-20';
                const iconContent = getDocumentIcon();
                
                // Use React to render the icon into the new div
                const parentElement = e.currentTarget.parentElement;
                if (parentElement) {
                  parentElement.appendChild(iconElement);
                  
                  // We need to use ReactDOM to render the React element into the DOM
                  // This is a simple workaround to show the icon
                  const tempDiv = window.document.createElement('div');
                  tempDiv.innerHTML = `<div class="h-10 w-10 ${
                    document.type.toLowerCase() === "pdf" ? "text-primary" : 
                    ["docx", "doc"].includes(document.type.toLowerCase()) ? "text-blue-500" : 
                    ["xlsx", "xls"].includes(document.type.toLowerCase()) ? "text-green-500" : 
                    ["jpg", "jpeg", "png", "webp", "gif"].includes(document.type.toLowerCase()) ? "text-purple-500" : 
                    "text-muted-foreground"
                  }"></div>`;
                  
                  iconElement.appendChild(tempDiv);
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-20 w-20">
              {getDocumentIcon()}
            </div>
          )}
        </div>

        {/* Document name and metadata */}
        <h3 className="font-medium text-center truncate" title={document.name}>
          {document.name}
        </h3>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{document.type}</span>
          <span>{document.size}</span>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Last modified: {document.lastModified}
        </p>
      </CardContent>
    </Card>
  );
};

export default CloudinaryDocumentCard;
