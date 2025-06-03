# @mcp-hub/server-file-operations

MCP 服务器 - 文件操作工具

## 功能

提供文件系统操作的 MCP 工具：

- `read_file` - 读取文件内容
- `write_file` - 写入文件内容
- `list_directory` - 列出目录内容

## 安装

```bash
npm install @mcp-hub/server-file-operations
# 或者
pnpm add @mcp-hub/server-file-operations
```

## 使用

### 在 Cursor 中使用

在 Cursor 设置中添加以下 MCP 配置：

```json
{
  "mcpServers": {
    "file-operations": {
      "command": "npx",
      "args": ["@mcp-hub/server-file-operations"]
    }
  }
}
```

### 在 Claude Desktop 中使用

在 Claude Desktop 配置文件中添加：

```json
{
  "mcpServers": {
    "file-operations": {
      "command": "npx",
      "args": ["@mcp-hub/server-file-operations"]
    }
  }
}
```

## 开发

```bash
# 克隆项目
git clone https://github.com/mengjian-github/mcp-cn.git
cd mcp-cn

# 安装依赖
pnpm install

# 开发文件操作服务器
cd packages/servers/file-operations
pnpm dev

# 构建
pnpm build

# 测试运行
pnpm start
```

## 安全注意事项

此服务器允许读写文件系统，请确保在受信任的环境中使用。建议：

1. 限制文件访问路径
2. 验证文件操作权限
3. 避免在生产环境中使用过于宽泛的权限

## 许可证

MIT 