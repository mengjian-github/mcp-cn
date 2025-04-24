import * as Separator from "@radix-ui/react-separator";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { FC } from "react";
import { NavigationMenu } from "./navigation-menu";

interface Category {
  name: string;
  count: number;
}

interface Tag {
  name: string;
  count: number;
}

interface SidebarProps {
  theme: "dark" | "light";
  activeTab: "分类" | "标签";
  categories: Category[];
  tags: Tag[];
  selectedCategory: string | null;
  selectedTag: string | null;
  onTabChange: (tab: "分类" | "标签") => void;
  onCategorySelect: (category: string) => void;
  onTagSelect: (tag: string) => void;
  onClearFilters: () => void;
  isFiltersActive: boolean;
}

export const Sidebar: FC<SidebarProps> = ({
  theme,
  activeTab,
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onTabChange,
  onCategorySelect,
  onTagSelect,
  onClearFilters,
  isFiltersActive,
}) => (
  <div
    className={`h-full border-r border-gray-200 w-[280px] bg-${theme === "dark" ? "gray-900" : "white"}`}
  >
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <ToggleGroup.Root
          type="single"
          defaultValue="分类"
          value={activeTab}
          onValueChange={(value: string | undefined) =>
            value && onTabChange(value as "分类" | "标签")
          }
          className="inline-flex rounded-md border border-gray-200 overflow-hidden"
        >
          <ToggleGroup.Item
            value="分类"
            className={`flex items-center justify-center px-3 py-2 text-sm ${
              activeTab === "分类"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="mr-1 text-xs">○</span> 分类
          </ToggleGroup.Item>
          {/* 
          <ToggleGroup.Item
            value="标签"
            className={`flex items-center justify-center px-3 py-2 text-sm ${
              activeTab === '标签'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1 text-xs">#</span> 标签
          </ToggleGroup.Item>
          */}
        </ToggleGroup.Root>
      </div>

      <Separator.Root className="my-4 h-px bg-gray-200" />

      {activeTab === "分类" ? (
        <NavigationMenu
          categories={categories.map((c) => c.name)}
          selectedCategory={selectedCategory ?? ""}
          onCategorySelect={onCategorySelect}
        />
      ) : (
        <div className="space-y-2">
          {tags.map((tag) => (
            <div
              key={tag.name}
              className={`flex justify-between items-center px-3 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
                selectedTag === tag.name
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : ""
              }`}
              onClick={() => {
                onTagSelect(tag.name);
              }}
            >
              <span>{tag.name}</span>
              <div className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                {tag.count}
              </div>
            </div>
          ))}
        </div>
      )}

      <Separator.Root className="my-4 h-px bg-gray-200" />

      <button
        className={`mt-auto text-sm py-2 px-4 rounded-md transition-colors ${
          isFiltersActive
            ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50"
            : "text-gray-400 cursor-not-allowed"
        }`}
        onClick={onClearFilters}
        disabled={!isFiltersActive}
        type="button"
      >
        清除所有过滤器
      </button>
    </div>
  </div>
);
