
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Badge } from "lucide-react";
import HeroUploadDemo from "@/components/demos/HeroUploadDemo";

// We'll add this mock auth state until Supabase is integrated
const mockAuthState = {
  isAuthenticated: false, // Change to true to test authenticated state
};

const Landing = () => {
  const { isAuthenticated } = mockAuthState;
  
  return (
    <div>
      {/* Hero section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                <span className="text-xs bg-scrub-green text-white py-0.5 px-2 rounded-full mr-1">NEW</span>
                Meet ScrubAI - Now in public beta
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  ScrubAI — Fingerprint‑free <br />
                  <span className="text-scrub-blue">content in seconds</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl">
                  Remove AI watermarks and provenance data from your text, documents, and images with just a few clicks.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link to={isAuthenticated ? "/app" : "/app"}>Get Started</Link>
                </Button>
                {isAuthenticated && (
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/app">Open Dashboard</Link>
                  </Button>
                )}
                {!isAuthenticated && (
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/pricing">View pricing</Link>
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-scrub-green" />
                  <span>No login required</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-scrub-green" />
                  <span>Free plan available</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <HeroUploadDemo />
              <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-100 to-purple-100 blur-3xl opacity-30 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How ScrubAI Works
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-3xl mx-auto">
              Our advanced algorithms detect and remove various types of digital watermarks and provenance data while maintaining content quality.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-scrub-blue/10 rounded-lg flex items-center justify-center mb-4">
                <Badge className="h-6 w-6 text-scrub-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detection Engine</h3>
              <p className="text-muted-foreground">
                Identifies regex patterns, Unicode watermarks, whitespace fingerprints, and statistical anomalies in content.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-scrub-green/10 rounded-lg flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-scrub-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Cleaning Actions</h3>
              <p className="text-muted-foreground">
                Choose from light scrubbing, LLM-powered rewriting, or pixel-level repainting for images.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-scrub-amber/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-scrub-amber">
                  <path d="M18 8V7c0-1.1-.9-2-2-2H8a2 2 0 0 0-2 2v1"></path>
                  <path d="M3 8h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"></path>
                  <path d="M10 12h4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Private Mode</h3>
              <p className="text-muted-foreground">
                Process your content securely with our RAM-only option that auto-deletes files after processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Clean, Export, and Share
              </h2>
              <p className="text-muted-foreground text-lg mt-4 mb-6">
                After processing your content, easily download, copy to clipboard, or push files back to your cloud storage service.
              </p>
              <ul className="space-y-4">
                {[
                  "Support for text, documents, and images",
                  "Side-by-side preview of original vs. cleaned content",
                  "Multiple cloud storage integrations",
                  "Detailed processing statistics"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-scrub-green mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8" asChild>
                <Link to={isAuthenticated ? "/app" : "/app"}>Get started{isAuthenticated ? "" : " for free"}</Link>
              </Button>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm">
              <div className="aspect-video rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-muted-foreground">
                [Demo screenshot placeholder]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 md:py-24 bg-scrub-blue text-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to scrub your content?
            </h2>
            <p className="text-lg mt-4 text-blue-100">
              Start using ScrubAI today and ensure your content remains fingerprint-free.
            </p>
            <Button size="lg" variant="outline" className="mt-8 bg-white text-scrub-blue hover:bg-blue-50" asChild>
              <Link to={isAuthenticated ? "/app" : "/app"}>
                {isAuthenticated ? "Open Dashboard" : "Try ScrubAI for free"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
