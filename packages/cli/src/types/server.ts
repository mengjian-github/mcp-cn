/**
 * 工具信息
 */
export interface ToolInfo {
  name: string;
  description?: string;
  version: string;
  author?: string;
  tags?: string[];
  parameters: {
    required?: string[];
    properties: Record<string, {
      type: string;
      description?: string;
      required?: boolean;
    }>;
  };
}

/**
 * 服务器配置
 */
export interface ServerConfig {
  id: string;
  name: string;
  description?: string;
  version: string;
  packageName: string;
  author?: string;
  homepage?: string;
  repository?: string;
  tags?: string[];
  tools: ToolInfo[];
  configSchema?: {
    type: string;
    properties: Record<string, {
      type: string;
      description?: string;
      default?: any;
      enum?: string[];
    }>;
  };
  isPrivate?: boolean;
  unpkgOn?: boolean;
  [key: string]: unknown;
} 