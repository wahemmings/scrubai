import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import Pricing from "@/pages/Pricing";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner"

// Update the import for ApiKeys
import ApiKeysPage from "./features/api-keys/ApiKeysPage";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/api-keys" element={<ApiKeysPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
