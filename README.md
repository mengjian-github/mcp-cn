# MCP Hub 中国 🇨🇳

<div align="center">

![MCP Hub Logo](./packages/web/public/logo.svg)

**精选优质 MCP 服务，只推荐最好用的**

[![GitHub stars](https://img.shields.io/github/stars/mengjian-github/mcp-cn?style=social)](https://github.com/mengjian-github/mcp-cn)
[![GitHub license](https://img.shields.io/github/license/mengjian-github/mcp-cn)](https://github.com/mengjian-github/mcp-cn/blob/main/LICENSE)

[🌐 在线体验](https://mcp-cn.com) | [📖 官方文档](https://wvehg9sdj2q.feishu.cn/wiki/Hx7Ow0tF8iJEW4kS3LmcdkXCn3i?fromScene=spaceOverview&open_tab_from=wiki_home) | [💬 问题反馈](https://github.com/mengjian-github/mcp-cn/issues)

</div>

## 🎯 项目简介

MCP Hub 中国是一个专注于精选优质 MCP 服务的 Monorepo 项目，包含：

- 🌐 **Web 应用** - MCP 服务展示平台
- 🛠️ **CLI 工具** - 命令行管理工具
- 📦 **MCP 服务器** - 高质量的 MCP 服务实现

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- pnpm 8+

### 安装使用

```bash
# 克隆项目
git clone https://github.com/mengjian-github/mcp-cn.git
cd mcp-cn

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问应用
# http://localhost:7777
```

## 📦 项目结构

```
mcp-cn/
├── packages/
│   ├── web/                    # Web 应用
│   ├── cli/                    # CLI 工具
│   └── servers/                # MCP 服务器集合
│       ├── file-operations/    # 文件操作服务器
│       └── weather-api/        # 天气 API 服务器
```

## 🛠️ 开发命令

```bash
pnpm dev              # 启动 Web 开发服务器
pnpm build            # 构建所有包
pnpm lint             # 代码检查
pnpm clean            # 清理构建产物
```

## 🤝 参与贡献

欢迎通过以下方式参与贡献：

- 🐛 [报告 Bug](https://github.com/mengjian-github/mcp-cn/issues)
- ✨ 推荐优质 MCP 服务
- 📖 完善文档
- 🔧 提交代码

### 贡献流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 👥 贡献者

<div align="center">

### 🌟 感谢所有为 MCP Hub 中国做出贡献的优秀开发者们！

<br>

<table align="center">
<tr>
<td align="center" width="120">
<a href="https://github.com/mengjian-github">
<img src="https://github.com/mengjian-github.png" width="80" height="80" style="border-radius: 50%;" alt="mengjian-github"><br>
<sub><b>孟健</b></sub><br>
<sub>项目发起人</sub>
</a>
</td>
<td align="center" width="120">
<a href="https://github.com/Zwe1">
<img src="https://github.com/Zwe1.png" width="80" height="80" style="border-radius: 50%;" alt="Zwe1"><br>
<sub><b>Zwe1</b></sub><br>
<sub>核心贡献者</sub>
</a>
</td>
<td align="center" width="120">
<a href="https://github.com/ylx911229">
<img src="https://github.com/ylx911229.png" width="80" height="80" style="border-radius: 50%;" alt="ylx911229"><br>
<sub><b>ylx911229</b></sub><br>
<sub>核心贡献者</sub>
</a>
</td>
<td align="center" width="120">
<a href="https://github.com/reekystive">
<img src="https://github.com/reekystive.png" width="80" height="80" style="border-radius: 50%;" alt="reekystive"><br>
<sub><b>reekystive</b></sub><br>
<sub>核心贡献者</sub>
</a>
</td>
</tr>
</table>

<br>

**💖 每一份贡献都让这个项目变得更好！**

想加入我们吗？[查看贡献指南](./CONTRIBUTING.md) 开始你的开源之旅！

</div>

## 📞 联系我们

<div align="center">
  <img src="./packages/web/public/images/wx.jpg" alt="微信二维码" width="200">
  <p><strong>扫码添加微信</strong></p>
  <p>商务合作 | 技术交流 | 开源协作</p>
</div>

## 📄 开源协议

本项目基于 [MIT License](./LICENSE) 开源协议。

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**

Made with ❤️ in China | © 2025 MCP Hub 中国

</div>
