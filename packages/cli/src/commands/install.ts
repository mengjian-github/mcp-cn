/* remove punycode depreciation warning */
process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.message.includes('punycode')) {
    return;
  }
  console.warn(warning);
});

import chalk from 'chalk';
import ora from 'ora';
import { readConfig, writeConfig } from '../client-config';
import type { ValidClient } from '../constants';
import { verbose } from '../logger';
import { resolvePackage, fetchConfigWithApiKey } from '../registry.js';
import { ensureUVInstalled, ensureBunInstalled, checkAndNotifyRemoteServer } from '../utils/runtime';
import { chooseConnection, collectConfigValues, getServerName, formatServerConfig } from '../utils/config';
import { checkAnalyticsConsent } from '../utils/analytics';
import { promptForRestart } from '../utils/client';
import { RegistryServer, ServerConfig } from '../types/registry';
import { incrementUseCount } from '../api';

interface InstallServerConfig extends ServerConfig {
  connection:
    | {
        type: 'websocket';
        url: string;
      }
    | {
        type: 'stdio';
        command: string;
      };
}

/**
 * Installs and configures a server for a specified client.
 * Prompts for config values if config not given OR saved config not valid
 *
 * @param {string} qualifiedName - The fully qualified name of the server package to install
 * @param {ValidClient} client - The client to install the server for
 * @param {Record<string, unknown>} [configValues] - Optional configuration values for the server
 * @param {string} [apiKey] - Optional API key to fetch saved config
 * @returns {Promise<void>} A promise that resolves when installation is complete
 * @throws Will throw an error if installation fails
 */
export async function installServer(
  qualifiedName: string,
  client?: ValidClient,
  configValues: Record<string, string> = {},
  apiKey?: string,
  customPath?: string,
): Promise<void> {
  if (!client) {
    throw new Error('Client is required');
  }

  verbose(`Starting installation of ${qualifiedName} for client ${client}`);

  /* start resolving in background */
  verbose(`Resolving package: ${qualifiedName}`);

  // Resolve server based on whether an API key is provided
  let serverPromise: Promise<RegistryServer>;
  let savedConfig: ServerConfig | undefined = undefined;

  if (apiKey) {
    verbose('API key provided, fetching server details and saved config');
    serverPromise = fetchConfigWithApiKey(qualifiedName, apiKey)
      .then((result) => {
        savedConfig = result.config;
        return result.server;
      })
      .catch((error) => {
        console.warn(
          chalk.yellow('[Install] Failed to fetch config with API key:'),
          error instanceof Error ? error.message : String(error),
        );
        // Fall back to standard resolution
        verbose('Falling back to standard package resolution');
        return resolvePackage(qualifiedName);
      });
  } else {
    serverPromise = resolvePackage(qualifiedName);
  }

  try {
    // verbose("Checking analytics consent...")
    // await checkAnalyticsConsent()
    verbose('Skip analytics consent check');
  } catch (error) {
    console.warn(
      chalk.yellow('[Analytics] Failed to check consent:'),
      error instanceof Error ? error.message : String(error),
    );
    verbose(`Analytics consent check error details: ${JSON.stringify(error)}`);
  }

  const spinner = ora(`Resolving ${qualifiedName}...`).start();
  try {
    verbose('Awaiting package resolution...');
    const server = await serverPromise;
    verbose(`Package resolved successfully: ${server.data.qualifiedName}`);
    spinner.succeed(`Successfully resolved ${qualifiedName}`);

    verbose('Choosing connection type...');
    const connection = chooseConnection(server);
    verbose(`Selected connection: ${JSON.stringify(connection, null, 2)}`);

    /* Check for required runtimes and install if needed */
    await ensureUVInstalled(connection);
    await ensureBunInstalled(connection);

    /* inform users of remote server installation */
    checkAndNotifyRemoteServer(server.data);

    // Merge configs, with user-provided values taking precedence
    const mergedConfigValues = savedConfig
      ? { ...(savedConfig as Record<string, string>), ...(configValues || {}) }
      : configValues;

    // Get the validated config values, prompt if additional values are needed
    // const collectedConfigValues = await collectConfigValues(
    // 	connection,
    // 	mergedConfigValues || {},
    // )

    const collectedConfigValues = mergedConfigValues || {};

    // Determine if we need to pass config flag
    // If user provided config values, always use them
    const configFlagNeeded = !!configValues;

    verbose(`Config values: ${JSON.stringify(collectedConfigValues, null, 2)}`);
    verbose(`Using config flag: ${configFlagNeeded}`);

    verbose('Formatting server configuration...');
    const serverConfig = formatServerConfig(
      qualifiedName,
      collectedConfigValues,
      apiKey,
      configFlagNeeded, // Only include config if it differs from saved config
    );
    verbose(`Formatted server config: ${JSON.stringify(serverConfig, null, 2)}`);

    /* read config from client */
    verbose(`Reading configuration for client: ${client}`);
    const config = readConfig(client, customPath);
    verbose('Normalizing server ID...');
    const serverName = getServerName(qualifiedName);
    verbose(`Normalized server ID: ${serverName}`);

    verbose('Updating client configuration...');
    // Handle Claude Code using its native CLI commands
    if (client === 'claude-code') {
      verbose('Using Claude Code CLI to add MCP server...');
      const { spawn } = await import('child_process');

      // Type guard to ensure we have a stdio connection
      if (!('command' in serverConfig) || !('args' in serverConfig)) {
        throw new Error('Invalid server configuration for Claude Code');
      }

      // Build the claude mcp add command
      const claudeArgs = [
        'mcp',
        'add',
        serverName
      ];

      // Add environment variables if present
      if (serverConfig.env && typeof serverConfig.env === 'object') {
        for (const [key, value] of Object.entries(serverConfig.env)) {
          if (typeof value === 'string') {
            claudeArgs.push('-e', `${key}=${value}`);
          }
        }
      }

      // Add the separator and command
      claudeArgs.push('--');
      claudeArgs.push(serverConfig.command);
      if (serverConfig.args && Array.isArray(serverConfig.args)) {
        claudeArgs.push(...serverConfig.args);
      }

      verbose(`Claude Code command: claude ${claudeArgs.join(' ')}`);

      const claudeProcess = spawn('claude', claudeArgs, {
        stdio: 'inherit',
        shell: false,
      });

      await new Promise<void>((resolve, reject) => {
        claudeProcess.on('close', (code) => {
          if (code === 0) {
            verbose('Claude Code MCP server added successfully');
            resolve();
          } else {
            reject(new Error(`Claude Code process exited with code ${code}`));
          }
        });

        claudeProcess.on('error', (error) => {
          reject(new Error(`Failed to spawn claude process: ${error.message}`));
        });
      });
    } else {
      config.mcpServers[serverName] = serverConfig;
      verbose('Writing updated configuration...');
      writeConfig(config, client, customPath);
      verbose('Configuration successfully written');
    }
    console.log(chalk.green(`${qualifiedName} successfully installed for ${client}`));
    verbose('Prompting for client restart...');
    await promptForRestart(client);
    verbose('Installation process completed');
  } catch (error) {
    spinner.fail(`Failed to install ${qualifiedName}`);
    verbose(`Installation error: ${error instanceof Error ? error.stack : JSON.stringify(error)}`);
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    } else {
      console.error(chalk.red('An unexpected error occurred during installation'));
    }
    process.exit(1);
  }
}

export async function install(serverId: string, config: Partial<InstallServerConfig> = {}): Promise<void> {
  const serverConfig: InstallServerConfig = {
    id: serverId,
    name: serverId,
    version: '1.0.0',
    packageName: `@mcp/${serverId}`,
    connection: {
      type: 'websocket',
      url: '',
    },
  };

  for (const [key, value] of Object.entries(config)) {
    if (value !== undefined) {
      if (key === 'connection' && typeof value === 'object' && value !== null) {
        const connectionValue = value as Partial<InstallServerConfig['connection']>;
        if (connectionValue.type === 'websocket') {
          serverConfig.connection = {
            type: 'websocket',
            url: connectionValue.url || '',
          };
        } else if (connectionValue.type === 'stdio') {
          serverConfig.connection = {
            type: 'stdio',
            command: (connectionValue as { command?: string }).command || '',
          };
        }
      } else if (key === 'id' || key === 'name' || key === 'version' || key === 'packageName') {
        (serverConfig as any)[key] = value;
      }
    }
  }

  const clientConfig = readConfig('cursor');
  const configuredServer =
    serverConfig.connection.type === 'websocket'
      ? {
          type: 'ws' as const,
          url: serverConfig.connection.url,
          config: {},
        }
      : {
          command: (serverConfig.connection as { type: 'stdio'; command: string }).command,
          args: [],
          env: {},
        };

  clientConfig.mcpServers[serverId] = configuredServer;
  writeConfig(clientConfig, 'cursor');

  console.log(chalk.green(`Server ${serverId} successfully installed`));
  await promptForRestart('cursor');
}
