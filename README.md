# MCP Hub 中国 🇨🇳

<div align="center">

![MCP Hub Logo](./public/logo.svg)

**连接 AI 与世界的桥梁，打造国内最大的 MCP 生态平台**

[![GitHub stars](https://img.shields.io/github/stars/mengjian-github/mcp-cn?style=social)](https://github.com/mengjian-github/mcp-cn)
[![GitHub forks](https://img.shields.io/github/forks/mengjian-github/mcp-cn?style=social)](https://github.com/mengjian-github/mcp-cn)
[![GitHub issues](https://img.shields.io/github/issues/mengjian-github/mcp-cn)](https://github.com/mengjian-github/mcp-cn/issues)
[![GitHub license](https://img.shields.io/github/license/mengjian-github/mcp-cn)](https://github.com/mengjian-github/mcp-cn/blob/main/LICENSE)

[🌐 在线体验](https://mcp-cn.com) | [📖 官方文档](https://wvehg9sdj2q.feishu.cn/wiki/Hx7Ow0tF8iJEW4kS3LmcdkXCn3i?fromScene=spaceOverview&open_tab_from=wiki_home) | [💬 问题反馈](https://github.com/mengjian-github/mcp-cn/issues)

</div>

---

## 🎯 项目简介

MCP Hub 中国是国内首个专注于 Model Context Protocol (MCP) 生态的开源平台。我们致力于：

- 🚀 **汇聚全球优质 MCP 服务** - 从 Smithery 等国外优秀项目中精选访问量超过 1000+ 的 MCP 服务
- 🔧 **提供一站式解决方案** - 从服务发现、接入指南到使用示例，全流程支持
- 📚 **完善的中文生态** - 提供中文文档、教程和社区支持
- 🤝 **开源协作** - 欢迎开发者贡献和完善平台功能

## ✨ 功能特色

### 🌟 核心功能

- **智能搜索** - 快速发现所需的 MCP 服务
- **详细介绍** - 每个服务都有完整的功能说明和使用示例  
- **一键接入** - 提供多平台（Cursor、Claude、Windsurf 等）的配置指南
- **实时数据** - 展示服务使用量、开发者数量等实时统计

### 🎨 用户体验

- **现代化 UI** - 基于 Next.js + Tailwind CSS 的精美界面
- **响应式设计** - 完美适配桌面端和移动端
- **流畅动画** - 使用 Framer Motion 提供丝滑的交互体验
- **暗色模式** - 支持明暗主题切换（开发中）

### 🔍 开发者友好

- **TypeScript** - 完整的类型安全支持
- **组件化架构** - 基于 Radix UI 的可复用组件
- **现代化工具链** - ESLint、Prettier、Stylelint 等

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- pnpm 包管理器（推荐）

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

3. **启动开发服务器**
   ```bash
   pnpm dev
   ```

4. **访问应用**
   
   打开浏览器访问 [http://localhost:7777](http://localhost:7777)

### 其他命令

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 类型检查
pnpm lint:tsc

# 样式检查
pnpm lint:stylelint
```

## 📁 项目结构

```
mcp-cn/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── components/         # 页面组件
│   │   ├── server/            # 服务详情页面
│   │   └── docs/              # 文档页面
│   ├── components/            # 通用组件
│   ├── interfaces/            # TypeScript 接口
│   ├── store/                 # 状态管理
│   ├── styles/               # 样式文件
│   └── utils/                # 工具函数
├── public/                   # 静态资源
├── config/                   # 配置文件
└── docs/                     # 文档源文件
```

## 🛠️ 技术栈

### 前端技术

- **框架**: Next.js 15.x (App Router)
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 3.x
- **组件库**: Radix UI
- **动画**: Framer Motion
- **状态管理**: Zustand
- **图标**: Lucide React

### 开发工具

- **包管理器**: pnpm
- **代码检查**: ESLint + Prettier
- **样式检查**: Stylelint
- **类型检查**: TypeScript
- **构建工具**: Next.js 内置

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
- 💡 **功能建议** - 提出新功能想法
- 📖 **完善文档** - 改进文档和教程
- 🔧 **代码贡献** - 提交代码修复或新功能
- 🌐 **翻译** - 帮助翻译界面和文档

## 📋 开发计划

### 🎯 近期目标

- [ ] 服务评价和评论系统
- [ ] 用户账户和个人收藏
- [ ] 服务使用统计分析
- [ ] 移动端 App 开发

### 🚀 长期愿景

- [ ] MCP 服务开发工具链
- [ ] 自动化服务测试平台
- [ ] 企业级服务管理
- [ ] 国际化多语言支持

## 📞 联系我们

### 💬 技术交流

<div align="center">
  <img src="./public/images/wx.jpg" alt="微信二维码" width="200">
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
