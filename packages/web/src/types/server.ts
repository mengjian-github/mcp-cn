/**
 * MCP服务器模型
 */
export interface McpServerModel {
  server_id: number;
  logo: string;
  qualified_name: string;
  display_name: string;
  description: string;
  repository_id: string;
  creator: string;
  type: number | null;
  introduction: string | null;
  connections: string; // JSON字符串
  package_url: string;
  use_count: number;
  created_at: string;
  updated_at: string;
  tag: string | null;
  is_domestic?: boolean; // 是否为国内服务
}

/**
 * 服务器列表请求参数
 */
export interface ListMcpServersRequest {
  keywords?: string;
  page?: number;
  pageSize?: number;
}

/**
 * 服务器列表响应
 */
export interface ListMcpServersResponse {
  code: number;
  message: string;
  data: McpServerModel[];
  pagination: {
    total: number;
    page?: number;
    pageSize?: number;
  };
}

/**
 * 获取服务器详情请求参数
 */
export interface GetMcpServerRequest {
  qualifiedName: string;
}

/**
 * 获取服务器详情响应
 */
export interface GetMcpServerResponse {
  code: number;
  message: string;
  data: McpServerModel;
}

export interface McpToolModel {
  id: number;
  qualified_name: string;
  tools: string; // JSON字符串
}

export interface GetMcpToolResponse {
  code: number;
  message: string;
  data: McpToolModel;
}

/**
 * 注册服务器请求参数
 */
export interface RegisterMcpServerRequest {
  qualifiedName: string;
  displayName: string;
  packageName: string;
  description?: string;
  type?: string;
  introduction?: string;
  logo?: string;
  connection?: {
    type: string;
    [key: string]: any;
  };
}

/**
 * 注册服务器响应
 */
export interface RegisterMcpServerResponse {
  code: number;
  message: string;
}

/**
 * 移除服务器请求参数
 */
export interface RemoveMcpServerRequest {
  qualifiedName: string;
}

/**
 * 移除服务器响应
 */
export interface RemoveMcpServerResponse {
  code: number;
  message: string;
  data: {
    qualifiedName: string;
    success: boolean;
  };
}

/**
 * 更新服务器响应
 */
export interface UpdateMcpServerResponse {
  code: number;
  message: string;
} 