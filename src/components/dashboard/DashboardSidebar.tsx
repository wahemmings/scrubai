
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  FileText, 
  PieChart, 
  Settings,
  CreditCard,
  Key,
  HelpCircle
} from "lucide-react";

export function DashboardSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/app", 
      icon: LayoutDashboard,
      active: isActive("/app") || isActive("/dashboard")
    },
    { 
      name: "Documents", 
      path: "/app/documents", 
      icon: FileText,
      active: isActive("/app/documents")
    },
    { 
      name: "Analytics", 
      path: "/app/analytics", 
      icon: PieChart,
      active: isActive("/app/analytics")
    }
  ];
  
  const secondaryItems = [
    { 
      name: "Billing & Payments", 
      path: "/pricing", 
      icon: CreditCard,
      active: isActive("/pricing")
    },
    { 
      name: "API Keys", 
      path: "/api-keys", 
      icon: Key,
      active: isActive("/api-keys")
    },
    { 
      name: "Settings", 
      path: "/profile", 
      icon: Settings,
      active: isActive("/profile")
    },
    { 
      name: "Support", 
      path: "/support", 
      icon: HelpCircle,
      active: isActive("/support")
    }
  ];
  
  return (
    <div className="w-64 border-r h-screen flex flex-col bg-background">
      <div className="p-6">
        <h2 className="text-xl font-bold flex items-center">
          <span className="text-primary">Scrub</span>AI
        </h2>
      </div>
      
      <div className="flex-1 px-4 py-2 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">MAIN MENU</p>
        {menuItems.map((item) => (
          <Link 
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center h-10 px-2 rounded-md text-sm font-medium transition-colors",
              item.active 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.name}
          </Link>
        ))}
      </div>
      
      <div className="px-4 py-2 space-y-1 mb-6">
        <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">MANAGE</p>
        {secondaryItems.map((item) => (
          <Link 
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center h-10 px-2 rounded-md text-sm font-medium transition-colors",
              item.active 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.name}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
