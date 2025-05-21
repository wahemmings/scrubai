
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Menu, X } from "lucide-react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-scrub-blue text-white flex items-center justify-center font-bold">
              S
            </div>
            <span className="text-xl font-bold">ScrubAI</span>
          </Link>
          
          <nav className="hidden md:flex gap-6 ml-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Home
            </Link>
            <Link to="/pricing" className={`text-sm font-medium transition-colors ${location.pathname === "/pricing" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Pricing
            </Link>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {isHomePage ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/app">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/app">Get Started</Link>
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Back to home</Link>
            </Button>
          )}
        </div>
        
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
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
              to="/" 
              className={`text-sm font-medium transition-colors ${location.pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
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
            <div className="pt-4 border-t">
              {isHomePage ? (
                <div className="flex flex-col gap-3">
                  <Button variant="outline" asChild>
                    <Link to="/app" onClick={() => setIsOpen(false)}>Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/app" onClick={() => setIsOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/" onClick={() => setIsOpen(false)}>Back to home</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
