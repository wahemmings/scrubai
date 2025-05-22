
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { 
  BarChart, 
  PieChart as PieChartIcon, 
  LineChart, 
  Calendar,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as RechartsBarChart, Bar } from "recharts";

const Analytics = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for charts
  const pieData = [
    { name: "PDF", value: 45 },
    { name: "DOCX", value: 30 },
    { name: "XLSX", value: 15 },
    { name: "TXT", value: 10 },
  ];
  
  const lineData = [
    { date: 'May 1', documents: 5 },
    { date: 'May 5', documents: 8 },
    { date: 'May 10', documents: 12 },
    { date: 'May 15', documents: 18 },
    { date: 'May 20', documents: 24 },
  ];
  
  const barData = [
    { month: 'Jan', usage: 30 },
    { month: 'Feb', usage: 45 },
    { month: 'Mar', usage: 38 },
    { month: 'Apr', usage: 52 },
    { month: 'May', usage: 65 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Analytics</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 Days
              </Button>
              <Button variant="outline">
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">187</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 GB</div>
                <p className="text-xs text-muted-foreground">45% of your quota</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Processing Credits</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">63</div>
                <p className="text-xs text-muted-foreground">8 used in the last 7 days</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="usage" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
              <TabsTrigger value="documents">Document Metrics</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="usage">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Usage</CardTitle>
                    <CardDescription>Usage trends over the past months</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-[300px] w-full">
                      {!isLoading && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={barData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="usage" fill="#8884d8" name="Usage" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Document Types</CardTitle>
                    <CardDescription>Breakdown of document formats</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-[300px] w-full">
                      {!isLoading && (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Document Activity</CardTitle>
                  <CardDescription>Number of documents processed over time</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px] w-full">
                    {!isLoading && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={lineData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="documents" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }}
                            name="Documents"
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Document Analytics</CardTitle>
                  <CardDescription>Detailed metrics about your documents</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-center text-muted-foreground py-12">
                    Document analytics will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest actions in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      <p className="text-center py-4">Loading activity...</p>
                    ) : (
                      <>
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">Uploaded new document</p>
                            <p className="text-sm text-muted-foreground">Annual Report.xlsx</p>
                          </div>
                          <span className="text-sm text-muted-foreground">3 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">Document processed</p>
                            <p className="text-sm text-muted-foreground">Privacy Policy.pdf</p>
                          </div>
                          <span className="text-sm text-muted-foreground">Yesterday</span>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">Account settings updated</p>
                            <p className="text-sm text-muted-foreground">Changed notification preferences</p>
                          </div>
                          <span className="text-sm text-muted-foreground">2 days ago</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button variant="ghost" className="text-sm">
                      View all activity
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
