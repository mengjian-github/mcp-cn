import { Box, Flex } from '@radix-ui/themes';
import { FC, useEffect, useState } from 'react';
import { RouteConfig } from '../route.config';

interface DocSidebarProps {
  className?: string;
  onDocChange?: (key: string) => void;
  currentPath?: string;
  routes: RouteConfig[];
}

// 提取共同的按钮样式
const commonButtonStyle = {
  height: '36px',
  borderRadius: '6px',
  padding: '0 12px',
  fontSize: '14px',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  cursor: 'pointer',
};

export const DocSidebar: FC<DocSidebarProps> = ({ className, onDocChange, currentPath, routes }) => {
  const [selectedKey, setSelectedKey] = useState<string>(currentPath ?? routes[0]?.path);

  useEffect(() => {
    // 只在组件挂载时触发一次初始加载
    if (routes.length > 0 && !currentPath) {
      const initialPath = routes[0].path;
      setSelectedKey(initialPath);
      onDocChange?.(initialPath);
    }
  }, []); // 仅在挂载时执行

  // 当 currentPath 改变时更新选中状态
  useEffect(() => {
    if (currentPath && currentPath !== selectedKey) {
      setSelectedKey(currentPath);
    }
  }, [currentPath]);

  const handleItemClick = (key: string, externalLink?: string) => {
    if (externalLink) {
      // 如果有外部链接，在新窗口打开
      window.open(externalLink, '_blank');
      return;
    }

    if (key === selectedKey) return; // 避免重复点击
    setSelectedKey(key);
    onDocChange?.(key);
  };

  if (routes.length === 0) {
    return (
      <Box p="4" className="text-gray-500">
        暂无文档内容
      </Box>
    );
  }

  return (
    <Box className={`overflow-y-auto ${className}`}>
      <Box py="4" px="3">
        {/* <div className="text-sm font-medium text-gray-500">文档导航</div> */}
        <div className="h-3"></div>
        <Flex direction="column" gap="2" mb="6">
          {routes.map((route) => {
            const isSelected = selectedKey === route.path;

            return (
              <button
                key={route.path}
                onClick={() => handleItemClick(route.path, route.externalLink)}
                style={{
                  ...commonButtonStyle,
                  backgroundColor: isSelected ? 'var(--blue-3)' : 'transparent',
                  color: isSelected ? 'var(--blue-11)' : 'var(--gray-11)',
                  fontWeight: isSelected ? 500 : 400,
                  border: 'none',
                }}
                className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-7 text-left transition-colors"
              >
                <Flex align="center" gap="2" width="100%">
                  {route.icon && (
                    <Box className="text-[18px] flex-shrink-0" style={{ opacity: 0.9 }}>
                      {route.icon}
                    </Box>
                  )}
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">{route.title}</span>
                </Flex>
              </button>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};
