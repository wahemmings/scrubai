
import { useState } from "react";

interface FileUploaderProps {
  type: "text" | "document" | "image";
  onFileUploaded: () => void;
}

const FileUploader = ({ type, onFileUploaded }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileContent, setFileContent] = useState("");
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate file upload
    setTimeout(() => {
      onFileUploaded();
    }, 800);
  };
  
  const handleClick = () => {
    // Simulate file upload
    setTimeout(() => {
      onFileUploaded();
    }, 800);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value);
    if (e.target.value) {
      onFileUploaded();
    }
  };
  
  if (type === "text") {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Enter or paste text</h2>
        <textarea 
          className="w-full min-h-[300px] p-3 border rounded-md resize-y" 
          placeholder="Enter or paste the text you want to scrub here..."
          onChange={handleTextChange}
          value={fileContent}
        ></textarea>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Upload {type === "document" ? "document" : "image"}
      </h2>
      <div 
        className={`dropzone ${isDragging ? 'dropzone-active' : ''} min-h-[300px]`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 bg-scrub-blue/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-scrub-blue">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <p className="font-medium">Drag & drop or click to upload</p>
          <p className="text-sm text-muted-foreground mt-1">
            {type === "document" 
              ? "Supports txt, md, docx, pdf files up to 10MB" 
              : "Supports png, jpg, webp files up to 10MB"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
