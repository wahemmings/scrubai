
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/toast/toast-helpers";
import { SecurityNotice } from "./components/SecurityNotice";
import { CreateApiKeyCard } from "./components/CreateApiKeyCard";
import { ApiKeysList } from "./components/ApiKeysList";

const ApiKeysPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-40">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">API Keys</h1>
      
      <div className="grid gap-6">
        <SecurityNotice />
        <CreateApiKeyCard />
        <ApiKeysList />
      </div>
    </div>
  );
};

export default ApiKeysPage;
