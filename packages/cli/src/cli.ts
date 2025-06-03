#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createServer } from './commands/create.js';
import { listServers } from './commands/list.js';
import { publishServer } from './commands/publish.js';
import { searchServers } from './commands/search.js';

const program = new Command();

program
  .name('mcp-hub')
  .description('MCP Hub 中国 - 命令行工具')
  .version('1.0.0');

// 创建 MCP 服务器模板
program
  .command('create')
  .description('创建新的 MCP 服务器项目')
  .argument('[name]', '项目名称')
  .option('-t, --template <template>', '使用指定模板', 'basic')
  .option('-d, --dir <directory>', '项目目录')
  .action(createServer);

// 列出可用的 MCP 服务器
program
  .command('list')
  .description('列出所有可用的 MCP 服务器')
  .option('-c, --category <category>', '按分类筛选')
  .option('-l, --limit <number>', '限制结果数量', '20')
  .action(listServers);

// 搜索 MCP 服务器
program
  .command('search')
  .description('搜索 MCP 服务器')
  .argument('[query]', '搜索关键词')
  .option('-c, --category <category>', '按分类筛选')
  .action(searchServers);

// 发布 MCP 服务器
program
  .command('publish')
  .description('发布 MCP 服务器到 Hub')
  .option('-p, --path <path>', '项目路径', '.')
  .option('--dry-run', '预览发布内容')
  .action(publishServer);

// 错误处理
program.configureOutput({
  outputError: (str, write) => {
    write(chalk.red('❌ ' + str));
  }
});

// 解析命令行参数
program.parse();

// 如果没有提供任何命令，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
} 