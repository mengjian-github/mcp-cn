import { useState } from "react";
import { MCPCategory, MCPTag } from "@/types/mcp";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface ServerFiltersProps {
  categories: MCPCategory[];
  tags: MCPTag[];
  onFilterChange: (filter: { category?: string; tag?: string }) => void;
}

export function ServerFilters({ categories, tags, onFilterChange }: ServerFiltersProps) {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [activeTag, setActiveTag] = useState<string | undefined>(undefined);

  const handleCategoryChange = (categoryId: string) => {
    const newCategory = activeCategory === categoryId ? undefined : categoryId;
    setActiveCategory(newCategory);
    onFilterChange({ category: newCategory, tag: activeTag });
  };

  const handleTagChange = (tagId: string) => {
    const newTag = activeTag === tagId ? undefined : tagId;
    setActiveTag(newTag);
    onFilterChange({ category: activeCategory, tag: newTag });
  };

  const clearFilters = () => {
    setActiveCategory(undefined);
    setActiveTag(undefined);
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">类别</TabsTrigger>
          <TabsTrigger value="tags">标签</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="mt-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="tags" className="mt-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Button
                key={tag.id}
                variant={activeTag === tag.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagChange(tag.id)}
              >
                {tag.name} ({tag.count})
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {(activeCategory || activeTag) && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-2">
          清除所有过滤器
        </Button>
      )}
    </div>
  );
} 