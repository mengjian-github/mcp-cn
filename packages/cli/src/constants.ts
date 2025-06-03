export const VALID_CLIENTS = [
  'trae',
  'cline',
  'cursor',
  // 'claude',
  'windsurf',
  // 'roo-cline',
  // 'witsy',
  // 'enconvo',
] as const;

export type ValidClient = (typeof VALID_CLIENTS)[number];

export const API_BASE_URL = 'https://www.mcp-cn.com/api';
export const CONFIG_FILE_NAME = '.mcprc';

export const REGISTRY_ENDPOINT = process.env.REGISTRY_ENDPOINT;
export const ANALYTICS_ENDPOINT = process.env.ANALYTICS_ENDPOINT;

export const BRAND_NAME = '@mcp_hub_org';