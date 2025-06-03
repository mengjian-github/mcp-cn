# @mcp_hub_org/cli

@mcp_hub_org/cli 是一个用于安装、运行和管理 [MCP Hub](https://www.mcp-cn.com/) 平台 MCP Server 的命令行工具。

## 要求

- NodeJS 18或更高版本

## 安装

```bash
npm install -g @mcp_hub_org/cli
```

或者使用npx直接运行：

```bash
npx @mcp_hub_org/cli <命令>
```

## 使用方法

```bash
npx @mcp_hub_org/cli <命令>
```

### 可用命令

- `install <服务器>` - 安装一个 MCP 服务器
  - `--client <客户端>` - 指定 AI 客户端
- `uninstall <服务器>` - 卸载一个 MCP 服务器
  - `--client <客户端>` - 指定 AI 客户端
- `run <服务器>` - 运行一个 MCP 服务器
  - `--env <json>` - 提供JSON格式的配置
- `list clients` - 列出可用的客户端
- `--help` - 显示帮助信息

### 示例

```bash
# 安装服务器（需要--client标志）
npx -y @mcp_hub_org/cli@latest install sequential-thinking --client cursor

# 卸载服务器（需要--client标志）
npx -y @mcp_hub_org/cli@latest uninstall sequential-thinking --client cursor

# 列出可用的客户端
npx -y @mcp_hub_org/cli list clients

# 运行服务器
npx -y @mcp_hub_org/cli run sequential-thinking

# 运行服务器并增加配置
npx -y @mcp_hub_org/cli@latest run Codebase --client cursor --env '{"API_TOKEN":"<填入你的API_TOKEN>"}'

# 显示帮助菜单
npx @mcp_hub_org/cli --help
```