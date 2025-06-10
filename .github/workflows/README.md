# GitHub Actions 自动化发布流程

本项目使用 GitHub Actions 来自动化包的版本管理和发布流程，结合 Changeset 来管理语义化版本。

## 🚀 工作流程

### 1. 版本管理工作流 (`version-packages.yml`)

**触发条件：**
- 推送 changeset 文件到 main 分支
- 手动触发

**功能：**
- 检测 `.changeset/` 目录中的变更文件
- 自动创建版本更新 PR
- 更新 `package.json` 中的版本号

### 2. CLI 发布工作流 (`release-cli.yml`)

**触发条件：**
- CLI 包代码变更推送到 main 分支
- changeset 文件变更
- 手动触发（支持选择发布类型）

**功能：**
- 自动构建和测试
- 版本号自动更新
- 发布到 NPM
- 创建 GitHub Release
- 支持预发布版本

## 📝 如何发布新版本

### 方法 1: 使用 Changeset（推荐）

1. **创建 changeset：**
   ```bash
   # 使用便捷脚本
   pnpm run changeset:create cli patch "修复版本号更新问题"

   # 或使用原生 changeset
   pnpm changeset
   ```

2. **提交并推送：**
   ```bash
   git add .changeset/
   git commit -m "chore: add changeset for cli"
   git push origin main
   ```

3. **GitHub Actions 会自动：**
   - 创建版本更新 PR
   - 合并 PR 后自动发布

### 方法 2: 手动触发

1. **在 GitHub 网页端：**
   - 进入 Actions 标签页
   - 选择 "Release CLI Package" 工作流
   - 点击 "Run workflow"
   - 选择发布类型（patch/minor/major/prerelease）

2. **系统会自动：**
   - 更新版本号
   - 构建并测试
   - 发布到 NPM
   - 创建 GitHub Release

## 🔧 发布类型说明

| 类型 | 版本变化 | 使用场景 |
|------|----------|----------|
| `patch` | 0.1.8 → 0.1.9 | Bug 修复、小优化 |
| `minor` | 0.1.8 → 0.2.0 | 新功能、向后兼容 |
| `major` | 0.1.8 → 1.0.0 | 破坏性变更 |
| `prerelease` | 0.1.8 → 0.1.9-beta.0 | 测试版本 |

## 🛠 便捷脚本

```bash
# 创建 changeset
pnpm run changeset:create cli patch "描述变更内容"

# 本地构建并发布 CLI（需要 NPM_TOKEN）
pnpm run release:cli

# 查看当前版本
pnpm list @mcp_hub_org/cli
```

## 🔑 必需的 GitHub Secrets

在 GitHub 仓库设置中需要配置以下 secrets：

- `NPM_TOKEN`: NPM 发布令牌
- `GITHUB_TOKEN`: 自动提供，用于创建 Release

### 获取 NPM Token

1. 登录 [npmjs.com](https://www.npmjs.com)
2. 进入 Account Settings → Access Tokens
3. 点击 "Generate New Token"
4. 选择 "Automation" 类型
5. 复制生成的 token 到 GitHub Secrets

## 📊 发布状态检查

### 检查发布是否成功：

```bash
# 检查 NPM 上的版本
npm view @mcp_hub_org/cli version

# 检查本地安装
npx @mcp_hub_org/cli --version
```

### 查看发布历史：

- GitHub Releases 页面
- NPM 包页面
- GitHub Actions 运行历史

## 🐛 常见问题

### 1. 发布失败 - NPM_TOKEN 无效
- 检查 token 是否过期
- 确认 token 有发布权限
- 重新生成并更新 secret

### 2. 版本号没有更新
- 确认 changeset 文件格式正确
- 检查包名是否匹配
- 确认工作流触发条件

### 3. 构建失败
- 查看 Actions 日志
- 本地运行相同的构建命令
- 检查依赖项是否正确

## 📚 相关文档

- [Changeset 文档](https://github.com/atlassian/changesets)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [NPM 发布指南](https://docs.npmjs.com/cli/v8/commands/npm-publish)
