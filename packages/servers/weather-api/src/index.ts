#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

class WeatherApiServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'weather-api-server',
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
          name: 'get_current_weather',
          description: '获取指定城市的当前天气信息',
          inputSchema: {
            type: 'object',
            properties: {
              city: {
                type: 'string',
                description: '城市名称（如：北京、上海、深圳）',
              },
              unit: {
                type: 'string',
                description: '温度单位',
                enum: ['celsius', 'fahrenheit'],
                default: 'celsius',
              },
            },
            required: ['city'],
          },
        },
        {
          name: 'get_weather_forecast',
          description: '获取指定城市的天气预报',
          inputSchema: {
            type: 'object',
            properties: {
              city: {
                type: 'string',
                description: '城市名称（如：北京、上海、深圳）',
              },
              days: {
                type: 'number',
                description: '预报天数（1-7天）',
                minimum: 1,
                maximum: 7,
                default: 3,
              },
            },
            required: ['city'],
          },
        },
      ],
    }));

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_current_weather':
            return await this.getCurrentWeather(
              (args as any)?.city,
              (args as any)?.unit || 'celsius'
            );
          case 'get_weather_forecast':
            return await this.getWeatherForecast(
              (args as any)?.city,
              (args as any)?.days || 3
            );
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

  private async getCurrentWeather(city: string, unit: string = 'celsius') {
    // 这里是模拟的天气数据，实际应用中应该调用真实的天气 API
    const mockWeatherData: WeatherData = {
      location: city,
      temperature: unit === 'celsius' ? 22 : 72,
      description: '晴朗',
      humidity: 65,
      windSpeed: 12,
    };

    const result = {
      city: mockWeatherData.location,
      temperature: `${mockWeatherData.temperature}°${unit === 'celsius' ? 'C' : 'F'}`,
      description: mockWeatherData.description,
      humidity: `${mockWeatherData.humidity}%`,
      windSpeed: `${mockWeatherData.windSpeed} km/h`,
      note: '这是模拟数据，实际使用时需要配置真实的天气 API',
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getWeatherForecast(city: string, days: number = 3) {
    // 模拟天气预报数据
    const forecast = Array.from({ length: days }, (_, index) => ({
      date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      temperature: {
        max: 25 + Math.floor(Math.random() * 10),
        min: 15 + Math.floor(Math.random() * 5),
      },
      description: ['晴朗', '多云', '小雨', '阴天'][Math.floor(Math.random() * 4)],
      humidity: 60 + Math.floor(Math.random() * 30),
    }));

    const result = {
      city,
      forecast,
      note: '这是模拟数据，实际使用时需要配置真实的天气 API',
    };

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
    console.error('Weather API MCP Server running on stdio');
  }
}

// 启动服务器
const server = new WeatherApiServer();
server.run().catch(console.error); 