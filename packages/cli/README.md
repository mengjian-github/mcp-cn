# @mcp-hub/cli

MCP Hub 中国 - 命令行工具

## 安装

```bash
npm install -g @mcp-hub/cli
# 或者
pnpm add -g @mcp-hub/cli
```

## 使用

```bash
# 查看帮助
mcp-hub --help

# 创建新的 MCP 服务器项目
mcp-hub create my-server

# 列出可用的 MCP 服务器
mcp-hub list

# 搜索 MCP 服务器
mcp-hub search weather

# 发布 MCP 服务器到 Hub
mcp-hub publish
```

## 命令详情

### create

创建新的 MCP 服务器项目。

```bash
mcp-hub create [项目名称] [选项]
```

**选项：**
- `-t, --template <template>` - 使用指定模板 (默认: basic)
- `-d, --dir <directory>` - 项目目录

### list

列出所有可用的 MCP 服务器。

```bash
mcp-hub list [选项]
```

**选项：**
- `-c, --category <category>` - 按分类筛选
- `-l, --limit <number>` - 限制结果数量 (默认: 20)

### search

搜索 MCP 服务器。

```bash
mcp-hub search [关键词] [选项]
```

**选项：**
- `-c, --category <category>` - 按分类筛选

### publish

发布 MCP 服务器到 Hub。

```bash
mcp-hub publish [选项]
```

**选项：**
- `-p, --path <path>` - 项目路径 (默认: .)
- `--dry-run` - 预览发布内容

## 开发

```bash
# 克隆项目
git clone https://github.com/mengjian-github/mcp-cn.git
cd mcp-cn

# 安装依赖
pnpm install

# 开发 CLI
cd packages/cli
pnpm dev

# 构建
pnpm build

# 本地链接测试
npm link
```

## 许可证

MIT 