# 贡献指南 🤝

感谢您对 MCP Hub 中国项目的关注！我们非常欢迎社区的贡献，无论是代码、文档、设计还是其他形式的帮助。

## 🌟 贡献方式

### 1. 报告问题 🐛

如果您发现了 bug 或有功能建议，请：

1. 先在 [Issues](https://github.com/mengjian-github/mcp-cn/issues) 中搜索是否已有相似问题
2. 如果没有，请创建新的 Issue，详细描述：
   - 问题的具体表现
   - 复现步骤
   - 期望的行为
   - 浏览器和操作系统信息
   - 相关截图或错误日志

### 2. 提交代码 💻

#### 开发环境设置

```bash
# 1. Fork 并克隆项目
git clone https://github.com/your-username/mcp-cn.git
cd mcp-cn

# 2. 安装依赖
pnpm install

# 3. 创建开发分支
git checkout -b feature/your-feature-name

# 4. 启动开发服务器
pnpm dev
```

#### 代码规范

- **TypeScript**: 项目使用 TypeScript，请确保类型安全
- **ESLint**: 遵循项目的 ESLint 配置
- **Prettier**: 使用 Prettier 格式化代码
- **组件**: 使用函数组件和 React Hooks
- **样式**: 使用 Tailwind CSS，避免内联样式

#### 提交规范

我们使用语义化提交信息，格式如下：

```
type(scope): description

[可选的正文]

[可选的脚注]
```

**Type 类型：**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

**示例：**
```
feat(search): 添加搜索结果高亮功能
fix(header): 修复移动端导航菜单显示问题
docs(readme): 更新安装说明
```

### 3. 改进文档 📚

文档改进包括：
- 修正错误或过时信息
- 增加使用示例
- 改进 README
- 添加 API 文档
- 翻译内容

### 4. 设计贡献 🎨

如果您有设计技能，欢迎贡献：
- UI/UX 改进建议
- 图标设计
- 视觉规范
- 用户体验优化

## 🔄 贡献流程

### 步骤 1: 准备工作

1. **Fork** 项目到您的 GitHub 账户
2. **Clone** 到本地开发环境
3. **创建分支** 用于您的更改

### 步骤 2: 开发

1. **编写代码** 并确保符合代码规范
2. **本地测试** 确保功能正常
3. **运行检查** 命令确保代码质量

```bash
# 代码检查
pnpm lint

# 类型检查
pnpm lint:tsc

# 样式检查
pnpm lint:stylelint
```

### 步骤 3: 提交

1. **提交更改** 到您的分支
2. **推送** 到您的 GitHub 仓库
3. **创建 Pull Request** 到主仓库

### 步骤 4: 代码审查

1. 项目维护者会审查您的代码
2. 可能会要求修改或提供反馈
3. 审查通过后会合并到主分支

## ✅ 代码质量要求

### 必要检查

- [ ] 代码通过 ESLint 检查
- [ ] TypeScript 类型检查无错误
- [ ] 样式符合 Stylelint 规范
- [ ] 功能在主流浏览器中正常工作
- [ ] 提交信息符合规范

### 推荐实践

- [ ] 添加适当的注释
- [ ] 组件具有良好的可复用性
- [ ] 性能优化（避免不必要的重渲染）
- [ ] 响应式设计适配
- [ ] 无障碍访问支持

## 🏷️ Issue 标签说明

- `bug`: 错误报告
- `enhancement`: 功能增强
- `documentation`: 文档相关
- `good first issue`: 适合新手的问题
- `help wanted`: 需要帮助
- `priority-high`: 高优先级
- `priority-low`: 低优先级

## 💬 交流渠道

### 微信群

<div align="center">
  <img src="./public/images/wx.jpg" alt="微信二维码" width="200">
  <p><strong>扫码加入技术交流群</strong></p>
</div>

### GitHub Discussions

对于一般性讨论、想法分享，请使用 [GitHub Discussions](https://github.com/mengjian-github/mcp-cn/discussions)

### 直接联系

如有紧急问题或私密讨论，可通过微信联系项目维护者。

## 🎉 贡献者认可

我们重视每一位贡献者的努力！贡献者将会：

- 在 Contributors 列表中显示
- 在发布说明中提及重要贡献
- 获得项目徽章和证书
- 优先参与项目决策讨论

## 📋 常见问题

### Q: 我是新手，应该从哪里开始？

A: 查找标有 `good first issue` 的问题，这些通常比较适合新手入门。

### Q: 如何确保我的贡献被接受？

A: 在开始大型功能开发前，建议先创建 Issue 讨论设计方案。

### Q: 代码审查大概需要多长时间？

A: 通常在 1-3 个工作日内会有初步反馈，具体时间取决于更改的复杂程度。

### Q: 我可以贡献非代码内容吗？

A: 当然可以！文档、设计、测试、翻译等都是非常重要的贡献。

---

再次感谢您的贡献！让我们一起打造更好的 MCP 生态平台 🚀 