
import * as React from "react";
import { ToastActionElement } from "@/components/ui/toast";

// Toast types
export type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  type?: "default" | "success" | "error" | "warning";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "destructive";
  duration?: number;
  className?: string;
};

export type Toast = Omit<ToasterToast, "id">;

// Toast options interface
export interface ToastOptions {
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  action?: ToastActionElement;
  duration?: number;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  type?: "default" | "success" | "error" | "warning";
}
