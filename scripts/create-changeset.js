#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PACKAGES = {
  cli: '@mcp_hub_org/cli',
  web: '@mcp-hub/web',
};

const RELEASE_TYPES = ['patch', 'minor', 'major'];

function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log(`
使用方法: node scripts/create-changeset.js <package> <type> <description>

参数:
  package     包名 (cli, web)
  type        发布类型 (patch, minor, major)
  description 变更描述

示例:
  node scripts/create-changeset.js cli patch "修复版本号更新问题"
  node scripts/create-changeset.js cli minor "新增自动化部署功能"
`);
    process.exit(1);
  }

  const [packageName, releaseType, description] = args;

  if (!PACKAGES[packageName]) {
    console.error(`错误: 未知的包名 "${packageName}". 可用选项: ${Object.keys(PACKAGES).join(', ')}`);
    process.exit(1);
  }

  if (!RELEASE_TYPES.includes(releaseType)) {
    console.error(`错误: 未知的发布类型 "${releaseType}". 可用选项: ${RELEASE_TYPES.join(', ')}`);
    process.exit(1);
  }

  const fullPackageName = PACKAGES[packageName];

  console.log(`正在为 ${fullPackageName} 创建 ${releaseType} 版本的 changeset...`);

  try {
    // 使用 changeset CLI 创建变更文件
    const changesetContent = `---
"${fullPackageName}": ${releaseType}
---

${description}
`;

    // 生成一个唯一的文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `${packageName}-${releaseType}-${timestamp}.md`;
    const filepath = join(process.cwd(), '.changeset', filename);

    writeFileSync(filepath, changesetContent);

    console.log(`✅ Changeset 已创建: .changeset/${filename}`);
    console.log(`📦 包: ${fullPackageName}`);
    console.log(`🔄 类型: ${releaseType}`);
    console.log(`📝 描述: ${description}`);
    console.log(`
下一步:
1. 检查生成的 changeset 文件
2. 提交并推送到 main 分支
3. GitHub Actions 将自动创建版本更新 PR
4. 合并 PR 后将自动发布新版本
`);

  } catch (error) {
    console.error(`❌ 创建 changeset 失败:`, error.message);
    process.exit(1);
  }
}

main();
