
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/stores/useAppStore";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface DashboardOverviewProps {
  jobs: any[];
}

export function DashboardOverview({ jobs }: DashboardOverviewProps) {
  const { currentJob, credits } = useAppStore();
  
  // Calculate statistics
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const processingJobs = jobs.filter(job => job.status === 'processing').length;
  const failedJobs = jobs.filter(job => job.status === 'failed').length;
  
  // Calculate processing percentage for comparison to last week (mock data)
  const processingPercentage = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
  const isPositiveChange = true; // Mock data, in real app would compare to previous period

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Scrubbing Overview</h3>
              <Badge variant="outline">This Week</Badge>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <div className="flex items-end gap-2">
                <h2 className="text-3xl font-bold">{totalJobs}</h2>
                <div className={`text-sm flex items-center ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositiveChange ? (
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                  )}
                  <span>{isPositiveChange ? '+' : '-'}10.5%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Compared to last week</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Active</Badge>
                <p className="text-2xl font-semibold mt-2">{processingJobs}</p>
              </div>
              <div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Completed</Badge>
                <p className="text-2xl font-semibold mt-2">{completedJobs}</p>
              </div>
              <div>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Failed</Badge>
                <p className="text-2xl font-semibold mt-2">{failedJobs}</p>
              </div>
            </div>
            
            <div className="w-full bg-muted h-2 mt-4 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div className="bg-blue-500 h-full" style={{ width: `${processingJobs / Math.max(1, totalJobs) * 100}%` }}></div>
                <div className="bg-green-500 h-full" style={{ width: `${completedJobs / Math.max(1, totalJobs) * 100}%` }}></div>
                <div className="bg-red-500 h-full" style={{ width: `${failedJobs / Math.max(1, totalJobs) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Available Credits</h3>
              <Badge variant="outline">Current Plan</Badge>
            </div>
            
            <div>
              <div className="flex items-end gap-2">
                <h2 className="text-3xl font-bold">{credits}</h2>
                <span className="text-sm text-muted-foreground mb-1">credits</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Free Plan</p>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm">Credit Usage</p>
                <p className="text-sm">{Math.min(80, Math.round(credits / 100 * 100))}%</p>
              </div>
              <Progress value={Math.min(80, credits / 100 * 100)} className="h-2" />
            </div>
            
            {currentJob && currentJob.status === 'processing' && (
              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm font-medium text-blue-800">Scrub in progress</p>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-blue-800">{currentJob.progress}% complete</p>
                    <p className="text-xs text-blue-800">Estimated time: 1 min</p>
                  </div>
                  <Progress value={currentJob.progress} className="h-1.5" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
