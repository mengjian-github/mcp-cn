import { ServerConfig } from './registry';

/**
 * 配置类型
 */
export interface Config extends ServerConfig {
  [key: string]: unknown;
} 