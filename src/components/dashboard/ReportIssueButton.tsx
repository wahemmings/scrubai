
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { reportFalsePositive } from "@/services/instrumentation";
import { useState } from "react";

interface ReportIssueButtonProps {
  jobId: string;
}

const ReportIssueButton = ({ jobId }: ReportIssueButtonProps) => {
  const [isReporting, setIsReporting] = useState(false);
  
  const handleReport = async () => {
    setIsReporting(true);
    try {
      await reportFalsePositive(jobId);
    } finally {
      setIsReporting(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleReport}
      disabled={isReporting}
      className="flex items-center gap-1"
    >
      <AlertCircle size={14} />
      <span>{isReporting ? "Reporting..." : "Report Issue"}</span>
    </Button>
  );
};

export default ReportIssueButton;
