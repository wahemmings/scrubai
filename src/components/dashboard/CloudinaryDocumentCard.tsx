
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to icon if image fails to load
    e.currentTarget.style.display = 'none';
    
    // Create a container for the icon
    const iconElement = document.createElement('div');
    iconElement.className = 'flex items-center justify-center h-20 w-20';
    
    // Append to parent element
    const parentElement = e.currentTarget.parentElement;
    if (parentElement) {
      // Add the container to the DOM
      parentElement.appendChild(iconElement);
      
      // Create icon element with proper styling based on document type
      const docType = document.type.toLowerCase();
      const iconColor = 
        docType === "pdf" ? "text-primary" : 
        ["docx", "doc"].includes(docType) ? "text-blue-500" : 
        ["xlsx", "xls"].includes(docType) ? "text-green-500" : 
        ["jpg", "jpeg", "png", "webp", "gif"].includes(docType) ? "text-purple-500" : 
        "text-muted-foreground";
      
      // Create a simple div to show instead of React component
      const iconDiv = document.createElement('div');
      iconDiv.className = `h-10 w-10 ${iconColor} flex items-center justify-center`;
      iconDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
      
      iconElement.appendChild(iconDiv);
    }
  };

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
              onError={handleImageError}
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
