import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as Separator from "@radix-ui/react-separator";
import { AnimatePresence, motion } from "motion/react";
import { FC, useState } from "react";

interface NavigationMenuProps {
  title?: string;
  subtitle?: string;
  categories: string[];
  tags?: string[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
  onSelectTag?: (tag: string) => void;
  onClearFilters?: () => void;
}

export const NavigationMenu: FC<NavigationMenuProps> = ({
  title = "分类",
  subtitle = "选择服务类别",
  categories = [],
  tags = [],
  selectedCategory = "",
  onCategorySelect,
  onSelectTag,
  onClearFilters,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // 分类名称的中文映射
  const categoryNames: Record<string, string> = {
    all: "全部",
    frontend: "前端",
    backend: "后端",
    database: "数据库",
    devops: "运维",
    testing: "测试",
    design: "设计",
    mobile: "移动端",
    ai: "人工智能",
    other: "其他",
  };

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="w-full p-4 bg-white rounded-lg shadow-sm"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <div className="text-lg font-medium mb-1">{title}</div>
        <div className="text-sm text-gray-500 mb-3">{subtitle}</div>
      </motion.div>

      <Separator.Root className="h-px bg-gray-200 my-3" />

      <NavigationMenuPrimitive.Root>
        <NavigationMenuPrimitive.List className="space-y-2">
          {categories.map((category) => (
            <motion.div
              key={category}
              variants={itemVariants}
              whileHover={{
                x: 3,
                transition: { duration: 0.2 },
              }}
            >
              <div
                className={`flex justify-between items-center px-3 py-2 rounded-md cursor-pointer transition-all duration-200
                  ${hoveredCategory === category ? "bg-gray-50" : ""}
                  ${selectedCategory === category ? "bg-blue-50 text-blue-600 font-medium" : ""}`}
                onClick={() => onCategorySelect?.(category)}
                onMouseEnter={() => {
                  setHoveredCategory(category);
                }}
                onMouseLeave={() => {
                  setHoveredCategory(null);
                }}
              >
                <span>{categoryNames[category] || category}</span>
                <div className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                  1
                </div>
              </div>
            </motion.div>
          ))}
        </NavigationMenuPrimitive.List>
      </NavigationMenuPrimitive.Root>

      <AnimatePresence>
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Separator.Root className="h-px bg-gray-200 my-3" />
            <div className="text-lg font-medium mb-2">标签</div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.button
                  key={tag}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-md transition-colors"
                  onClick={() => onSelectTag?.(tag)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {onClearFilters && (
        <motion.div className="mt-4 text-right" variants={itemVariants}>
          <motion.button
            className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600 transition-colors"
            onClick={onClearFilters}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            清除筛选
            <svg
              className="w-3.5 h-3.5 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};
