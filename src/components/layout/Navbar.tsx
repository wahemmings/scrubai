
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user, signOut } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  // Update the home link to point to dashboard if user is logged in
  const homeLink = user ? "/app" : "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to={homeLink} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-scrub-blue text-white flex items-center justify-center font-bold">
              S
            </div>
            <span className="text-xl font-bold">ScrubAI</span>
          </Link>
          
          <nav className="hidden md:flex gap-6 ml-6">
            <Link to={homeLink} className={`text-sm font-medium transition-colors ${location.pathname === homeLink ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Home
            </Link>
            <Link to="/pricing" className={`text-sm font-medium transition-colors ${location.pathname === "/pricing" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Pricing
            </Link>
            {user && (
              <Link to="/support" className={`text-sm font-medium transition-colors ${location.pathname === "/support" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                Support
              </Link>
            )}
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          {user ? (
            <div className="flex items-center gap-4">
              {isHomePage && (
                <Button variant="outline" asChild>
                  <Link to="/app">Open Dashboard</Link>
                </Button>
              )}
              
              {/* Profile dropdown menu - Always visible when user is logged in */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label="User profile">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/support">Support</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            isHomePage ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?tab=signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/">Back to home</Link>
              </Button>
            )
          )}
        </div>
        
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          {/* Show user avatar in mobile view when logged in */}
          {user && (
            <Button variant="ghost" size="icon" className="rounded-full mr-2" asChild>
              <Link to="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          )}
          
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t py-4 px-6 bg-background">
          <nav className="flex flex-col space-y-4">
            <Link 
              to={homeLink}
              className={`text-sm font-medium transition-colors ${location.pathname === homeLink ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium transition-colors ${location.pathname === "/pricing" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            {user && (
              <Link 
                to="/support" 
                className={`text-sm font-medium transition-colors ${location.pathname === "/support" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setIsOpen(false)}
              >
                Support
              </Link>
            )}
            {user && (
              <Link 
                to="/profile" 
                className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Profile settings
              </Link>
            )}
            <div className="pt-4 border-t">
              {user ? (
                <div className="flex flex-col gap-3">
                  {isHomePage && (
                    <Button variant="outline" asChild>
                      <Link to="/app" onClick={() => setIsOpen(false)}>Open Dashboard</Link>
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                isHomePage ? (
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/auth?tab=signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/" onClick={() => setIsOpen(false)}>Back to home</Link>
                  </Button>
                )
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
