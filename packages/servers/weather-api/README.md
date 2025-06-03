# @mcp-hub/server-weather-api

MCP 服务器 - 天气查询 API

## 功能

提供天气查询的 MCP 工具：

- `get_current_weather` - 获取指定城市的当前天气信息
- `get_weather_forecast` - 获取指定城市的天气预报

## 安装

```bash
npm install @mcp-hub/server-weather-api
# 或者
pnpm add @mcp-hub/server-weather-api
```

## 使用

### 在 Cursor 中使用

在 Cursor 设置中添加以下 MCP 配置：

```json
{
  "mcpServers": {
    "weather-api": {
      "command": "npx",
      "args": ["@mcp-hub/server-weather-api"]
    }
  }
}
```

### 在 Claude Desktop 中使用

在 Claude Desktop 配置文件中添加：

```json
{
  "mcpServers": {
    "weather-api": {
      "command": "npx",
      "args": ["@mcp-hub/server-weather-api"]
    }
  }
}
```

## 工具说明

### get_current_weather

获取指定城市的当前天气信息。

**参数：**
- `city` (必需) - 城市名称（如：北京、上海、深圳）
- `unit` (可选) - 温度单位，可选值：celsius（摄氏度）、fahrenheit（华氏度），默认：celsius

**示例：**
```json
{
  "city": "北京",
  "unit": "celsius"
}
```

### get_weather_forecast

获取指定城市的天气预报。

**参数：**
- `city` (必需) - 城市名称（如：北京、上海、深圳）
- `days` (可选) - 预报天数（1-7天），默认：3

**示例：**
```json
{
  "city": "上海",
  "days": 5
}
```

## 注意事项

⚠️ **当前版本使用模拟数据**

此版本使用模拟的天气数据进行演示。要在生产环境中使用，您需要：

1. 注册天气 API 服务（如 OpenWeatherMap、和风天气等）
2. 获取 API 密钥
3. 修改源码以调用真实的天气 API

## 开发

```bash
# 克隆项目
git clone https://github.com/mengjian-github/mcp-cn.git
cd mcp-cn

# 安装依赖
pnpm install

# 开发天气 API 服务器
cd packages/servers/weather-api
pnpm dev

# 构建
pnpm build

# 测试运行
pnpm start
```

## 扩展功能

您可以基于此模板扩展更多天气相关功能：

- 添加空气质量查询
- 支持更多城市和地区
- 添加天气预警功能
- 集成多个天气数据源

## 许可证

MIT 