
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/stores/useAppStore";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { markPreviewReady } from "@/services/instrumentation";
import ReportIssueButton from "./ReportIssueButton";

interface FileDisplayPanelProps {
  isOriginal: boolean;
  content: string | File | null;
}

export const FileDisplayPanel = ({ isOriginal, content }: FileDisplayPanelProps) => {
  const { currentJob } = useAppStore();
  const title = isOriginal ? "Original" : "Scrubbed";

  // Mark preview ready when the job is completed
  useEffect(() => {
    if (!isOriginal && currentJob && currentJob.status === 'completed') {
      markPreviewReady(currentJob.id);
    }
  }, [isOriginal, currentJob?.status, currentJob?.id]);

  const renderContent = () => {
    if (isOriginal) {
      if (content instanceof File) {
        return (
          <p className="text-muted-foreground text-center mt-32">
            [File: {content.name}]
          </p>
        );
      } else if (content) {
        return <pre className="text-sm whitespace-pre-wrap">{content}</pre>;
      } else {
        return (
          <p className="text-muted-foreground text-center mt-32">
            [Original content will display here]
          </p>
        );
      }
    } else {
      if (currentJob && currentJob.status === 'processing') {
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <Progress value={currentJob.progress} className="w-full mb-4" />
            <p className="text-sm text-muted-foreground">Processing... {currentJob.progress}%</p>
          </div>
        );
      } else if (currentJob && currentJob.status === 'completed') {
        return (
          <pre className="text-sm whitespace-pre-wrap">
            {content instanceof File 
              ? `[Scrubbed content for ${content.name}]` 
              : typeof content === 'string'
                ? content.replace(/\b(?:sensitive|private|confidential)\b/gi, '[REDACTED]')
                : '[Scrubbed content will display here]'}
          </pre>
        );
      } else {
        return (
          <p className="text-muted-foreground text-center mt-32">
            [Scrubbed content will display here]
          </p>
        );
      }
    }
  };

  const renderBadge = () => {
    if (isOriginal) {
      return (
        <Badge variant="outline">
          {content instanceof File 
            ? `${Math.round(content.size / 1024)} KB` 
            : `${Math.round((content?.length || 0) / 1024)} KB`}
        </Badge>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          {currentJob && (
            <Badge 
              variant={
                currentJob.status === 'completed' ? 'success' : 
                currentJob.status === 'failed' ? 'destructive' : 
                currentJob.status === 'processing' ? 'warning' : 'secondary'
              }
            >
              {currentJob.status.charAt(0).toUpperCase() + currentJob.status.slice(1)}
            </Badge>
          )}
          <Badge variant="outline">
            {content instanceof File 
              ? `${Math.round(content.size / 1024 * 0.95)} KB` 
              : `${Math.round(((content?.length || 0) * 0.95) / 1024)} KB`}
          </Badge>
        </div>
      );
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          {renderBadge()}
        </div>
        <div className={`${!isOriginal ? "relative " : ""}min-h-[300px] border rounded-md p-4 bg-muted/30 overflow-auto`}>
          {renderContent()}
        </div>
        
        {!isOriginal && currentJob && currentJob.status === 'completed' && (
          <div className="mt-4 flex justify-end">
            <ReportIssueButton jobId={currentJob.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
