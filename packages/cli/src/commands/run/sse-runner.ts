import fetch from "cross-fetch"
import type { JSONRPCMessage, JSONRPCError } from "@modelcontextprotocol/sdk/types.js"
import { ServerConfig } from '../../types/registry';
import type { Config } from '../../types/config'
import { createUrl } from "../../utils/createUrl.js"
import { request } from 'http'
import { parse as parseUrl } from 'url'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'
type ConfigValues = Record<string, unknown>;
type Cleanup = () => Promise<void>;

type SSEConfig = {
  qualifiedName: string;
  displayName: string;
  remote: boolean;
  connections: Array<{
    type: 'sse';
    endpoint: string;
    port: number;
  }>;
} & Omit<ServerConfig, 'connection'>;

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

interface SSEMessage {
  data: string;
}

class SSETransport {
  private url: string
  private isConnected: boolean = false
  private request: any = null
  private messageBuffer: string = ''
  
  constructor(url: string) {
    this.url = url
  }

  onmessage?: (message: JSONRPCMessage) => void
  onclose?: () => void
  onerror?: (error: Error) => void

  async start() {
    if (this.request) {
      return
    }

    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Connection timeout"))
      }, 10000)

      const urlParts = parseUrl(this.url)
      
      const options = {
        hostname: urlParts.hostname,
        port: urlParts.port,
        path: urlParts.path,
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream'
        }
      }

      this.request = request(options, (response) => {
        if (response.statusCode !== 200) {
          clearTimeout(timeout)
          reject(new Error(`Server responded with status ${response.statusCode}`))
          return
        }

        response.setEncoding('utf8')

        response.on('data', (chunk: string) => {
          this.messageBuffer += chunk

          const messages = this.messageBuffer.split('\n\n')
          this.messageBuffer = messages.pop() || ''

          for (const message of messages) {
            try {
              const parsed = this.parseSSEMessage(message)
              if (parsed) {
                const data = JSON.parse(parsed.data) as JSONRPCMessage
                this.onmessage?.(data)
              }
            } catch (error) {
              console.error("[Runner] Failed to parse SSE message:", error)
            }
          }
        })

        response.on('end', () => {
          this.isConnected = false
          this.onclose?.()
        })

        this.isConnected = true
        clearTimeout(timeout)
        resolve()
      })

      this.request.on('error', (error: Error) => {
        this.isConnected = false
        clearTimeout(timeout)
        this.onerror?.(error)
        reject(error)
      })

      this.request.end()
    })
  }

  private parseSSEMessage(message: string): SSEMessage | null {
    const lines = message.split('\n')
    const result: SSEMessage = { data: '' }

    for (const line of lines) {
      if (line.startsWith('data:')) {
        result.data = line.slice(5).trim()
      }
    }

    return result.data ? result : null
  }

  async send(message: JSONRPCMessage): Promise<void> {
    if (!this.isConnected) {
      throw new Error("Not connected")
    }

    try {
      await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
      })
    } catch (error) {
      throw new Error(`Failed to send message: ${(error as Error).message}`)
    }
  }

  async close() {
    if (this.request) {
      this.request.destroy()
      this.request = null
      this.isConnected = false
      this.onclose?.()
    }
  }
}

// https://github.com/supercorp-ai/supergateway/blob/main/src/gateways/stdioToSse.ts
const createTransport = (baseUrl: string, config: Config, apiKey?: string): SSEClientTransport => {
  const sseUrl = `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}sse`
  const url = createUrl(sseUrl, config, apiKey).toString()
  return new SSEClientTransport(new URL(url))
}

const handleTransportError = (
  errorMessage: JSONRPCError,
  transport: SSEClientTransport,
) => {
  switch (errorMessage.error.code) {
    case -32000: // Server-specific: Connection closed
      console.error(
        "[Runner] Connection closed by server - attempting to reconnect...",
      )
      transport.close() // This will trigger onclose handler and retry logic
      return

    case -32700: // Parse Error
    case -32600: // Invalid Request
    case -32601: // Method Not Found
    case -32602: // Invalid Params
    case -32603: // Internal Error
      console.error(errorMessage.error.message)
      return // continue

    default:
      console.error(
        `[Runner] Unexpected error: ${JSON.stringify(errorMessage.error)}`,
      )
      process.exit(1)
  }
}

export const createSSERunner = async (
  baseUrl: string,
  config: Config,
  apiKey?: string,
): Promise<Cleanup> => {
  let retryCount = 0
  let stdinBuffer = ""
  let isReady = false
  let isShuttingDown = false
  let isClientInitiatedClose = false

  let transport = createTransport(baseUrl, config, apiKey)

  const handleError = (error: Error, context: string) => {
    console.error(`${context}:`, error.message)
    return error
  }

  const processMessage = async (data: Buffer) => {
    stdinBuffer += data.toString("utf8")

    if (!isReady) return // Wait for connection to be established

    const lines = stdinBuffer.split(/\r?\n/)
    stdinBuffer = lines.pop() ?? ""

    for (const line of lines.filter(Boolean)) {
      try {
        await transport.send(JSON.parse(line))
      } catch (error) {
        if (error instanceof Error && error.message.includes("Not connected")) {
          throw new Error("SSE connection closed")
        }
        handleError(error as Error, "Failed to send message")
      }
    }
  }

  const setupTransport = async () => {
    console.error(`[Runner] Connecting to SSE endpoint: ${baseUrl}`)

    transport.onclose = async () => {
      console.error("[Runner] SSE connection closed")
      isReady = false
      if (!isClientInitiatedClose && retryCount++ < MAX_RETRIES) {
        console.error(
          `[Runner] Unexpected disconnect, attempting reconnect (attempt ${retryCount} of ${MAX_RETRIES})...`,
        )
        // Random jitter between 0-1000ms to the exponential backoff
        const jitter = Math.random() * 1000
        const delay = RETRY_DELAY * Math.pow(2, retryCount) + jitter
        await new Promise((resolve) => setTimeout(resolve, delay))

        // Create new transport
        transport = createTransport(baseUrl, config, apiKey)
        await setupTransport()
      } else if (!isClientInitiatedClose) {
        console.error(
          `[Runner] Max reconnection attempts (${MAX_RETRIES}) reached`,
        )
        process.exit(1)
      } else {
        console.error("[Runner] Clean shutdown, not attempting reconnect")
        process.exit(0)
      }
    }

    transport.onerror = (error) => {
      handleError(error, "SSE connection error")
      process.exit(1)
    }

    transport.onmessage = (message: JSONRPCMessage) => {
      try {
        if ("error" in message) {
          handleTransportError(message as JSONRPCError, transport)
        }
        console.log(JSON.stringify(message)) // log message to channel
      } catch (error) {
        handleError(error as Error, "Error handling message")
        console.error("[Runner] Message:", JSON.stringify(message))
        console.log(JSON.stringify(message))
      }
    }

    await transport.start()
    isReady = true
    console.error("[Runner] SSE connection initiated")
    // Release buffered messages
    await processMessage(Buffer.from(""))
    console.error("[Runner] SSE connection established")
  }

  const cleanup = async () => {
    if (isShuttingDown) {
      console.error("[Runner] Cleanup already in progress, skipping...")
      return
    }

    console.error("[Runner] Starting cleanup...")
    isShuttingDown = true
    isClientInitiatedClose = true // Mark this as a clean shutdown

    try {
      console.error("[Runner] Attempting to close transport...")
      await Promise.race([
        transport.close(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("[Runner] Transport close timeout")),
            3000,
          ),
        ),
      ])
      console.error("[Runner] Transport closed successfully")
    } catch (error) {
      handleError(error as Error, "[Runner] Error during cleanup")
    }

    console.error("[Runner] Cleanup completed")
  }

  const handleExit = async () => {
    console.error("[Runner] Shutting down SSE Runner...")
    isClientInitiatedClose = true // Mark as clean shutdown before cleanup
    await cleanup()
    if (!isShuttingDown) {
      process.exit(0)
    }
  }

  process.on("SIGINT", handleExit)
  process.on("SIGTERM", handleExit)
  process.on("beforeExit", handleExit)
  process.on("exit", () => {
    console.error("[Runner] Final cleanup on exit")
  })

  process.stdin.on("end", () => {
    console.error("STDIN closed (client disconnected)")
    handleExit().catch((error) => {
      console.error("[Runner] Error during stdin close cleanup:", error)
      process.exit(1)
    })
  })

  process.stdin.on("error", (error) => {
    console.error("[Runner] STDIN error:", error)
    handleExit().catch((error) => {
      console.error("[Runner] Error during stdin error cleanup:", error)
      process.exit(1)
    })
  })

  process.stdin.on("data", (data) =>
    processMessage(data).catch((error) =>
      handleError(error, "[Runner] Error processing message"),
    ),
  )

  await setupTransport()

  return cleanup
}

export async function runSSEServer(baseUrl: string): Promise<void> {
  try {
    const defaultConfig: Config = {
      id: "sse-runner",
      name: "SSE Runner",
      version: "1.0.0",
      packageName: "@mcp/sse-runner"
    };

    const cleanup = await createSSERunner(
      baseUrl,
      defaultConfig
    );

    // 保持进程运行
    await new Promise(() => {});
  } catch (error) {
    console.error("[Runner] Failed to run SSE server:", error);
    process.exit(1);
  }
} 