import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

interface CreateOptions {
  template?: string;
  dir?: string;
}

export async function createServer(name?: string, options: CreateOptions = {}) {
  try {
    console.log(chalk.blue('🚀 创建新的 MCP 服务器项目...'));
    
    // 如果没有提供名称，询问用户
    if (!name) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称:',
          validate: (input: string) => {
            if (!input.trim()) {
              return '项目名称不能为空';
            }
            return true;
          }
        }
      ]);
      name = answers.projectName;
    }

    const projectDir = options.dir || name;
    const template = options.template || 'basic';

    console.log(chalk.green(`✅ 项目名称: ${name}`));
    console.log(chalk.green(`📁 项目目录: ${projectDir}`));
    console.log(chalk.green(`📋 使用模板: ${template}`));

    // TODO: 实现模板创建逻辑
    console.log(chalk.yellow('⚠️  模板创建功能正在开发中...'));
    
  } catch (error) {
    console.error(chalk.red('❌ 创建项目失败:'), error);
    process.exit(1);
  }
} 