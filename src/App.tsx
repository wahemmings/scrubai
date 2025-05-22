
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/layout/Layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ApiKeys from "./pages/ApiKeys";
import { CSP_HEADER } from "./security/csp";
import { useEffect } from "react";
import { initMemoryManager } from "./security/memoryManager";

// Configure CSP meta tag
const cspMetaTag = document.createElement('meta');
cspMetaTag.httpEquiv = 'Content-Security-Policy';
cspMetaTag.content = CSP_HEADER;
document.head.appendChild(cspMetaTag);

// Configure QueryClient with security settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Limit retries for security (prevent brute force)
        if (error?.status === 401 || error?.status === 403) {
          return false; // Don't retry auth failures
        }
        return failureCount < 2; // Limit to 2 retries for other errors
      }
    }
  }
});

const App = () => {
  // Initialize memory manager for uploads
  useEffect(() => {
    initMemoryManager();
    return () => {
      // Force garbage collection on unmount if possible
      if (window.gc) {
        try {
          window.gc();
        } catch (e) {
          console.warn('Failed to force garbage collection');
        }
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="scrubai-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/app" element={<Dashboard />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/api-keys" element={<ApiKeys />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
