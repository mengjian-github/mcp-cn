"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { Box, Container, Flex } from "@radix-ui/themes";
import Head from "next/head";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import { DocContent } from "./components/docs-content";
import { DocSidebar } from "./components/docs-sidebar";
import { routes } from "./route.config";

interface RouteModule {
  default: FC;
  meta?: {
    title?: string;
    description?: string;
  };
}

/**
 * 文档页面组件
 */
const DocsPage: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>();
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  // 处理文档切换
  const handleDocChange = useCallback(
    async (path: string) => {
      setLoading(true);
      try {
        const matchingRoute = routes.find((r) => r.path === path);
        if (matchingRoute) {
          router.push(path);
          setCurrentPath(path);
        }
      } catch (error) {
        console.error("Failed to load doc:", error);
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  // 初始加载文档
  useEffect(() => {
    if (routes.length > 0) {
      const initialPath = pathname;
      const matchingRoute = routes.find((r) => r.path === initialPath);

      if (matchingRoute) {
        void handleDocChange(initialPath);
      } else {
        void handleDocChange(routes[0].path);
      }
    }
  }, [pathname, handleDocChange]);

  const renderContent = () => {
    if (routes.length === 0) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">暂无文档</p>
        </div>
      );
    }

    return (
      <Box className="min-h-screen bg-gray-50">
        <Head>
          <title>MCP Hub 文档中心</title>
        </Head>

        <Container size="4">
          <Flex gap="6" className="py-8">
            <DocSidebar
              routes={routes}
              currentPath={currentPath}
              onDocChange={handleDocChange}
            />
            <Box className="flex-1 min-w-0">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <ReloadIcon className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : (
                <DocContent content={content} />
              )}
            </Box>
          </Flex>
        </Container>
      </Box>
    );
  };

  return renderContent();
};

export default DocsPage;
