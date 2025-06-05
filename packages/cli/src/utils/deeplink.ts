/**
 * CLI深链接工具函数
 * 用于生成Cursor一键安装MCP服务的深链接
 */

/**
 * 将配置对象转换为base64编码的字符串
 */
function encodeConfigToBase64(config: Record<string, any>): string {
  const jsonString = JSON.stringify(config);
  return Buffer.from(jsonString).toString('base64');
}

/**
 * 生成Cursor MCP安装深链接
 * @param serverName - 服务器名称
 * @param config - 服务器配置对象
 * @returns Cursor深链接字符串
 */
export function generateCursorDeeplink(
  serverName: string,
  config: Record<string, any>
): string {
  // 验证参数
  if (!serverName || typeof serverName !== 'string' || !serverName.trim()) {
    throw new Error('Missing "name" parameter in deep link: serverName is required and must be a non-empty string');
  }
  
  if (!config || typeof config !== 'object' || Object.keys(config).length === 0) {
    throw new Error('Missing "config" parameter in deep link: config is required and must be a non-empty object');
  }

  const encodedConfig = encodeConfigToBase64(config);
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(serverName.trim())}&config=${encodedConfig}`;
}

/**
 * 根据服务器信息生成标准的MCP配置
 * @param qualifiedName - 服务器的完整名称
 * @param envConfig - 环境变量配置
 * @param platform - 操作系统平台
 * @returns MCP配置对象
 */
export function generateMCPConfig(
  qualifiedName: string,
  envConfig: Record<string, string> = {},
  platform: 'mac' | 'windows' | 'linux' = 'mac'
): Record<string, any> {
  const CLI_PACKAGE_NAME = "@mcp_hub_org/cli@latest";
  const commonCommand = [CLI_PACKAGE_NAME, "run", qualifiedName];
  
  const envObj = Object.keys(envConfig).length > 0 ? { env: envConfig } : {};

  if (platform === "windows") {
    return {
      command: "cmd",
      args: ["/c", "npx", "-y", ...commonCommand],
      ...envObj,
    };
  } else {
    return {
      command: "npx",
      args: ["-y", ...commonCommand],
      ...envObj,
    };
  }
}

/**
 * 格式化服务器名称用于深链接
 * 优先使用display_name，如果不可用则使用qualified_name的简化版本
 */
export function formatServerNameForDeeplink(qualifiedName: string, displayName?: string): string {
  // 验证输入参数
  if (!qualifiedName || typeof qualifiedName !== 'string') {
    console.error('formatServerNameForDeeplink: qualifiedName is required and must be a string');
    return 'Unknown Server';
  }

  // 如果有displayName，优先使用它（移除特殊字符但保留空格）
  if (displayName && displayName.trim()) {
    const formatted = displayName.trim().replace(/[^\w\s\-]/g, '').substring(0, 50);
    return formatted || 'Unknown Server';
  }
  
  // 否则使用qualified_name的简化版本
  // 移除包前缀，只保留最后的名称部分
  const simpleName = qualifiedName.split('/').pop() || qualifiedName;
  
  // 转换为友好格式：将连字符和下划线转换为空格，并进行首字母大写
  const formatted = simpleName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/[^\w\s]/g, '')
    .substring(0, 50)
    .trim();
    
  return formatted || simpleName || 'Unknown Server';
} 