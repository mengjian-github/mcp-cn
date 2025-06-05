import chalk from 'chalk';
import { resolvePackage } from '../registry';
import { verbose } from '../logger';
import { generateMCPConfig, formatServerNameForDeeplink, generateCursorDeeplink } from '../utils/deeplink';

/**
 * 生成Cursor MCP安装深链接
 * @param qualifiedName - 服务器完整名称
 * @param configValues - 环境变量配置
 * @param platform - 操作系统平台
 */
export async function generateDeeplink(
  qualifiedName: string,
  configValues: Record<string, string> = {},
  platform: 'mac' | 'windows' | 'linux' = 'mac'
): Promise<void> {
  verbose(`Generating Cursor deeplink for ${qualifiedName}`);

  try {
    // 解析服务器信息
    const server = await resolvePackage(qualifiedName);
    verbose(`Server resolved: ${server.data.qualifiedName}`);

    // 生成MCP配置
    const mcpConfig = generateMCPConfig(qualifiedName, configValues, platform);
    verbose(`MCP config generated: ${JSON.stringify(mcpConfig, null, 2)}`);

    // 格式化服务器名称
    const serverName = formatServerNameForDeeplink(qualifiedName, server.data.displayName);
    verbose(`Server name formatted: ${serverName}`);

    // 生成深链接
    const deeplink = generateCursorDeeplink(serverName, mcpConfig);

    console.log(chalk.green('✓ Cursor深链接生成成功:'));
    console.log();
    console.log(chalk.cyan(deeplink));
    console.log();
    console.log(chalk.gray('复制上面的链接并在浏览器中打开，即可在Cursor中安装MCP服务'));
    console.log(chalk.gray('或者直接点击链接（如果在支持的环境中）'));

  } catch (error) {
    verbose(`Deeplink generation error: ${error instanceof Error ? error.stack : JSON.stringify(error)}`);
    console.error(chalk.red(`生成深链接失败: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}

/**
 * 显示深链接命令的帮助信息
 */
export function showDeeplinkHelp(): void {
  console.log(chalk.bold.blue('Cursor深链接生成器'));
  console.log();
  console.log(chalk.gray('用法:'));
  console.log(`  ${chalk.cyan('mcp deeplink <服务器ID>')} ${chalk.gray('[选项]')}`);
  console.log();
  console.log(chalk.gray('选项:'));
  console.log(`  ${chalk.cyan('--env <JSON>')}     ${chalk.gray('环境变量配置（JSON格式）')}`);
  console.log(`  ${chalk.cyan('--platform <平台>')} ${chalk.gray('操作系统平台 (mac|windows|linux)')}`);
  console.log();
  console.log(chalk.gray('示例:'));
  console.log(`  ${chalk.cyan('mcp deeplink sequential-thinking')}`);
  console.log(`  ${chalk.cyan('mcp deeplink weather-api --env \'{"API_KEY":"your-key"}\'')}`);
  console.log(`  ${chalk.cyan('mcp deeplink file-operations --platform windows')}`);
} 