# MCP Hub 中国 🇨🇳

<div align="center">

![MCP Hub Logo](./packages/web/public/logo.svg)

**精选优质 MCP 服务，不追求大而全，只推荐最好用的**

[![GitHub stars](https://img.shields.io/github/stars/mengjian-github/mcp-cn?style=social)](https://github.com/mengjian-github/mcp-cn)
[![GitHub forks](https://img.shields.io/github/forks/mengjian-github/mcp-cn?style=social)](https://github.com/mengjian-github/mcp-cn)
[![GitHub issues](https://img.shields.io/github/issues/mengjian-github/mcp-cn)](https://github.com/mengjian-github/mcp-cn/issues)
[![GitHub license](https://img.shields.io/github/license/mengjian-github/mcp-cn)](https://github.com/mengjian-github/mcp-cn/blob/main/LICENSE)

[🌐 在线体验](https://mcp-cn.com) | [📖 官方文档](https://wvehg9sdj2q.feishu.cn/wiki/Hx7Ow0tF8iJEW4kS3LmcdkXCn3i?fromScene=spaceOverview&open_tab_from=wiki_home) | [💬 问题反馈](https://github.com/mengjian-github/mcp-cn/issues)

</div>

---

## 🎯 项目简介

MCP Hub 中国是一个专注于精选优质 MCP 服务的 **Monorepo** 项目。包含：

- 🌐 **Web 应用** - 精选 MCP 服务展示平台
- 🛠️ **CLI 工具** - 命令行管理和开发工具
- 📦 **MCP 服务器** - 高质量的 MCP 服务实现

我们致力于：

- ✨ **精选高质量服务** - 每个 MCP 服务都经过严格筛选，确保实用性和稳定性
- 🔧 **提供一站式解决方案** - 从服务发现、接入指南到使用示例，全流程支持
- 📚 **完善的中文生态** - 提供中文文档、教程和社区支持
- 🤝 **社区驱动** - 欢迎开发者推荐优质服务和完善平台功能

## 📁 项目结构

```
mcp-cn/
├── packages/
│   ├── web/                    # Web 应用 (@mcp-hub/web)
│   │   ├── src/               # Next.js 应用源码
│   │   ├── public/            # 静态资源
│   │   └── package.json       # Web 应用依赖
│   ├── cli/                   # CLI 工具 (@mcp-hub/cli)
│   │   ├── src/               # CLI 源码
│   │   ├── templates/         # 项目模板
│   │   └── package.json       # CLI 依赖
│   └── servers/               # MCP 服务器集合
│       ├── file-operations/   # 文件操作服务器
│       ├── weather-api/       # 天气 API 服务器
│       └── database-connector/ # 数据库连接器（待开发）
├── .changeset/                # 版本管理配置
├── pnpm-workspace.yaml        # PNPM 工作空间配置
└── package.json               # 根目录依赖
```

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- pnpm 8.x 或更高版本

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/mengjian-github/mcp-cn.git
   cd mcp-cn
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动 Web 应用**
   ```bash
   pnpm dev
   # 或者
   pnpm dev:web
   ```

4. **访问应用**
   
   打开浏览器访问 [http://localhost:7777](http://localhost:7777)

### 开发命令

```bash
# Web 应用开发
pnpm dev:web              # 启动 Web 开发服务器
pnpm --filter @mcp-hub/web build  # 构建 Web 应用

# CLI 工具开发
pnpm dev:cli              # 开发 CLI 工具
pnpm --filter @mcp-hub/cli build  # 构建 CLI 工具

# MCP 服务器开发
pnpm --filter @mcp-hub/server-file-operations dev    # 开发文件操作服务器
pnpm --filter @mcp-hub/server-weather-api dev        # 开发天气 API 服务器

# 全局命令
pnpm build                # 构建所有包
pnpm lint                 # 检查所有包
pnpm typecheck            # 类型检查
pnpm clean                # 清理构建产物
```

## 📦 包说明

### Web 应用 (@mcp-hub/web)

基于 Next.js 15 的现代 Web 应用，提供：
- MCP 服务发现和展示
- 服务详情和使用指南
- 搜索和分类功能
- 响应式设计

### CLI 工具 (@mcp-hub/cli)

命令行工具，提供：
- `mcp-hub create` - 创建新的 MCP 服务器项目
- `mcp-hub list` - 列出可用的 MCP 服务器
- `mcp-hub search` - 搜索 MCP 服务器
- `mcp-hub publish` - 发布 MCP 服务器到 Hub

**安装使用：**
```bash
# 从本地构建安装
cd packages/cli
pnpm build
npm link

# 使用
mcp-hub --help
mcp-hub create my-server
```

### MCP 服务器

#### 文件操作服务器 (@mcp-hub/server-file-operations)

提供文件系统操作功能：
- `read_file` - 读取文件内容
- `write_file` - 写入文件内容  
- `list_directory` - 列出目录内容

#### 天气 API 服务器 (@mcp-hub/server-weather-api)

提供天气查询功能（开发中）：
- `get_current_weather` - 获取当前天气
- `get_weather_forecast` - 获取天气预报

## 🛠️ 技术栈

### 前端技术 (Web)

- **框架**: Next.js 15.x (App Router)
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 3.x
- **组件库**: Radix UI
- **动画**: Framer Motion
- **状态管理**: Zustand

### 后端技术 (MCP Servers)

- **运行时**: Node.js 18+
- **语言**: TypeScript 5.x
- **协议**: MCP (Model Context Protocol)
- **SDK**: @modelcontextprotocol/sdk

### 开发工具

- **包管理器**: pnpm (Workspaces)
- **版本管理**: Changesets
- **代码检查**: ESLint + Prettier
- **构建工具**: TypeScript Compiler
- **开发服务器**: tsx

## 🤝 参与贡献

我们欢迎社区贡献！无论是新功能、bug 修复还是文档改进。

### 贡献指南

1. **Fork 项目** 到你的 GitHub 账户
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **创建 Pull Request**

### 贡献方式

- 🐛 **报告 Bug** - 通过 [Issues](https://github.com/mengjian-github/mcp-cn/issues) 报告问题
- ✨ **推荐优质 MCP 服务** - 提交你发现的高质量 MCP 工具
- 📖 **完善文档** - 改进文档和教程
- 🔧 **代码贡献** - 提交代码修复或新功能
- 💬 **分享使用经验** - 帮助其他开发者更好地使用 MCP 服务

### 添加新的 MCP 服务器

在 `packages/servers/` 目录下创建新的服务器包：

```bash
# 创建新的服务器目录
mkdir packages/servers/my-new-server
cd packages/servers/my-new-server

# 创建 package.json
cat > package.json << EOF
{
  "name": "@mcp-hub/server-my-new-server",
  "version": "1.0.0",
  "description": "我的新 MCP 服务器",
  "type": "module",
  "main": "dist/index.js",
  ...
}
EOF

# 创建源码目录和入口文件
mkdir src
# 实现你的 MCP 服务器...
```

## 📋 开发计划

### 🎯 近期目标

- [x] ✅ Monorepo 架构重构
- [ ] 🔄 完善 CLI 工具功能
- [ ] 🔄 添加更多 MCP 服务器示例
- [ ] 📱 服务评价和评论系统
- [ ] 👤 用户账户和个人收藏

### 🚀 长期愿景

- [ ] 📊 MCP 服务使用统计分析
- [ ] 🧪 自动化服务测试平台
- [ ] 🏢 企业级服务管理
- [ ] 🌍 国际化多语言支持
- [ ] 📱 移动端 App 开发

## 🔄 版本发布

我们使用 [Changesets](https://github.com/changesets/changesets) 进行版本管理：

```bash
# 添加变更记录
pnpm changeset

# 应用版本变更
pnpm version

# 发布到 npm
pnpm release
```

## 📞 联系我们

### 💬 技术交流

<div align="center">
  <img src="./packages/web/public/images/wx.jpg" alt="微信二维码" width="200">
  <p><strong>扫码添加微信</strong></p>
  <p>商务合作 | 技术交流 | 开源协作</p>
</div>

### 🔗 相关链接

- 🌐 **官网**: [mcp-cn.com](https://mcp-cn.com)
- 📖 **文档**: [飞书文档](https://wvehg9sdj2q.feishu.cn/wiki/Hx7Ow0tF8iJEW4kS3LmcdkXCn3i?fromScene=spaceOverview&open_tab_from=wiki_home)
- 💻 **GitHub**: [mengjian-github/mcp-cn](https://github.com/mengjian-github/mcp-cn)
- 🐛 **问题反馈**: [GitHub Issues](https://github.com/mengjian-github/mcp-cn/issues)

## 📄 开源协议

本项目基于 [MIT License](./LICENSE) 开源协议。

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**

Made with ❤️ in China | © 2024 MCP Hub 中国

</div>
