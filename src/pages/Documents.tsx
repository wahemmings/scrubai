import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { FileText, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documents = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Documents</h1>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

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
                    <Card key={doc.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="pt-6">
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
                    <Button>
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
