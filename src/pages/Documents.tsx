import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { testCloudinaryConnection, uploadTestFile } from "@/utils/cloudinaryTest";
import { isCloudinaryEnabled } from "@/integrations/cloudinary/config";
import DocumentGrid from "@/components/documents/DocumentGrid";
import DocumentToolbar from "@/components/documents/DocumentToolbar";
import DocumentSearch from "@/components/documents/DocumentSearch";
import CloudinaryTestDialog from "@/components/documents/CloudinaryTestDialog";
import UploadDialog from "@/components/documents/UploadDialog";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  selected?: boolean;
  contentPath?: string;
}

const Documents = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Debug logging to check if Cloudinary is enabled
  useEffect(() => {
    console.log("Cloudinary enabled:", isCloudinaryEnabled());
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Mock fetching documents
    const fetchDocuments = async () => {
      setIsLoading(true);
      // In a real implementation, this would fetch from your backend
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        setDocuments([
          { id: 1, name: "Privacy Policy.pdf", type: "PDF", size: "1.2 MB", lastModified: "2025-05-15" },
          { id: 2, name: "Terms of Service.docx", type: "DOCX", size: "856 KB", lastModified: "2025-05-10" },
          { id: 3, name: "Annual Report.xlsx", type: "XLSX", size: "3.4 MB", lastModified: "2025-05-01" },
        ]);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const toggleSelection = (id: number) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedDocuments([]);
    }
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map(doc => doc.id));
    }
  };

  const deleteSelected = () => {
    const updatedDocuments = documents.filter(doc => !selectedDocuments.includes(doc.id));
    setDocuments(updatedDocuments);
    toast.success(`${selectedDocuments.length} document(s) deleted successfully`);
    setSelectedDocuments([]);
    setIsSelectionMode(false);
  };

  const deleteDocument = (id: number) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    toast.success("Document deleted successfully");
  };

  const handleFileUploaded = (jobId: string, fileData: any) => {
    // Add the new document to the documents list
    const newDocument: Document = {
      id: documents.length + 1, // In a real app, this would come from the database
      name: fileData.fileName || `Document-${Date.now()}.pdf`,
      type: fileData.fileName?.split('.').pop()?.toUpperCase() || "PDF",
      size: fileData.fileSize ? `${(fileData.fileSize / 1024).toFixed(1)} KB` : "Unknown",
      lastModified: new Date().getFullYear() + "-" + 
                    String(new Date().getMonth() + 1).padStart(2, '0') + "-" + 
                    String(new Date().getDate()).padStart(2, '0'),
      contentPath: fileData.contentPath || null,
    };
    
    setDocuments([newDocument, ...documents]);
    setUploadDialogOpen(false);
    toast.success("Document uploaded successfully!");
  };

  const handleTestCloudinary = async () => {
    if (!user) {
      toast.error("You need to be logged in to test Cloudinary");
      return;
    }
    
    await testCloudinaryConnection(user);
  };

  const handleUploadTestFile = async () => {
    if (!user) {
      toast.error("You need to be logged in to upload test file");
      return;
    }
    
    await uploadTestFile(user);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, you would filter the documents based on the query
    // For now, we'll just log it
    console.log("Search query:", query);
  };

  // Force Cloudinary to be enabled for testing purposes
  const cloudinaryEnabled = true; // This guarantees the button will show up

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Documents</h1>
            <DocumentToolbar 
              isSelectionMode={isSelectionMode}
              selectedCount={selectedDocuments.length}
              onSelectAll={handleSelectAll}
              onToggleSelectionMode={toggleSelectionMode}
              onDeleteSelected={deleteSelected}
              onTestCloudinary={() => setTestDialogOpen(true)}
              onUploadClick={() => setUploadDialogOpen(true)}
              allSelected={selectedDocuments.length === documents.length}
            />
          </div>

          {/* Document upload dialog */}
          <UploadDialog 
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            onFileUploaded={handleFileUploaded}
          />

          {/* Cloudinary test dialog */}
          <CloudinaryTestDialog 
            open={testDialogOpen}
            onOpenChange={setTestDialogOpen}
            onTestConnection={handleTestCloudinary}
            onUploadTestFile={handleUploadTestFile}
            cloudinaryEnabled={cloudinaryEnabled}
            user={user}
          />

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="pdf">PDF Files</TabsTrigger>
              <TabsTrigger value="word">Word Documents</TabsTrigger>
              <TabsTrigger value="excel">Spreadsheets</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center justify-between mb-4">
              <DocumentSearch onSearch={handleSearch} />
            </div>

            <TabsContent value="all">
              <DocumentGrid 
                isLoading={isLoading}
                documents={documents}
                isSelectionMode={isSelectionMode}
                selectedDocuments={selectedDocuments}
                onToggleSelection={toggleSelection}
                onDeleteDocument={deleteDocument}
                onUploadClick={() => setUploadDialogOpen(true)}
              />
            </TabsContent>
            
            {/* Other tab contents would follow the same pattern */}
            <TabsContent value="pdf">
              <Card>
                <CardContent className="py-4">
                  <p className="text-center text-muted-foreground">Filter your PDF files here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="word">
              <Card>
                <CardContent className="py-4">
                  <p className="text-center text-muted-foreground">Filter your Word documents here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="excel">
              <Card>
                <CardContent className="py-4">
                  <p className="text-center text-muted-foreground">Filter your spreadsheets here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Documents;
