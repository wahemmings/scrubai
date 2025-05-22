
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-8 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-scrub-blue text-white flex items-center justify-center font-bold">
                S
              </div>
              <span className="text-lg font-bold">ScrubAI</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Fingerprint-free content in seconds. Remove AI watermarks and provenance data from your files.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h3 className="font-medium mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {currentYear} ScrubAI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Twitter</a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">GitHub</a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
