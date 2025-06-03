# MCP-CN 数据库同步脚本

这个脚本可以从npm包URL中自动提取信息，使用AI优化内容，并同步到Supabase数据库中。

## 🚀 快速开始

```bash
# 1. 进入脚本目录
cd scripts

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp env.example .env
# 编辑 .env 文件填入你的配置

# 4. 同步数据库（根据urls.json配置）
npm run import

# 或者导入单个包
npm run import-single https://www.npmjs.com/package/@upstash/context7-mcp
```

## ✨ 主要特性

### 🤖 **AI驱动的内容优化**
- **智能命名**: AI生成更好的中文显示名称
- **中文描述**: 自动翻译并优化包描述为中文
- **智能标签**: AI分析并生成相关的中文标签
- **工具描述翻译**: 将MCP工具描述翻译为中文

### 📊 **智能数据提取**
- 从npm registry获取包基本信息
- 从GitHub获取仓库信息和logo
- **GitHub Stars**: 用stars数量初始化use_count
- 自动生成MCP连接配置

### 🔧 **工具检测**
- 自动安装并运行MCP服务器
- 获取工具列表（tools）
- 超时和错误处理

### 🔄 **数据库同步**
- 基于urls.json配置文件的完全同步
- 清理不在配置中的旧数据
- 确保两张表的server_id对应
- 防重复和数据完整性保证

## 环境配置

### 1. 设置环境变量

创建.env文件：

```bash
cd scripts
cp env.example .env
```

然后编辑`.env`文件，填入你的配置：

```bash
# Supabase配置（必须）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI配置（用于内容优化）
OPENROUTER_API_KEY=your-openrouter-api-key
AI_MODEL=openai/gpt-4o-mini

# GitHub配置（可选，但推荐设置以避免API限制）
GITHUB_TOKEN=your-github-token
```

### 2. 安装依赖

```bash
cd scripts
npm install
```

## 使用方法

### 同步数据库（推荐）

脚本会根据`urls.json`文件中的配置，完全同步数据库：

```bash
npm run import
```

**特点**：
- 只保留urls.json中配置的包
- 删除不在配置中的旧数据
- 更新现有包的信息
- 插入新包

### 导入单个包

```bash
npm run import-single https://www.npmjs.com/package/@upstash/context7-mcp
```

**注意**: 单包导入不会清理其他数据，只处理指定的包。

### 管理包配置

编辑`urls.json`文件来管理要同步的包：

```json
[
  "https://www.npmjs.com/package/@upstash/context7-mcp",
  "https://www.npmjs.com/package/firecrawl-mcp",
  "你的新包URL..."
]
```

## AI优化功能

### 🎯 **显示名称优化**

AI会根据包名和描述生成更好的中文显示名称：

**示例转换**：
- `firecrawl-mcp` → "网页爬虫"
- `@supabase/mcp-server-supabase` → "Supabase"
- `browser-tools-mcp` → "浏览器工具"

### 📝 **描述翻译**

将英文描述翻译为地道的中文，突出MCP工具的核心功能和价值。

### 🏷️ **智能标签**

AI分析包的功能生成3-5个相关的中文标签，不包含"mcp"等冗余标签。

**常见标签**: 数据库, 浏览器, 文件操作, API接口, 开发工具, 网络爬虫, 图像处理, 代码生成, 云服务, 搜索引擎, 办公协作, 系统管理

### 🔧 **工具描述翻译**

将MCP工具的英文描述翻译并优化为简洁的中文。

## 数据库字段

### mcp_servers 表

| 字段 | 数据来源 | 说明 |
|------|----------|------|
| `qualified_name` | npm包名 | 从URL提取的唯一标识 |
| `display_name` | **AI生成** | AI优化的中文显示名称 |
| `description` | **AI翻译** | AI翻译的中文描述 |
| `creator` | package.json | author字段 |
| `package_url` | 输入URL | 原始npm包URL |
| `repository_id` | GitHub API | 仓库全名 (owner/repo) |
| `logo` | GitHub API | 仓库owner的头像 |
| `tag` | **AI生成** | AI生成的中文标签 |
| `use_count` | **GitHub Stars** | 初始值为GitHub星数 |
| `connections` | 自动生成 | 标准stdio配置 |
| `type` | 固定值 | 默认为3 |

### mcp_server_metainfo 表

| 字段 | 数据来源 | 说明 |
|------|----------|------|
| `server_id` | 关联表 | 对应mcp_servers的ID |
| `qualified_name` | npm包名 | 与mcp_servers保持一致 |
| `tools` | **MCP运行时+AI翻译** | 运行MCP服务器获取+AI优化描述 |
| `resources` | 预留 | 暂未实现 |
| `prompts` | 预留 | 暂未实现 |

## 工具检测机制

脚本会尝试获取MCP服务器的工具信息：

1. 创建临时目录
2. 执行 `npm install <package>`
3. 尝试多种方式运行MCP服务器
4. 发送MCP协议消息获取工具列表
5. **AI翻译工具描述为中文**
6. 解析响应并保存
7. 清理临时目录

**注意**：
- 工具检测有8秒超时
- 如果检测失败会跳过，不影响基本信息导入
- 某些包可能需要特殊配置才能正常运行

## 数据同步策略

### 完全同步模式

每次运行`npm run import`时：

1. **读取配置**: 从urls.json加载要同步的包列表
2. **处理包**: 逐个处理每个包，获取最新信息
3. **AI优化**: 使用AI优化所有文本内容
4. **清理数据**: 删除不在urls.json中的旧服务器
5. **更新数据**: 插入新包或更新现有包
6. **保持一致性**: 确保两张表的server_id对应

### 数据完整性保证

- ✅ 防重复导入检查
- ✅ 事务安全保证
- ✅ 两张表的server_id严格对应
- ✅ 基于配置文件的数据清理
- ✅ 详细的错误日志输出

## 故障排除

### 1. 环境变量配置问题

**问题**: "请设置环境变量"

**解决方案**:
- 确保已创建`.env`文件：`cp env.example .env`
- 检查`.env`文件中的配置是否正确
- 确保没有多余的引号或空格

### 2. AI功能不可用

**问题**: "未设置OPENROUTER_API_KEY，跳过AI优化"

**解决方案**:
- 注册OpenRouter账号获取API密钥
- 在`.env`文件中设置`OPENROUTER_API_KEY`
- 检查API密钥是否有效

### 3. GitHub API限制

**问题**: GitHub请求超出限制

**解决方案**:
- 在`.env`文件中设置`GITHUB_TOKEN`
- 创建GitHub Personal Access Token
- 或者等待API限制重置（每小时60次请求）

### 4. 工具检测失败

**问题**: MCP服务器运行失败

**解决方案**:
- 这是正常现象，不影响基本信息导入
- 检查Node.js版本兼容性
- 手动测试：`npx <package-name>`

### 5. 数据库同步失败

**问题**: Supabase连接或权限错误

**解决方案**:
- 确保使用的是**服务角色密钥**（不是anon key）
- 检查Supabase项目URL是否正确
- 验证网络连接

## 支持的AI模型

通过OpenRouter，脚本支持多种AI模型：

- `openai/gpt-4o-mini` (默认，推荐)
- `openai/gpt-4o`
- `anthropic/claude-3-haiku`
- `anthropic/claude-3-sonnet`
- `google/gemini-pro`

在`.env`文件中通过`AI_MODEL`变量配置。

## 扩展使用

### 添加新包

编辑`urls.json`文件，添加新的npm包URL：

```json
[
  "现有包...",
  "https://www.npmjs.com/package/your-new-package"
]
```

然后运行同步：

```bash
npm run import
```

### 调整AI提示

如需调整AI生成的内容风格，可修改脚本中的prompt模板。

### 自定义处理逻辑

脚本采用模块化设计，可以轻松扩展处理逻辑 