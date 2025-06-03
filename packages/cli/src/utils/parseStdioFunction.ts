import { error, debug } from '../logger';
import { spawn } from 'child_process';
import { StdioConnection } from '../types/registry';

/**
 * 通过执行stdioFunction解析serverConfig
 * 
 * stdioFunction是一个字符串形式的函数，它在单独的Node.js进程中执行，
 * 返回的结果就是serverConfig对象。
 * 
 * @example
 * ```typescript
 * // 假设stdioConnection包含以下内容：
 * const stdioConnection = {
 *   stdioFunction: `function() {
 *     return {
 *       id: "my-server",
 *       name: "My Server",
 *       version: "1.0.0",
 *       packageName: "my-server-package",
 *       tools: []
 *     };
 *   }`
 * };
 * 
 * const serverConfig = await parseServerConfig(stdioConnection);
 * console.log(serverConfig);
 * // 输出: { id: "my-server", name: "My Server", ... }
 * ```
 * 
 * @param stdioConnection stdio连接配置
 * @returns 解析后的serverConfig
 */
export async function parseStdioFunctionConfig(stdioFunction: string): Promise<StdioConnection> {
  if (!stdioFunction) {
    throw new Error('无效的stdioConnection或缺少stdioFunction');
  }

  debug('开始解析serverConfig');
  try {
    // 创建一个临时的JS文件内容，用于执行stdioFunction
    const tempScript = `
      try {
        // 定义全局函数，供stdioFunction调用
        global.require = require;
        global.process = process;
        global.console = console;
        global.__dirname = __dirname;
        global.__filename = __filename;

        // 执行stdioFunction内容
        const stdioFunctionString = ${stdioFunction};
        const stdioFunction = new Function('return ' + stdioFunctionString)();
        const serverConfig = stdioFunction();
        
        // 输出serverConfig到stdout
        console.log(JSON.stringify(serverConfig));
        process.exit(0);
      } catch (error) {
        console.error(error.stack || error.message || error);
        process.exit(1);
      }
    `;

    // 使用Node.js子进程执行临时脚本
    return new Promise((resolve, reject) => {
      const child = spawn('node', ['-e', tempScript], {
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env }
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code !== 0) {
          error(`解析serverConfig失败，进程退出码: ${code}`);
          error(`错误输出: ${stderr}`);
          return reject(new Error(`解析serverConfig失败: ${stderr}`));
        }

        try {
          // 解析stdout中的JSON数据
          const serverConfig = JSON.parse(stdout);
          debug('成功解析serverConfig');
          resolve(serverConfig);
        } catch (err) {
          error(`解析serverConfig输出失败: ${err}`);
          reject(new Error(`解析serverConfig输出失败: ${err}`));
        }
      });

      child.on('error', (err) => {
        error(`启动解析serverConfig子进程失败: ${err}`);
        reject(err);
      });
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    error(`解析serverConfig出错: ${message}`);
    throw err;
  }
}

/**
 * 安全地解析serverConfig，如果出错则返回默认值
 * 
 * 这个函数是parseServerConfig的包装器，提供了错误处理和默认值支持。
 * 
 * @example
 * ```typescript
 * // 即使stdioFunction执行失败，也能获得一个默认的serverConfig
 * const serverConfig = await safeParseServerConfig(stdioConnection, {
 *   id: "fallback-server",
 *   name: "Fallback Server",
 *   version: "1.0.0",
 *   packageName: "fallback-package",
 *   tools: []
 * });
 * ```
 * 
 * @param stdioConnection stdio连接配置
 * @param defaultConfig 默认配置（解析失败时返回）
 * @returns 解析后的serverConfig或默认值
 */
export async function safeParseStdioFunctionConfig(
  stdioFunction: string,
): Promise<StdioConnection> {
  try {
    return await parseStdioFunctionConfig(stdioFunction);
  } catch (err) {
    throw new Error(`解析serverConfig失败， ${err}`);
  }
}

// 使用示例：
// 
// 假设从服务端获取了一个stdioConnection对象，包含了stdioFunction字符串
// ```
// const stdioConnection = await fetchConnection(serverId, { connectionType: 'stdio' });
// 
// // 方法1：直接解析，但可能会抛出异常
// try {
//   const serverConfig = await parseServerConfig(stdioConnection);
//   console.log('Server name:', serverConfig.name);
//   console.log('Available tools:', serverConfig.tools.length);
// } catch (error) {
//   console.error('Failed to parse server config:', error);
// }
// 
// // 方法2：使用安全解析，提供默认配置
// const defaultConfig = {
//   id: 'fallback',
//   name: 'Fallback Server',
//   version: '0.0.1',
//   packageName: 'unknown',
//   tools: []
// };
// const serverConfig = await safeParseServerConfig(stdioConnection, defaultConfig);
// ``` 