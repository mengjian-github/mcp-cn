/**
 * Types for entries in the registry
 */
import { z } from 'zod';

// Base registry package (what we receive)
export interface RegistryServer {
  data: {
    qualifiedName: string;
    displayName: string;
    remote: boolean;
    connections: Array<ConnectionDetails>;
  };
}

// stdio connection
export const StdioConnectionSchema = z.object({
  command: z.string().describe('The executable to run to start the server.'),
  args: z.array(z.string()).optional().describe('Command line arguments to pass to the executable.'),
  env: z
    .record(z.string(), z.string())
    .optional()
    .describe('The environment to use when spawning the process.'),
});

export const JSONSchemaSchema: z.ZodType = z.lazy(() =>
  z.object({
    type: z.string().optional(),
    properties: z.record(JSONSchemaSchema).optional(),
    items: JSONSchemaSchema.optional(),
    required: z.array(z.string()).optional(),
    description: z.string().optional(),
    default: z.unknown().optional(),
  }),
);

export type JSONSchema = z.infer<typeof JSONSchemaSchema>;

export const ConnectionDetailsSchema = z.union([
  z.object({
    type: z.literal('stdio'),
    configSchema: JSONSchemaSchema.optional(),
    exampleConfig: z.record(z.any()).optional(),
    published: z.boolean().optional(),
    config: StdioConnectionSchema,
  }),
  z.object({
    type: z.literal('ws'),
    deploymentUrl: z.string().url(),
    configSchema: JSONSchemaSchema.optional(),
    exampleConfig: z.record(z.any()).optional(),
  }),
  z.object({
    type: z.literal('sse'),
    endpoint: z.string().url(),
    configSchema: JSONSchemaSchema.optional(),
    exampleConfig: z.record(z.any()).optional(),
  }),
]);

export type ConnectionDetails = z.infer<typeof ConnectionDetailsSchema>;

// Resolved server (after we check against our registry on installation status)
export interface ResolvedServer {
  qualifiedName: string;
  name: string;
  isInstalled: boolean;
  client?: string;
  connections: Array<ConnectionDetails>;
}

// list of configured MCP servers stored locally
export interface MCPConfig {
  mcpServers: Record<string, ConfiguredServer>;
}

export type StdioConnection = z.infer<typeof StdioConnectionSchema>;

export const WSConnectionSchema = z.object({
  type: z.literal('ws'),
  url: z.string().url(),
  config: z.record(z.any()).optional(),
});

export type WSConnection = z.infer<typeof WSConnectionSchema>;

export const SSEConnectionSchema = z.object({
  type: z.literal('sse'),
  url: z.string().url(),
  config: z.record(z.any()).optional(),
});

export type SSEConnection = z.infer<typeof SSEConnectionSchema>;

// Update ConfiguredServer to handle all types
export type ConfiguredServer = StdioConnection | WSConnection | SSEConnection;
export type ConfiguredStdioServer = StdioConnection;

/**
 * 服务器配置
 */
export interface ServerConfig {
  id: string;
  name: string;
  description?: string;
  version: string;
  packageName: string;
  author?: string;
  homepage?: string;
  repository?: string;
  tags?: string[];
  tools?: ToolInfo[];
  configSchema?: {
    type: string;
    properties: Record<
      string,
      {
        type: string;
        description?: string;
        default?: any;
        enum?: string[];
      }
    >;
  };
  [key: string]: unknown;
}

/**
 * 工具信息
 */
export interface ToolInfo {
  name: string;
  description?: string;
  version: string;
  author?: string;
  tags?: string[];
  parameters: {
    required?: string[];
    properties: Record<
      string,
      {
        type: string;
        description?: string;
        required?: boolean;
      }
    >;
  };
}

/**
 * 服务器信息
 */
export interface ServerInfo extends ServerConfig {
  createdAt: string;
  updatedAt: string;
  downloads: number;
  rating: number;
  ratingCount: number;
}

export interface ToolParameter {
  name: string;
  type: string;
  description?: string;
  required: boolean;
}
