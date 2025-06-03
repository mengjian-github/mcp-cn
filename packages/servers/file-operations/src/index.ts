#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs-extra';
import path from 'path';
import mime from 'mime-types';

class FileOperationsServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'file-operations-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // 列出可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'read_file',
          description: '读取文件内容',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '要读取的文件路径',
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'write_file',
          description: '写入文件内容',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '要写入的文件路径',
              },
              content: {
                type: 'string',
                description: '要写入的内容',
              },
            },
            required: ['path', 'content'],
          },
        },
        {
          name: 'list_directory',
          description: '列出目录内容',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '要列出的目录路径',
              },
            },
            required: ['path'],
          },
        },
      ],
    }));

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'read_file':
            return await this.readFile(args.path);
          case 'write_file':
            return await this.writeFile(args.path, args.content);
          case 'list_directory':
            return await this.listDirectory(args.path);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async readFile(filePath: string) {
    const content = await fs.readFile(filePath, 'utf-8');
    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  }

  private async writeFile(filePath: string, content: string) {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
    return {
      content: [
        {
          type: 'text',
          text: `File written successfully: ${filePath}`,
        },
      ],
    };
  }

  private async listDirectory(dirPath: string) {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    const result = items.map((item) => ({
      name: item.name,
      type: item.isDirectory() ? 'directory' : 'file',
      path: path.join(dirPath, item.name),
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('File Operations MCP Server running on stdio');
  }
}

// 启动服务器
const server = new FileOperationsServer();
server.run().catch(console.error); 