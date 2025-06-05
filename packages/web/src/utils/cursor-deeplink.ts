/**
 * Cursor深链接工具函数
 * 用于生成Cursor一键安装MCP服务的深链接
 */

/**
 * 将配置对象转换为base64编码的字符串
 */
function encodeConfigToBase64(config: Record<string, any>): string {
  const jsonString = JSON.stringify(config);
  return btoa(jsonString);
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
  const encodedConfig = encodeConfigToBase64(config);
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(serverName)}&config=${encodedConfig}`;
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
 * 验证深链接是否可用（检查是否在支持的环境中）
 */
export function isCursorDeeplinkSupported(): boolean {
  // 检查是否在浏览器环境中，并且不是移动设备
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  return !isMobile;
}

/**
 * 打开Cursor深链接
 * @param deeplink - 深链接字符串
 * @returns Promise<boolean> - 是否成功打开
 */
export async function openCursorDeeplink(deeplink: string): Promise<boolean> {
  if (!isCursorDeeplinkSupported()) {
    return false;
  }

  try {
    // 创建一个临时的a标签来触发深链接
    const link = document.createElement('a');
    link.href = deeplink;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Failed to open Cursor deeplink:', error);
    return false;
  }
}

/**
 * 格式化服务器名称用于深链接
 * 确保生成的名称只包含英文字符，不包含中文
 */
export function formatServerNameForDeeplink(qualifiedName: string, displayName?: string): string {
  // 检查displayName是否只包含英文字符（字母、数字、空格、连字符）
  const isEnglishOnly = (str: string) => /^[a-zA-Z0-9\s\-_.]+$/.test(str);
  
  // 如果有displayName且为纯英文，优先使用它
  if (displayName && displayName.trim() && isEnglishOnly(displayName)) {
    return displayName.trim().replace(/[^\w\s\-]/g, '').substring(0, 50);
  }
  
  // 否则使用qualified_name的简化版本
  // 移除包前缀，只保留最后的名称部分
  const simpleName = qualifiedName.split('/').pop() || qualifiedName;
  
  // 转换为友好格式：将连字符和下划线转换为空格，并进行首字母大写
  return simpleName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/[^\w\s]/g, '')
    .substring(0, 50)
    .trim();
} 