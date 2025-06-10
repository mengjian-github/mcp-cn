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
  - `--path <路径>` - 指定自定义配置文件路径
- `uninstall <服务器>` - 卸载一个 MCP 服务器
  - `--client <客户端>` - 指定 AI 客户端
  - `--path <路径>` - 指定自定义配置文件路径
- `run <服务器>` - 运行一个 MCP 服务器
  - `--env <json>` - 提供JSON格式的配置
- `list clients` - 列出可用的客户端
- `--help` - 显示帮助信息

### 支持的客户端

- `cursor` - Cursor 编辑器
- `trae` - Trae 国内版本
- `trae-global` - Trae 国际版本
- `cline` - Cline 扩展
- `windsurf` - Windsurf 编辑器

### 示例

```bash
# 安装服务器到 Cursor（默认路径）
npx -y @mcp_hub_org/cli@latest install sequential-thinking --client cursor

# 安装服务器到 Trae 国际版
npx -y @mcp_hub_org/cli@latest install sequential-thinking --client trae-global

# 安装服务器到自定义路径
npx -y @mcp_hub_org/cli@latest install sequential-thinking --client cursor --path /custom/path/mcp.json

# 卸载服务器
npx -y @mcp_hub_org/cli@latest uninstall sequential-thinking --client cursor

# 从自定义路径卸载服务器
npx -y @mcp_hub_org/cli@latest uninstall sequential-thinking --client cursor --path /custom/path/mcp.json

# 列出可用的客户端
npx -y @mcp_hub_org/cli list clients

# 运行服务器
npx -y @mcp_hub_org/cli run sequential-thinking

# 运行服务器并增加配置
npx -y @mcp_hub_org/cli@latest run Codebase --client cursor --env '{"API_TOKEN":"<填入你的API_TOKEN>"}'

# 显示帮助菜单
npx @mcp_hub_org/cli --help
```

### 自定义路径功能

使用 `--path` 参数可以将 MCP 服务器安装到自定义位置，这在以下情况下很有用：

1. **非标准安装路径**: 当 AI 客户端安装在非默认位置时
2. **便携式应用**: 当使用便携版 AI 客户端时
3. **多用户环境**: 在共享系统上为不同用户配置不同路径
4. **备份和迁移**: 方便配置文件的备份和迁移

```bash
# 示例：使用自定义路径
npx @mcp_hub_org/cli install my-server --client cursor --path "/Applications/Cursor.app/Contents/Resources/app/extensions/mcp.json"
```
