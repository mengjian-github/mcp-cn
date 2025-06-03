import { API_BASE_URL } from './constants';
import { ServerInfo } from './types/registry';
import * as logger from './logger';
import fetch from 'cross-fetch';

/**
 * 从注册表获取服务器信息
 */
export async function getServerInfo(serverId: string): Promise<ServerInfo> {
  try {
    logger.debug(`从API获取服务器信息: ${serverId}`);
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}`);

    if (!response.ok) {
      throw new Error(`API错误: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error(`获取服务器信息失败: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * 获取所有可用的服务器列表
 */
export async function listServers(): Promise<ServerInfo[]> {
  try {
    logger.debug('从API获取所有服务器');
    const response = await fetch(`${API_BASE_URL}/servers`);

    if (!response.ok) {
      throw new Error(`API错误: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error(`获取服务器列表失败: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * 搜索服务器
 */
export async function searchServers(query: string): Promise<ServerInfo[]> {
  try {
    logger.debug(`搜索服务器: ${query}`);
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`API错误: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error(`搜索服务器失败: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * 增加服务器使用次数
 */
export function incrementUseCount(qualifiedName: string): void {
  logger.verbose(`增加服务器使用次数: ${qualifiedName}`);
  fetch(`${API_BASE_URL}/servers/increment_use_count`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ qualifiedName }),
  })
    .then(() => {
      logger.verbose(`服务器使用次数增加成功: ${qualifiedName}`);
    })
    .catch(() => {
      logger.verbose(`增加服务器使用次数失败: ${qualifiedName}`);
    });
}
