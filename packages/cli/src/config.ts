import { homedir } from 'os';
import { join } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { ValidClient } from './constants';
import logger from './logger';

const CONFIG_PATHS: Record<ValidClient, string> = {
  trae: join(homedir(), '.trae'),
  'trae-global': join(homedir(), '.trae-global'),
  cline: join(homedir(), '.cline'),
  cursor: join(homedir(), '.cursor'),
  // claude: join(homedir(), '.claude'),
  windsurf: join(homedir(), '.windsurf'),
  // 'roo-cline': join(homedir(), '.roo-cline'),
  // witsy: join(homedir(), '.witsy'),
  // enconvo: join(homedir(), '.enconvo'),
};
export interface Config {
  mcpServers: Record<string, ServerConfig>;
}

export interface ServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export async function ensureConfigDir(client: ValidClient): Promise<void> {
  try {
    await mkdir(CONFIG_PATHS[client], { recursive: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`无法创建配置目录: ${errorMessage}`);
    throw error;
  }
}

export async function readClientConfig(client: ValidClient): Promise<Config> {
  try {
    const configPath = join(CONFIG_PATHS[client], '.mcprc');
    const content = await readFile(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { mcpServers: {} };
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`读取配置文件失败: ${errorMessage}`);
    throw error;
  }
}

export async function writeClientConfig(client: ValidClient, config: Config): Promise<void> {
  try {
    const configPath = join(CONFIG_PATHS[client], '.mcprc');
    await writeFile(configPath, JSON.stringify(config, null, 2));
    logger.debug(`已更新配置: ${configPath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`写入配置文件失败: ${errorMessage}`);
    throw error;
  }
}
