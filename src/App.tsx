
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import Pricing from "@/pages/Pricing";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import TermsOfUse from "@/pages/TermsOfUse";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Layout from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/hooks/useAuth";
import { initAnalytics } from "@/services/analytics";

// Import ApiKeysPage
import ApiKeysPage from "./features/api-keys/ApiKeysPage";

function App() {
  useEffect(() => {
    // Initialize analytics and error tracking services
    initAnalytics();
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/app" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/api-keys" element={<ApiKeysPage />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
