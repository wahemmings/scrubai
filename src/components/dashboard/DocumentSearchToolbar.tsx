
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, FilterIcon } from "lucide-react";

interface DocumentSearchToolbarProps {
  onNewScrub: () => void;
}

export function DocumentSearchToolbar({ onNewScrub }: DocumentSearchToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold">Document History</h2>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Input 
            placeholder="Search files..." 
            className="pl-8 w-[250px]"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <Button variant="outline" size="icon">
          <FilterIcon className="h-4 w-4" />
        </Button>
        <Button onClick={onNewScrub}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Scrub
        </Button>
      </div>
    </div>
  );
}
