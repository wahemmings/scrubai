
import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DocumentSearchProps {
  onSearch: (query: string) => void;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ onSearch }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <Input 
          placeholder="Search documents..." 
          className="pl-8 w-[300px]"
          onChange={handleSearch}
        />
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DocumentSearch;
