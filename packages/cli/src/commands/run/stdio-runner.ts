import type { RegistryServer } from '../../types/registry';
import { getRuntimeEnvironment } from '../../utils/runtime';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ANALYTICS_ENDPOINT } from '../../constants';
import fetch from 'cross-fetch';
import {
  type JSONRPCMessage,
  CallToolRequestSchema,
  type CallToolRequest,
  type JSONRPCError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import { pick } from 'lodash';
import { verbose } from '../../logger';
import { ServerConfig } from '../../types/registry';
// import { safeParseStdioFunctionConfig } from "../../utils/parseStdioFunction"

type ConfigValues = Record<string, string>;
type Cleanup = () => Promise<void>;

type StdioConfig = {
  connection: {
    type: 'stdio';
    command: string;
  };
} & Omit<ServerConfig, 'connection'>;

export const createStdioRunner = async (
  serverConfig: RegistryServer,
  config: ConfigValues,
  // userId?: string,
): Promise<Cleanup> => {
  let stdinBuffer = '';
  let isReady = false;
  let isShuttingDown = false;
  let transport: StdioClientTransport | null = null;

  const serverDetails = serverConfig.data;

  const handleError = (error: Error, context: string) => {
    console.error(`[Runner] ${context}:`, error.message);
    return error;
  };

  const processMessage = async (data: Buffer) => {
    stdinBuffer += data.toString('utf8');

    if (!isReady) return; // Wait for connection to be established

    const lines = stdinBuffer.split(/\r?\n/);

    verbose(`[Runner] Received lines: ${lines}`);

    stdinBuffer = lines.pop() ?? '';

    for (const line of lines.filter(Boolean)) {
      try {
        const message = JSON.parse(line) as JSONRPCMessage;

        // Track tool usage if user consent is given
        // if (userId && ANALYTICS_ENDPOINT) {
        if (ANALYTICS_ENDPOINT) {
          const { data: toolData, error } = CallToolRequestSchema.safeParse(message) as {
            data: CallToolRequest | undefined;
            error: Error | null;
          };

          if (!error) {
            // Fire and forget analytics
            fetch(ANALYTICS_ENDPOINT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                eventName: 'tool_call',
                payload: {
                  connectionType: 'stdio',
                  serverQualifiedName: serverDetails.qualifiedName,
                  toolParams: toolData ? pick(toolData.params, 'name') : {},
                },
              }),
            }).catch((err: Error) => {
              console.error('[Runner] Analytics error:', err);
            });
          }
        }

        await transport?.send(message);
      } catch (error) {
        handleError(error as Error, 'Failed to send message to child process');
      }
    }
  };

  const setupTransport = async () => {
    verbose(`[Runner] Starting child process setup...`);
    const stdioConnection = serverDetails.connections.find((conn) => conn.type === 'stdio');
    if (!stdioConnection) {
      throw new Error('No STDIO connection found');
    }

    // Process config values and fetch server configuration
    // const processedConfig = await formatConfigValues(stdioConnection, config)

    const serverConfig = stdioConnection.config;
    // const serverConfig = await safeParseStdioFunctionConfig(stdioConnection.stdioFunction || '');
    // const serverConfig = await fetchConnection(
    // 	serverDetails.qualifiedName,
    // 	processedConfig,
    // )

    // if (!serverConfig || "type" in serverConfig) {
    // 	throw new Error("Failed to get valid stdio server configuration")
    // }

    const { command, args = [], env = {} } = serverConfig;

    const processEnv = { ...process.env } as Record<string, string>;

    // Use runtime environment with proper PATH setup
    // AI Client将ENV注入process.env,此处需要读取参数
    const runtimeEnv = getRuntimeEnvironment({ ...env, ...config, ...processEnv });

    // Log the environment variables being used
    verbose(`[Runner] Using environment: ${JSON.stringify(runtimeEnv, null, 2)}`);

    let finalCommand: string = command;
    // 默认从 bnpm 拉取包
    let finalArgs: string[] = ['--registry', 'http://bnpm.byted.org/', ...args];
    // let finalArgs: string[] = [...args];

    // Resolve npx path upfront if needed
    if (finalCommand === 'npx') {
      verbose(`[Runner] Using npx path: ${finalCommand}`);

      // Special handling for Windows platform
      if (process.platform === 'win32') {
        console.error('[Runner] Windows platform detected, using cmd /c for npx');
        finalArgs = ['/c', 'npx', ...finalArgs];
        finalCommand = 'cmd';
      }
    }

    verbose(`[Runner] Executing: ${finalCommand} ${finalArgs.join(' ')}`);

    try {
      const transportParams = {
        command: finalCommand,
        args: finalArgs,
        env: runtimeEnv,
      };

      verbose(`[Runner] Transport params: ${JSON.stringify(transportParams, null, 2)}`);

      transport = new StdioClientTransport(transportParams);
    } catch (error) {
      throw error;
    }

    transport.onmessage = (message: JSONRPCMessage) => {
      try {
        if ('error' in message) {
          const errorMessage = message as JSONRPCError;
          // Only log errors that aren't "Method not found"
          if (errorMessage.error.code !== ErrorCode.MethodNotFound) {
            console.error(`[Runner] Child process error:`, errorMessage.error);
          }
        }
        // Forward the message to stdout
        console.log(JSON.stringify(message));
      } catch (error) {
        handleError(error as Error, 'Error handling message');
      }
    };

    transport.onclose = () => {
      console.error('[Runner] Child process terminated');
      // Only treat it as unexpected if we're ready and haven't started cleanup
      if (isReady && !isShuttingDown) {
        console.error('[Runner] Process terminated unexpectedly while running');
        handleExit().catch((error) => {
          console.error('[Runner] Error during exit cleanup:', error);
          process.exit(1);
        });
      }
    };

    transport.onerror = (err) => {
      console.error('[Runner] Child process error:', err.message);
      if (err.message.includes('spawn')) {
        console.error('[Runner] Failed to spawn child process - check if the command exists and is executable');
      } else if (err.message.includes('permission')) {
        console.error('[Runner] Permission error when running child process');
      }
      // 不处理错误，log提醒即可，交给上层处理
      // handleExit().catch((error) => {
      //   console.error('[Runner] Error during error cleanup:', error);
      //   process.exit(1);
      // });
    };

    await transport.start();
    isReady = true;
    // Process any buffered messages
    await processMessage(Buffer.from(''));
  };

  const cleanup = async () => {
    // Prevent recursive cleanup calls
    if (isShuttingDown) {
      console.error('[Runner] Cleanup already in progress, skipping...');
      return;
    }

    console.error('[Runner] Starting cleanup...');
    isShuttingDown = true;

    // Close transport gracefully
    if (transport) {
      try {
        console.error('[Runner] Attempting to close transport...');
        await Promise.race([
          transport.close(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Transport close timeout')), 3000)),
        ]);
        console.error('[Runner] Transport closed successfully');
      } catch (error) {
        console.error('[Runner] Error during transport cleanup:', error);
      }
      transport = null;
    }

    console.error('[Runner] Cleanup completed');
  };

  const handleExit = async () => {
    console.error('[Runner] Exit handler triggered, starting shutdown...');
    await cleanup();
    if (!isShuttingDown) {
      process.exit(0);
    }
  };

  // Setup event handlers
  process.on('SIGINT', handleExit);
  process.on('SIGTERM', handleExit);
  process.on('beforeExit', handleExit);
  process.on('exit', () => {
    // Synchronous cleanup for exit event
    console.error('[Runner] Final cleanup on exit');
    // Additional logging if needed
    // console.error("[Runner] Final cleanup on exit", {
    // 	transportExists: !!transport,
    // 	isShuttingDown,
    // 	stdinIsTTY: process.stdin.isTTY,
    // 	stdinIsRaw: process.stdin.isRaw,
    // 	hasStdinListeners: process.stdin.listenerCount('data') > 0
    // })
  });

  // Handle STDIN closure (client disconnect)
  process.stdin.on('end', () => {
    console.error('[Runner] STDIN closed (client disconnected)');
    handleExit().catch((error) => {
      console.error('[Runner] Error during stdin close cleanup:', error);
      process.exit(1);
    });
  });

  process.stdin.on('error', (error) => {
    console.error('[Runner] STDIN error:', error);
    handleExit().catch((error) => {
      console.error('[Runner] Error during stdin error cleanup:', error);
      process.exit(1);
    });
  });

  process.stdin.on('data', (data) =>
    processMessage(data).catch((error) => handleError(error, 'Error processing message')),
  );

  // Start the transport
  await setupTransport();

  return cleanup;
};
