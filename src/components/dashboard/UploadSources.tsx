
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop, Box as BoxIcon, FileType } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface UploadSourcesProps {
  onSourceSelect: (source: string) => void;
}

export const UploadSources = ({ onSourceSelect }: UploadSourcesProps) => {
  const handleSourceClick = (source: string) => {
    if (source !== "laptop") {
      toast({
        title: "Feature coming soon",
        description: `${source} integration will be available in a future update.`,
        variant: "default",
      });
      return;
    }
    onSourceSelect(source);
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Source</h2>
        <div className="grid grid-cols-3 gap-3">
          {/* Local Device */}
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("laptop")}
          >
            <Laptop className="h-5 w-5" />
            <span className="text-xs">Local Device</span>
          </Button>
          
          {/* Google Drive */}
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("google-drive")}
          >
            <svg viewBox="0 0 87.3 78" className="h-5 w-5">
              <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3 1.4.8 2.9 1.2 4.5 1.2h51.8c1.6 0 3.1-.4 4.5-1.2 1.35-.8 2.5-1.9 3.3-3.3l3.85-6.65-75.1 0z" fill="#0066da"/>
              <path d="M45.95 12.8l-18.2 31.4-19.6 33.85c.8-1.4.8-3.1 1.95-4.25l34.9-60.4c.8-1.4 1.95-2.5 3.3-3.3 1.4-.8 2.9-1.2 4.5-1.2h5.35L45.95 12.8z" fill="#00ac47"/>
              <path d="M73.55 78H21.75c-1.6 0-3.1-.4-4.5-1.2-1.35-.8-2.5-1.9-3.3-3.3l37.65-65.2h22.4c1.6 0 3.1.4 4.5 1.2 1.35.8 2.5 1.9 3.3 3.3l16 27.6 3.15 5.5c.8 1.4 1.2 2.95 1.2 4.5s-.4 3.1-1.2 4.5l-19.15 33.4c-.15-.4-.25-.85-.4-1.25-.3-.85-.5-1.75-.8-2.6-.15-.45-.3-.85-.45-1.3-.3-.8-.55-1.65-.8-2.5-.15-.45-.25-.9-.4-1.35-.25-.85-.5-1.7-.7-2.55-.1-.45-.2-.85-.3-1.3-.25-1.05-.45-2.1-.55-3.15 0-.15 0-.25-.05-.4-.15-1.9-.15-3.85 0-5.75 0-.15 0-.25.05-.4.1-1.05.3-2.1.55-3.15.1-.45.2-.85.3-1.3.2-.85.45-1.7.7-2.55.15-.45.25-.9.4-1.35.25-.85.5-1.65.8-2.5.15-.45.3-.85.45-1.3.3-.85.55-1.75.8-2.6.15-.4.25-.85.4-1.25.55-1.5 1.2-2.95 1.95-4.3.15-.25.25-.5.4-.75.4-.7.8-1.4 1.25-2.05.2-.3.4-.6.6-.85.4-.6.85-1.15 1.3-1.7.25-.3.45-.6.7-.85.55-.6 1.1-1.2 1.7-1.75l.15-.15c.65-.55 1.3-1.1 1.95-1.55.05-.05.1-.05.15-.1.55-.4 1.15-.75 1.75-1.1l.65-.35c.55-.3 1.15-.55 1.75-.8.25-.1.55-.2.8-.3.65-.25 1.3-.45 2-.6.2-.05.35-.1.55-.15.95-.2 1.9-.35 2.9-.35h6.6l-37.65 65.2z" fill="#ea4335"/>
              <path d="M45.95 12.8h-5.7c-1.6 0-3.1.4-4.5 1.2-1.35.8-2.5 1.9-3.3 3.3l-7.6 13.15L6.6 66.85h37.5l9.4-16.25 11.5-19.9 11.5-19.85h-22.4l-8.15 1.95z" fill="#00832d"/>
              <path d="M45.95 12.8l8.15-1.95h22.4c1.6 0 3.1.4 4.5 1.2 1.35.8 2.5 1.9 3.3 3.3l8.15 14.15c.8 1.4 1.2 2.95 1.2 4.5s-.4 3.1-1.2 4.5l-19.15 33.4c-.15-.4-.25-.85-.4-1.25H44.05l1.9-3.3 9.4-16.25 11.5-19.9 11.5-19.85h-22.4l-8.15 1.95-1.85-1.95z" fill="#2684fc"/>
              <path d="M86.45 34l-8.15-14.15c-.8-1.4-1.95-2.5-3.3-3.3-1.4-.8-2.9-1.2-4.5-1.2h-22.4l8.15-1.95h31.15c1.6 0 3.1.4 4.5 1.2 1.35.8 2.5 1.9 3.3 3.3l3.85 6.7c.8 1.4 1.2 2.95 1.2 4.5s-.4 3.1-1.2 4.5L87.65 45l-3.4-5.5c.8-1.4 1.2-2.95 1.2-4.5s-.4-3.1-1-5z" fill="#00ac47"/>
            </svg>
            <span className="text-xs">Google Drive</span>
          </Button>
          
          {/* Dropbox */}
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("dropbox")}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-blue-600">
              <path d="M12.0146 2L6 6.00041L12.0146 10L6 14.0006L0 10L6.01457 6.00041L0 2.00082L6.01457 -1.52588e-05L12.0146 2ZM5.99635 15.9986L12.0036 11.9982L18 15.9986L12.0036 20L5.99635 15.9986ZM12.0109 2L18 6.00041L12.0109 10L18 14.0006L24 10L18.0036 6.00041L24 2.00082L18.0036 -1.52588e-05L12.0109 2Z"/>
            </svg>
            <span className="text-xs">Dropbox</span>
          </Button>
          
          {/* OneDrive */}
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("onedrive")}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-500">
              <path d="M10.0423 5.0496C11.7938 5.0501 13.4559 5.8418 14.5188 7.2149C14.9359 6.9036 15.4273 6.6925 15.9508 6.5986C16.4743 6.5048 17.0149 6.5312 17.5237 6.6752C18.0324 6.8192 18.4937 7.0766 18.869 7.4225C19.2443 7.7684 19.5226 8.1928 19.6795 8.6603C20.3419 8.7043 20.9714 8.9452 21.4772 9.3471C21.983 9.749 22.3377 10.2909 22.486 10.8941C22.6343 11.4974 22.5685 12.1295 22.2989 12.6894C22.0293 13.2492 21.5708 13.7033 21 13.9795V14C21 15.0609 20.5786 16.0783 19.8284 16.8284C19.0783 17.5786 18.0609 18 17 18H6C4.67441 18.0016 3.40356 17.4731 2.46622 16.5358C1.52888 15.5984 1.00043 14.3276 1.00205 13.002C1.00367 11.6763 1.53516 10.407 2.47465 9.47249C3.41415 8.538 4.68605 8.01236 6.01171 8.0135C6.48152 7.0049 7.2479 6.1494 8.2043 5.5599C9.1607 4.9704 10.2675 4.6757 11.3904 4.7153C11.5146 4.9777 10.7887 5.0039 10.0423 5.0496Z" fill="currentColor"/>
            </svg>
            <span className="text-xs">OneDrive</span>
          </Button>
          
          {/* Cloud Storage */}
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("cloud-storage")}
          >
            <FileType className="h-5 w-5" />
            <span className="text-xs">Cloud Storage</span>
          </Button>
          
          {/* Box */}
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center gap-2 py-3 h-auto"
            onClick={() => handleSourceClick("box")}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-700">
              <path fill="currentColor" d="M11.97 1 5.013 5.317v5.872l6.982 4.207 6.983-4.207V5.317L11.97 1zm9.992 11.254-6.982 4.208v6.527l6.982-4.208v-6.527zm-9.992 4.208-6.982-4.208v6.527l6.982 4.208v-6.527z"/>
            </svg>
            <span className="text-xs">Box</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
