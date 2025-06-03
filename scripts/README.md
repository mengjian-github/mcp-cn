# MCP-CN 数据库同步脚本

自动导入npm包信息到数据库，支持AI优化的中文内容生成。

## 🚀 快速开始

```bash
# 1. 进入脚本目录并安装依赖
cd scripts && npm install

# 2. 配置环境变量
cp env.example .env
# 编辑 .env 文件填入你的配置

# 3. 批量导入（基于配置文件）
node import-npm-packages.js

# 4. 导入单个包
node import-npm-packages.js --batch-size 1
```

## ✨ 主要特性

- **AI驱动优化**: 智能生成中文显示名称、描述和标签
- **智能数据提取**: 从npm/GitHub自动获取包信息、stars等
- **工具检测**: 自动运行MCP服务器获取工具列表
- **数据库同步**: 基于配置文件的完全同步，防重复导入

## 📁 配置文件

### mcp-servers.json 格式

```json
[
  {
    "npm_url": "https://www.npmjs.com/package/@modelcontextprotocol/server-github",
    "display_name": "GitHub",
    "description": "连接GitHub的MCP服务器，支持仓库管理、问题跟踪、代码搜索等功能",
    "tag": "代码管理,版本控制,开发工具,GitHub",
    "logo": "https://github.com/github.png",
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
    }
  }
]
```

**字段说明**：
- `npm_url` (必填): npm包URL
- `display_name` (可选): 中文显示名称
- `description` (可选): 中文描述
- `tag` (可选): 中文标签，逗号分隔
- `logo` (可选): Logo URL
- `env` (可选): 环境变量配置

### 使用脚本

```bash
# 批量导入（基于mcp-servers.json）
node import-npm-packages.js

# 小批量导入或测试
node import-npm-packages.js --batch-size 3

# 单个包导入（用于测试）
node import-npm-packages.js --batch-size 1

# 显示帮助信息
node import-npm-packages.js --help
```

## 环境配置

创建 `.env` 文件：

```bash
# Supabase配置（必须）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI配置（用于内容优化）
OPENROUTER_API_KEY=your-openrouter-api-key
AI_MODEL=openai/gpt-4o-mini

# GitHub配置（可选，避免API限制）
GITHUB_TOKEN=your-github-token
```

## 数据库结构

### mcp_servers 表
- `qualified_name`: npm包名（唯一标识）
- `display_name`: AI生成的中文显示名称
- `description`: AI翻译的中文描述
- `tag`: AI生成的中文标签
- `use_count`: GitHub stars数量
- `logo`: GitHub头像或配置的logo
- `connections`: 自动生成的连接配置

### mcp_server_metainfo 表
- `server_id`: 关联mcp_servers表
- `tools`: MCP工具信息（AI翻译为中文）

## 功能特点

- **自动获取MCP服务器工具列表**
- **AI翻译工具描述为中文**
- **保存完整工具信息**（name、description、inputSchema）
- **统一的批处理管理**

## 同步策略

### 增量更新逻辑

脚本会检查配置文件与数据库的差异：

1. **显示名称**: 配置文件 > 数据库AI版本 > npm原始
2. **描述**: 配置文件 > 数据库中文版 > AI翻译
3. **标签**: 配置文件 > 数据库中文标签 > AI生成
4. **Stars**: 仅当新值更大时更新 `use_count`
5. **Logo**: 配置文件 > GitHub头像

### 数据清理

- 批量导入时只保留配置文件中的包
- 删除不在配置中的旧数据
- 确保两张表的server_id对应

## 故障排除

### 常见问题

1. **环境变量**: 确保 `.env` 文件配置正确
2. **GitHub限制**: 设置 `GITHUB_TOKEN` 避免API限制
3. **工具检测失败**: 正常现象，不影响基本信息导入
4. **权限错误**: 确保使用Supabase服务角色密钥

### 支持的AI模型

通过OpenRouter支持：
- `openai/gpt-4o-mini` (默认推荐)
- `openai/gpt-4o`
- `anthropic/claude-3-haiku`
- `anthropic/claude-3-sonnet`

## 扩展使用

### 添加新包

编辑 `mcp-servers.json` 添加配置，然后运行：

```bash
node import-npm-packages.js
```

### 自定义配置

- 调整AI提示模板优化生成内容
- 修改环境变量模板
- 扩展处理逻辑 