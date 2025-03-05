import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ServerSearchProps {
  onSearch: (query: string) => void;
}

export function ServerSearch({ onSearch }: ServerSearchProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          className="h-4 w-4 text-muted-foreground"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <Input
        type="search"
        placeholder="搜索服务器..."
        value={query}
        onChange={handleChange}
        className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all"
      />
    </div>
  );
} 