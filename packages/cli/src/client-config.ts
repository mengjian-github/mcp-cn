import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { MCPConfig } from './types/registry.js';
import { verbose } from './logger';

export interface ClientConfig extends MCPConfig {
  [key: string]: any;
}

// Initialize platform-specific paths
const homeDir = os.homedir();

const platformPaths = {
  win32: {
    baseDir: process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'),
    vscodePath: path.join('Code', 'User', 'globalStorage'),
  },
  darwin: {
    baseDir: path.join(homeDir, 'Library', 'Application Support'),
    vscodePath: path.join('Code', 'User', 'globalStorage'),
  },
  linux: {
    baseDir: process.env.XDG_CONFIG_HOME || path.join(homeDir, '.config'),
    vscodePath: path.join('Code/User/globalStorage'),
  },
};

const platform = process.platform as keyof typeof platformPaths;
const { baseDir, vscodePath } = platformPaths[platform];

// Define client paths using the platform-specific base directories
const clientPaths: Record<string, string> = {
  trae: path.join(baseDir, 'Trae CN', 'User', 'mcp.json'),
  'trae-global': path.join(baseDir, 'Trae', 'User', 'mcp.json'),
  claude: path.join(baseDir, 'Claude', 'claude_desktop_config.json'),
  // claude-code: managed by claude mcp add-json command, no config file needed
  cline: path.join(baseDir, vscodePath, 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'),
  'roo-cline': path.join(baseDir, vscodePath, 'rooveterinaryinc.roo-cline', 'settings', 'cline_mcp_settings.json'),
  windsurf: path.join(homeDir, '.codeium', 'windsurf', 'mcp_config.json'),
  witsy: path.join(baseDir, 'Witsy', 'settings.json'),
  enconvo: path.join(homeDir, '.config', 'enconvo', 'mcp_config.json'),
  cursor: path.join(homeDir, '.cursor', 'mcp.json'),
};

// Custom path storage for user-defined installation paths
let customPaths: Record<string, string> = {};

export function setCustomPath(client: string, customPath: string): void {
  verbose(`Setting custom path for ${client}: ${customPath}`);
  customPaths[client] = customPath;
}

export function getConfigPath(client?: string, customPath?: string): string {
  const normalizedClient = client?.toLowerCase() || 'claude';
  verbose(`Getting config path for client: ${normalizedClient}`);

  // Claude Code doesn't use traditional config files
  if (normalizedClient === 'claude-code') {
    verbose('Claude Code uses claude mcp add-json command, no config file needed');
    return ''; // Return empty string to indicate no config file needed
  }

  // Use custom path if provided for this call
  if (customPath) {
    verbose(`Using provided custom path: ${customPath}`);
    return customPath;
  }

  // Use stored custom path if available
  if (customPaths[normalizedClient]) {
    verbose(`Using stored custom path: ${customPaths[normalizedClient]}`);
    return customPaths[normalizedClient];
  }

  const configPath =
    clientPaths[normalizedClient] ||
    path.join(path.dirname(clientPaths.claude), '..', client || 'claude', `${normalizedClient}_config.json`);

  verbose(`Config path resolved to: ${configPath}`);
  return configPath;
}

export function readConfig(client: string, customPath?: string): ClientConfig {
  verbose(`Reading config for client: ${client}`);
  
  // Claude Code doesn't use traditional config files
  if (client === 'claude-code') {
    verbose('Claude Code uses native CLI commands, returning empty config');
    return { mcpServers: {} };
  }
  
  try {
    const configPath = getConfigPath(client, customPath);
    verbose(`Checking if config file exists at: ${configPath}`);

    if (!fs.existsSync(configPath)) {
      verbose(`Config file not found, returning default empty config`);
      return { mcpServers: {} };
    }

    verbose(`Reading config file content`);
    const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    verbose(`Config loaded successfully: ${JSON.stringify(rawConfig, null, 2)}`);

    return {
      ...rawConfig,
      mcpServers: rawConfig.mcpServers || {},
    };
  } catch (error) {
    verbose(`Error reading config: ${error instanceof Error ? error.stack : JSON.stringify(error)}`);
    return { mcpServers: {} };
  }
}

export function writeConfig(config: ClientConfig, client?: string, customPath?: string): void {
  verbose(`Writing config for client: ${client || 'default'}`);
  
  // Claude Code doesn't use traditional config files
  if (client === 'claude-code') {
    verbose('Claude Code uses native CLI commands, skipping config file write');
    return;
  }
  
  verbose(`Config data: ${JSON.stringify(config, null, 2)}`);

  const configPath = getConfigPath(client, customPath);
  const configDir = path.dirname(configPath);

  verbose(`Ensuring config directory exists: ${configDir}`);
  if (!fs.existsSync(configDir)) {
    verbose(`Creating directory: ${configDir}`);
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!config.mcpServers || typeof config.mcpServers !== 'object') {
    verbose(`Invalid mcpServers structure in config`);
    throw new Error('Invalid mcpServers structure');
  }

  let existingConfig: ClientConfig = { mcpServers: {} };
  try {
    if (fs.existsSync(configPath)) {
      verbose(`Reading existing config file for merging`);
      existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      verbose(`Existing config loaded: ${JSON.stringify(existingConfig, null, 2)}`);
    }
  } catch (error) {
    verbose(`Error reading existing config for merge: ${error instanceof Error ? error.message : String(error)}`);
    // If reading fails, continue with empty existing config
  }

  verbose(`Merging configs`);
  const mergedConfig = {
    ...existingConfig,
    ...config,
  };
  verbose(`Merged config: ${JSON.stringify(mergedConfig, null, 2)}`);

  verbose(`Writing config to file: ${configPath}`);
  fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2));
  verbose(`Config successfully written`);
}
