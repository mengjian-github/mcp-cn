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

export const API_BASE_URL = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/mcp_api`
  : 'https://mcphub.bytedance.net/mcp_api';
export const CONFIG_FILE_NAME = '.mcprc';

export const REGISTRY_ENDPOINT = process.env.REGISTRY_ENDPOINT;
export const ANALYTICS_ENDPOINT = process.env.ANALYTICS_ENDPOINT;

export const BRAND_NAME = '@mcp_hub_org';

export const PPE_HEADERS = {
  'x-tt-env': 'ppe_mcp',
  'x-use-ppe': '1',
};
