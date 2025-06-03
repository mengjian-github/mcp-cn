import * as RadixTabs from "@radix-ui/react-toggle-group";
import { FC } from "react";

interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export const Tabs: FC<TabsProps> = ({
  items,
  value,
  onChange,
  className = "flex px-4 pt-2 bg-white border-b border-gray-100",
  itemClassName = "flex items-center px-3 py-2 mr-2 rounded-t-md transition-colors duration-200",
  activeClassName = "text-gray-700 bg-gray-50 border-b-2 border-gray-400 font-medium",
  inactiveClassName = "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
}) => {
  return (
    <RadixTabs.Root
      className={className}
      type="single"
      value={value}
      onValueChange={(value: string) => {
        if (value) {
          onChange(value);
        }
      }}
    >
      {items.map((item) => (
        <RadixTabs.Item
          key={item.value}
          className={`${itemClassName} ${value === item.value ? activeClassName : inactiveClassName}`}
          value={item.value}
        >
          {!!item.icon && (
            <div className="w-4 h-4 mr-2 flex items-center justify-center">
              {item.icon}
            </div>
          )}
          <span>{item.label}</span>
        </RadixTabs.Item>
      ))}
    </RadixTabs.Root>
  );
};
