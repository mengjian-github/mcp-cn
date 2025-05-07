import {
  BookmarkIcon,
  CodeIcon,
  GearIcon,
  IdCardIcon,
  LightningBoltIcon,
  RocketIcon,
  StackIcon,
} from "@radix-ui/react-icons";
import { ReactNode } from "react";

interface ModuleType {
  default: React.ComponentType;
  meta?: Record<string, unknown>;
}

interface RouteConfig {
  path: string;
  component: () => Promise<ModuleType>;
  title: string;
  description: string;
  icon?: ReactNode;
  externalLink?: string;
  lastUpdated?: string;
}

export const routes: RouteConfig[] = [
  {
    path: "/docs/getting-started",
    component: () => import("../zh/guide/getting-started.mdx"),
    title: "快速上手",
    description: "快速了解和上手 MCP Hub，让你的 AI 应用更强大 ！",
    icon: <RocketIcon width={18} height={18} />,
    lastUpdated: "2025-04-19",
  },
  {
    path: "/docs/basic-concepts",
    component: () => Promise.resolve({ default: () => <div /> }),
    title: "基础概念",
    externalLink: "https://modelcontextprotocol.io/introduction",
    description: "了解 MCP 的核心概念",
    icon: <BookmarkIcon width={18} height={18} />,
    lastUpdated: "2025-04-19",
  },
  {
    path: "/docs/clients",
    component: () => import("../zh/guide/clients.mdx"),
    title: "客户端指南",
    description: "MCP 客户端安装及使用指南",
    icon: <IdCardIcon width={18} height={18} />,
    lastUpdated: "2025-04-19",
  },
  {
    path: "/docs/development",
    component: () => import("../zh/guide/dev-guide.mdx"),
    title: "开发指南",
    description: "来开发一个属于你的 MCP Server 吧 ！",
    icon: <CodeIcon width={18} height={18} />,
    lastUpdated: "2025-04-19",
  },
  {
    path: "/docs/register",
    component: () => import("../zh/guide/register-guide.mdx"),
    title: "注册 Server",
    description: "快来注册你的 MCP Server 吧 ！",
    icon: <GearIcon width={18} height={18} />,
    lastUpdated: "2025-04-19",
  },
  {
    path: "/docs/cli",
    component: () => import("../zh/guide/cli-guide.mdx"),
    title: "CLI 工具",
    description: "MCP Hub CLI 工具使用指南",
    icon: <LightningBoltIcon width={18} height={18} />,
    lastUpdated: "2025-04-19",
  },
  {
    path: "/docs/blogs",
    component: () => import("../zh/guide/blogs.mdx"),
    title: "推荐文章",
    description: "MCP Hub 推荐的技术文章",
    icon: <StackIcon width={18} height={18} />,
    lastUpdated: "2025-04-19",
  },
];
