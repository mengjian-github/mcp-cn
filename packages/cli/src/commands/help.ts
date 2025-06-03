import chalk from 'chalk';
import { pastel } from 'gradient-string';
import Table from 'cli-table3';
import { VALID_CLIENTS } from '../constants';

const logo = `
              ███╗   ███╗ ██████╗██████╗    ██╗  ██╗██╗   ██╗██████╗ 
              ████╗ ████║██╔════╝██╔══██╗   ██║  ██║██║   ██║██╔══██╗
              ██╔████╔██║██║     ██████╔╝   ███████║██║   ██║██████╔╝
              ██║╚██╔╝██║██║     ██╔═══╝    ██╔══██║██║   ██║██╔══██╗
              ██║ ╚═╝ ██║╚██████╗██║        ██║  ██║╚██████╔╝██████╔╝
              ╚═╝     ╚═╝ ╚═════╝╚═╝        ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ `;

export const centerText = (text: string, width = 80): string => {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const padding = Math.max(0, Math.floor((width - line.length) / 2));
      return ' '.repeat(padding) + line;
    })
    .join('\n');
};

const createCommandTable = () => {
  const table = new Table({
    chars: {
      top: '─',
      'top-mid': '┬',
      'top-left': '┌',
      'top-right': '┐',
      bottom: '─',
      'bottom-mid': '┴',
      'bottom-left': '└',
      'bottom-right': '┘',
      left: '│',
      'left-mid': '├',
      mid: '─',
      'mid-mid': '┼',
      right: '│',
      'right-mid': '┤',
      middle: '│',
    },
    style: {
      head: ['cyan'],
      border: ['dim'],
    },
    colWidths: [36, 44],
  });

  table.push(
    [{ colSpan: 2, content: chalk.magenta.bold('命令') }],
    [chalk.cyan('install <MCP Server ID>'), '安装 MCP Server 到指定客户端'],
    [chalk.cyan('uninstall <MCP Server ID>'), '从指定客户端卸载 MCP Server'],
    [chalk.cyan('run <MCP Server ID>'), '直接运行指定 MCP Server'],
    [chalk.cyan('list'), '列出所有可用的客户端'],
    [chalk.cyan('help'), '显示帮助信息'],
  );

  return table;
};

const createOptionsTable = () => {
  const table = new Table({
    chars: {
      top: '─',
      'top-mid': '┬',
      'top-left': '┌',
      'top-right': '┐',
      bottom: '─',
      'bottom-mid': '┴',
      'bottom-left': '└',
      'bottom-right': '┘',
      left: '│',
      'left-mid': '├',
      mid: '─',
      'mid-mid': '┼',
      right: '│',
      'right-mid': '┤',
      middle: '│',
    },
    style: {
      head: ['cyan'],
      border: ['dim'],
    },
    colWidths: [36, 44],
  });

  table.push(
    [{ colSpan: 2, content: chalk.magenta.bold('选项') }],
    [chalk.cyan('--client, -c <客户端>'), '指定目标 MCP 客户端'],
    [chalk.cyan('--env <JSON>'), '提供 JSON 格式的环境变量'],
    // [chalk.cyan('--key <密钥>'), '提供 API 密钥'],
    [chalk.cyan('--help, -h'), '显示帮助信息'],
  );

  return table;
};

const createExamplesTable = () => {
  const table = new Table({
    chars: {
      top: '─',
      'top-mid': '┬',
      'top-left': '┌',
      'top-right': '┐',
      bottom: '─',
      'bottom-mid': '┴',
      'bottom-left': '└',
      'bottom-right': '┘',
      left: '│',
      'left-mid': '├',
      mid: '─',
      'mid-mid': '┼',
      right: '│',
      'right-mid': '┤',
      middle: '│',
    },
    style: {
      head: ['cyan'],
      border: ['dim'],
    },
    colWidths: [81],
  });

  table.push(
    [chalk.magenta.bold('示例')],
    [chalk.dim('$ ') + chalk.cyan('mcp install sequential-thinking --client cursor')],
    [chalk.dim('$ ') + chalk.cyan('mcp uninstall sequential-thinking --client cursor')],
    [chalk.dim('$ ') + chalk.cyan('mcp run sequential-thinking')],
    [chalk.dim('$ ') + chalk.cyan('mcp list')],
  );

  return table;
};

export function showHelp() {
  // 显示渐变色 logo
  console.log(pastel.multiline(logo));
  console.log();

  // 显示描述信息
  const description = chalk.bold('  @mcp_hub_org/cli 是一个用于安装、运行和管理 MCP Hub 平台 MCP Server 的命令行工具');
  console.log(description);
  console.log();

  // 显示用法
  console.log(chalk.magenta.bold('基本用法') + chalk.dim('  $ ') + chalk.cyan('mcp <命令> [参数] [选项]'));
  console.log();

  // 显示命令表格
  console.log(createCommandTable().toString());
  console.log('');

  // 显示选项表格
  console.log(createOptionsTable().toString());
  console.log('');

  // 显示支持的客户端
  console.log(chalk.magenta.bold('MCP 客户端') + '  ' + VALID_CLIENTS.join('  '));
  console.log('');

  // 显示示例表格
  console.log(createExamplesTable().toString());
}
