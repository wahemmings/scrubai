
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 text-scrub-blue text-4xl font-bold mb-4">
          404
        </div>
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button asChild size="lg" className="px-8">
            <Link to="/">Return to home</Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="px-8">
            <Link to="/app">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
