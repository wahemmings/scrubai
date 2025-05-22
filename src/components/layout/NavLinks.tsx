
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface NavLinksProps {
  className?: string;
  mobile?: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ className, mobile = false }) => {
  const { user } = useAuth();

  const links = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/app", requireAuth: true },
    { name: "Pricing", href: "/pricing" },
  ];
  
  const userLinks = user ? [
    { name: "Profile", href: "/profile" },
    { name: "API Keys", href: "/api-keys" },
  ] : [];

  const allLinks = [...links, ...userLinks];

  return (
    <nav className={cn("flex items-center gap-6", mobile ? "flex-col" : "", className)}>
      {allLinks.map((link) => {
        // Skip links that require authentication if user is not logged in
        if (link.requireAuth && !user) return null;
        
        return (
          <Link
            key={link.name}
            to={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground/80",
              mobile ? "w-full px-4 py-2 hover:bg-accent" : ""
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
