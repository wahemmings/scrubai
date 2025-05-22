
import { Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const SecurityNotice = () => {
  return (
    <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-yellow-600" />
          <CardTitle className="text-yellow-700 dark:text-yellow-400">Security Notice</CardTitle>
        </div>
        <CardDescription>
          Your API keys carry many privileges. Please keep them secure and never share them in publicly accessible areas.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <ul className="list-disc pl-5 space-y-1">
          <li>API keys are encrypted in transit and at rest</li>
          <li>Keys are shown only once when created - save them securely</li>
          <li>All API requests are logged for security monitoring</li>
          <li>Rotate your keys regularly as a security best practice</li>
        </ul>
      </CardContent>
    </Card>
  );
};
