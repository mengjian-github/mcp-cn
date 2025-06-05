#!/usr/bin/env node

import chalk from 'chalk';
import { type ValidClient, VALID_CLIENTS } from './constants';
import { installServer } from './commands/install';
import { list } from './commands/list';
import { setVerbose, verbose } from './logger';
import { run } from './commands/run/index';
import { uninstallServer } from './commands/uninstall';
import { showHelp } from './commands/help';
import { generateDeeplink, showDeeplinkHelp } from './commands/deeplink';
import { incrementUseCount } from './api';

const command = process.argv[2];
const argument = process.argv[3];
const clientFlag = process.argv.indexOf('--client');
const configFlag = process.argv.indexOf('--env');
const keyFlag = process.argv.indexOf('--key');
const platformFlag = process.argv.indexOf('--platform');
const verboseFlag = process.argv.includes('--verbose');
const helpFlag = process.argv.includes('--help');

// Set verbose mode based on flag
setVerbose(verboseFlag);

// Show help if --help flag is present or no command is provided
if (helpFlag || !command) {
  showHelp();
  process.exit(0);
}

const validateClient = (command: string, clientFlag: number): ValidClient | undefined => {
  /* Run, inspect, list, deeplink and help commands don't need client validation */
  if (['run', 'list', 'help', 'deeplink'].includes(command)) {
    return undefined;
  }

  /* For other commands, client is required */
  if (clientFlag === -1) {
    console.error(chalk.yellow(`请使用 --client 指定客户端。可用选项：${VALID_CLIENTS.join(', ')}`));
    process.exit(1);
  }

  /* only accept valid clients */
  const requestedClient = process.argv[clientFlag + 1];
  if (!VALID_CLIENTS.includes(requestedClient as ValidClient)) {
    console.error(chalk.yellow(`无效的客户端 "${requestedClient}"。可用选项：${VALID_CLIENTS.join(', ')}`));
    process.exit(1);
  }

  return requestedClient as ValidClient;
};

const client = validateClient(command, clientFlag);
/* config is set to empty if none given */
const config: Record<string, string> =
  configFlag !== -1
    ? (() => {
        try {
          let parsedConfig = JSON.parse(process.argv[configFlag + 1]) as Record<string, string>;
          verbose(`[Runner] Config flag: ${JSON.stringify(parsedConfig)}`);
          if (typeof parsedConfig === 'string') {
            parsedConfig = JSON.parse(parsedConfig) as Record<string, string>;
          }
          return parsedConfig;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(chalk.red(`Error parsing config: ${errorMessage}`));
          process.exit(1);
        }
      })()
    : {};

/* sets to undefined if no key given */
const apiKey: string | undefined = keyFlag !== -1 ? process.argv[keyFlag + 1] : undefined;

/* sets platform, defaults to mac */
const platform: 'mac' | 'windows' | 'linux' = 
  platformFlag !== -1 ? 
    (process.argv[platformFlag + 1] as 'mac' | 'windows' | 'linux') || 'mac' : 
    'mac';

async function main() {
  switch (command) {
    case 'help':
      showHelp();
      break;
    case 'install':
      if (!argument) {
        console.error(chalk.red('请提供要安装的服务器 ID'));
        process.exit(1);
      }
      incrementUseCount(argument);
      await installServer(argument, client, configFlag !== -1 ? config : undefined, apiKey);
      break;
    case 'uninstall':
      if (!argument) {
        console.error(chalk.red('请提供要卸载的服务器 ID'));
        process.exit(1);
      }
      incrementUseCount(argument);
      await uninstallServer(argument, client);
      break;
    case 'run':
      if (!argument) {
        console.error(chalk.red('请提供要运行的服务器 ID'));
        process.exit(1);
      }
      incrementUseCount(argument);
      await run(argument, config, apiKey);
      break;
    case 'list':
      await list(argument);
      break;
    case 'deeplink':
      if (!argument) {
        showDeeplinkHelp();
        process.exit(0);
      }
      incrementUseCount(argument);
      await generateDeeplink(argument, config, platform);
      break;
    default:
      showHelp();
  }
}

main();
