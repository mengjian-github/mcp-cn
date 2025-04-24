/**
 * 工具类型定义
 */
export interface ToolInfo {
  name: string;
  description?: string;
  inputSchema: {
    type: string;
    required?: string[];
    properties: Record<
      string,
      {
        type: string;
        properties: Record<string, { type: string }>;
        description?: string;
      }
    >;
  };
}

/**
 * 使用示例类型定义
 */
export interface UsageSample {
  id: number;
  title: string;
  code: string;
  description: string;
}

/**
 * 用户数据类型定义
 */
export interface UserData {
  username: string;
  displayName: string;
  logo: string;
  bio: string;
  followers: number;
  projects: number;
}

/**
 * 评价类型定义
 */
export interface Review {
  id: number;
  username: string;
  logo: string;
  rating: number;
  comment: string;
  date: string;
}
