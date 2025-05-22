import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { FileText, Plus, Search, Filter, Trash2, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FileUploader from "@/components/dashboard/FileUploader";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  selected?: boolean;
}

const Documents = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

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
      lastModified: new Date().toFullYear() + "-" + 
                    String(new Date().getMonth() + 1).padStart(2, '0') + "-" + 
                    String(new Date().getDate()).padStart(2, '0'),
    };
    
    setDocuments([newDocument, ...documents]);
    setUploadDialogOpen(false);
    toast.success("Document uploaded successfully!");
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Documents</h1>
            <div className="flex gap-2">
              {isSelectionMode ? (
                <>
                  <Button variant="outline" onClick={handleSelectAll}>
                    {selectedDocuments.length === documents.length ? "Deselect All" : "Select All"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        disabled={selectedDocuments.length === 0}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete ({selectedDocuments.length})
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete {selectedDocuments.length} selected document(s).
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteSelected}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button variant="outline" onClick={toggleSelectionMode}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={toggleSelectionMode}>
                    Select
                  </Button>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Document upload dialog */}
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <FileUploader 
                  type="document" 
                  onFileUploaded={handleFileUploaded} 
                />
              </div>
            </DialogContent>
          </Dialog>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="pdf">PDF Files</TabsTrigger>
              <TabsTrigger value="word">Word Documents</TabsTrigger>
              <TabsTrigger value="excel">Spreadsheets</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <Input 
                  placeholder="Search documents..." 
                  className="pl-8 w-[300px]"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <TabsContent value="all">
              {isLoading ? (
                <div className="flex justify-center my-12">
                  <p>Loading documents...</p>
                </div>
              ) : documents.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {documents.map(doc => (
                    <Card 
                      key={doc.id} 
                      className={`cursor-pointer ${isSelectionMode ? 'relative' : ''} hover:bg-accent/50 transition-colors`}
                    >
                      <CardContent className="pt-6">
                        {isSelectionMode && (
                          <div className="absolute top-2 left-2">
                            <Checkbox 
                              checked={selectedDocuments.includes(doc.id)}
                              onCheckedChange={() => toggleSelection(doc.id)}
                              aria-label={`Select ${doc.name}`}
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-center h-20 w-20 bg-primary/10 rounded mx-auto mb-4">
                          <FileText className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="font-medium text-center">{doc.name}</h3>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          Last modified: {doc.lastModified}
                        </p>
                        
                        {!isSelectionMode && (
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
                                    Are you sure you want to delete "{doc.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteDocument(doc.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                    <p className="text-muted-foreground mb-6">Upload your first document to get started</p>
                    <Button onClick={() => setUploadDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </CardContent>
                </Card>
              )}
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
