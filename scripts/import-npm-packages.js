#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载 .env 文件
dotenv.config({ path: path.join(__dirname, '.env') });

// Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// AI配置
const openrouterApiKey = process.env.OPENROUTER_API_KEY;
const aiModel = process.env.AI_MODEL || 'openai/gpt-4o-mini';

// 简化配置
const CONFIG = {
  TIMEOUT_MS: 60000, // 统一60秒超时
  BATCH_SIZE: 5,
  DELAY_BETWEEN_PACKAGES: 1000, // 1秒延迟
};

// 设置全局环境变量
const GLOBAL_ENV = {
  ...process.env,
  // 占位符环境变量，避免工具初始化失败
  'GITHUB_TOKEN': process.env.GITHUB_TOKEN || 'placeholder',
  'OPENAI_API_KEY': process.env.OPENAI_API_KEY || 'placeholder',
  'ANTHROPIC_API_KEY': process.env.ANTHROPIC_API_KEY || 'placeholder',
  'GOOGLE_API_KEY': process.env.GOOGLE_API_KEY || 'placeholder',
  'NOTION_API_TOKEN': process.env.NOTION_API_TOKEN || 'placeholder',
  'SLACK_TOKEN': process.env.SLACK_TOKEN || 'placeholder',
  'CONTEXT7_API_KEY': process.env.CONTEXT7_API_KEY || 'placeholder',
  'FIRECRAWL_API_KEY': process.env.FIRECRAWL_API_KEY || 'placeholder',
  'FLOMO_API_KEY': process.env.FLOMO_API_KEY || 'placeholder'
};

/**
 * 统一超时包装器
 */
function withTimeout(promise, operationName = '操作') {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${operationName}超时 (${CONFIG.TIMEOUT_MS}ms)`));
      }, CONFIG.TIMEOUT_MS);
    })
  ]);
}

/**
 * 清理临时目录
 */
function cleanupTempDir(tempDir) {
  try {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  } catch (error) {
    console.log(`  ⚠️ 清理临时目录失败: ${error.message}`);
  }
}

/**
 * 生成连接配置
 */
function generateConnections(packageName, envConfig = null) {
  const baseConfig = {
    type: "stdio",
    config: {
      command: "npx",
      args: ["-y", packageName]
    }
  };
  
  if (envConfig && Object.keys(envConfig).length > 0) {
    baseConfig.config.env = envConfig;
  }
  
  return JSON.stringify([baseConfig]);
}

/**
 * 调用AI生成内容
 */
async function callAI(prompt, systemPrompt = '你是一个专业的技术文档翻译和优化助手。') {
  if (!openrouterApiKey) {
    console.log('⚠️ 未设置OPENROUTER_API_KEY，跳过AI优化');
    return null;
  }

  try {
    const response = await withTimeout(
      axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: aiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      }, {
        headers: {
          'Authorization': `Bearer ${openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://mcp-cn.com',
          'X-Title': 'MCP Hub China'
        },
        timeout: CONFIG.TIMEOUT_MS
      }),
      'AI调用'
    );
    
    return response.data.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error('AI调用失败:', error.message);
    return null;
  }
}

/**
 * 从npm包URL提取包名
 */
function extractPackageName(npmUrl) {
  const match = npmUrl.match(/npmjs\.com\/package\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * 从包配置中提取包名
 */
function extractPackageNameFromConfig(packageConfig) {
  const npmUrl = packageConfig.npm_url || packageConfig.url || packageConfig;
  return extractPackageName(npmUrl);
}

/**
 * 获取npm包信息
 */
async function fetchNpmPackageInfo(packageName) {
  try {
    const response = await withTimeout(
      axios.get(`https://registry.npmjs.org/${packageName}`, { timeout: CONFIG.TIMEOUT_MS }),
      'npm包信息获取'
    );
    return response.data;
  } catch (error) {
    console.error(`获取包 ${packageName} 信息失败:`, error.message);
    return null;
  }
}

/**
 * 获取npm包的下载量
 */
async function fetchNpmDownloads(packageName) {
  try {
    const response = await withTimeout(
      axios.get(`https://api.npmjs.org/downloads/point/last-month/${packageName}`, { timeout: CONFIG.TIMEOUT_MS }),
      'npm下载量获取'
    );
    return response.data.downloads || 0;
  } catch (error) {
    console.log(`  ⚠️ 获取${packageName}下载量失败:`, error.message);
    return 0;
  }
}

/**
 * 获取GitHub仓库信息
 */
async function fetchGitHubInfo(repoUrl) {
  if (!repoUrl) return null;
  
  try {
    const match = repoUrl.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
    if (!match) return null;
    
    const [, owner, repo] = match;
    const headers = { timeout: CONFIG.TIMEOUT_MS };
    
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    const response = await withTimeout(
      axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      'GitHub信息获取'
    );
    return response.data;
  } catch (error) {
    console.error('获取GitHub信息失败:', error.message);
    return null;
  }
}

/**
 * 生成优化的显示名称
 */
async function generateDisplayName(packageInfo, githubInfo, existingDisplayName = null, configDisplayName = null) {
  if (configDisplayName) {
    console.log('  ✅ 使用配置文件中的显示名称');
    return configDisplayName;
  }
  
  if (existingDisplayName && existingDisplayName !== packageInfo.name && existingDisplayName !== packageInfo.name.split('/').pop()) {
    console.log('  ⏭️ 跳过显示名称生成（已存在AI优化版本）');
    return existingDisplayName;
  }
  
  const originalName = packageInfo.displayName || packageInfo.name.split('/').pop() || packageInfo.name;
  const description = packageInfo.description || githubInfo?.description || '';
  
  const prompt = `
请为这个MCP (Model Context Protocol) 工具包生成一个更好的中文显示名称：

原名称: ${originalName}
描述: ${description}
包名: ${packageInfo.name}

要求：
1. 名称要简洁有力，最多8个字符
2. 体现工具的核心功能
3. 适合中文用户理解
4. 如果是知名产品/服务，保持英文品牌名
5. 只返回优化后的名称，不要其他内容

示例：
- firecrawl-mcp -> "网页爬虫"
- @supabase/mcp-server-supabase -> "Supabase"
- browser-tools-mcp -> "浏览器工具"
`;

  const aiName = await callAI(prompt);
  return aiName || originalName;
}

/**
 * 生成中文描述
 */
async function generateChineseDescription(packageInfo, githubInfo, existingDescription = null, configDescription = null) {
  if (configDescription) {
    console.log('  ✅ 使用配置文件中的描述');
    return configDescription;
  }
  
  if (existingDescription && existingDescription !== packageInfo.description && !existingDescription.match(/^[a-zA-Z0-9\s.,!?-]+$/)) {
    console.log('  ⏭️ 跳过描述生成（已存在中文优化版本）');
    return existingDescription;
  }
  
  const originalDesc = packageInfo.description || githubInfo?.description || '';
  
  const prompt = `
请将这个MCP工具的描述翻译成中文，并优化表达：

英文描述: ${originalDesc}
包名: ${packageInfo.name}

要求：
1. 翻译成地道的中文
2. 突出MCP工具的核心功能和价值
3. 保持专业性但易于理解
4. 控制在50字以内
5. 只返回翻译后的描述，不要其他内容

如果原描述为空或无意义，请根据包名推断功能并生成合适的中文描述。
`;

  const aiDesc = await callAI(prompt);
  return aiDesc || originalDesc || '暂无描述';
}

/**
 * 生成智能标签
 */
async function generateTags(packageInfo, githubInfo, existingTags = null, configTags = null) {
  if (configTags) {
    console.log('  ✅ 使用配置文件中的标签');
    return configTags;
  }
  
  if ((existingTags && existingTags.includes("，")) || (existingTags && /[\u4e00-\u9fa5]/.test(existingTags))) {
    console.log("  ⏭️ 跳过标签生成（已存在中文优化版本）");
    return existingTags;
  }
  
  const keywords = packageInfo.keywords || [];
  const description = packageInfo.description || githubInfo?.description || "";
  const name = packageInfo.name;
  
  const prompt = `
请为这个MCP工具生成3-5个合适的中文标签：

包名: ${name}
描述: ${description}
关键词: ${keywords.join(", ")}

要求：
1. 标签要准确反映工具的功能领域
2. 使用中文，每个标签2-4个字
3. 不要包含"mcp"相关标签
4. 优先选择具体的功能分类
5. 用逗号分隔，只返回标签列表

常见标签参考: 数据库, 浏览器, 文件操作, API接口, 开发工具, 网络爬虫, 图像处理, 代码生成, 云服务, 搜索引擎, 办公协作, 系统管理
`;

  const aiTags = await callAI(prompt);
  if (aiTags) {
    return aiTags;
  }
  
  // 备用标签生成逻辑
  const tags = new Set();
  
  if (packageInfo.keywords) {
    packageInfo.keywords.forEach((keyword) => {
      if (keyword.length <= 20) {
        tags.add(keyword);
      }
    });
  }
  
  const name_lower = packageInfo.name.toLowerCase();
  if (name_lower.includes("browser")) tags.add("浏览器");
  if (name_lower.includes("file")) tags.add("文件操作");
  if (name_lower.includes("db") || name_lower.includes("database")) tags.add("数据库");
  if (name_lower.includes("api")) tags.add("API接口");
  if (name_lower.includes("web")) tags.add("网络");
  if (name_lower.includes("tool")) tags.add("开发工具");
  
  return Array.from(tags).slice(0, 5).join(",");
}

/**
 * 获取MCP服务器的工具信息
 */
async function getMcpServerTools(packageName, userEnvConfig = {}) {
  const tempDir = path.join(__dirname, 'temp', packageName.replace(/[@\/]/g, '_'));
  
  try {
    // 创建临时目录
    fs.mkdirSync(tempDir, { recursive: true });
    
    // 合并环境变量
    const processEnv = { ...GLOBAL_ENV, ...userEnvConfig };
    
    if (Object.keys(userEnvConfig).length > 0) {
      console.log(`  🔐 使用配置的环境变量: ${Object.keys(userEnvConfig).join(', ')}`);
    }
    
    return await withTimeout(new Promise((resolve) => {
      // 安装包
      const npmInstall = spawn('npm', ['install', packageName], { 
        cwd: tempDir,
        stdio: 'pipe',
        env: processEnv
      });
      
      npmInstall.on('close', async (code) => {
        if (code !== 0) {
          console.log(`  📦 包 ${packageName} 安装失败，跳过工具检测`);
          resolve(null);
          return;
        }
        
        try {
          // 启动MCP服务器
          const mcpClient = spawn('npx', [packageName], {
            cwd: tempDir,
            stdio: 'pipe',
            env: processEnv
          });
          
          let output = '';
          let hasResolved = false;
          
          mcpClient.stdout.on('data', (data) => {
            output += data.toString();
            
            // 尝试解析输出，如果找到工具就立即返回
            if (!hasResolved) {
              try {
                const tools = parseMcpOutput(output);
                if (tools && tools.length > 0) {
                  hasResolved = true;
                  clearTimeout(clientTimeout);
                  mcpClient.kill();
                  resolve(tools);
                }
              } catch (error) {
                // 继续等待更多数据
              }
            }
          });
          
          // 设置客户端超时
          const clientTimeout = setTimeout(() => {
            if (!hasResolved) {
              hasResolved = true;
              mcpClient.kill();
              // 最后尝试解析一次
              try {
                const tools = parseMcpOutput(output);
                resolve(tools);
              } catch (error) {
                resolve(null);
              }
            }
          }, CONFIG.TIMEOUT_MS / 2); // 使用一半的超时时间
          
          mcpClient.on('close', () => {
            if (!hasResolved) {
              hasResolved = true;
              clearTimeout(clientTimeout);
              try {
                const tools = parseMcpOutput(output);
                resolve(tools);
              } catch (error) {
                resolve(null);
              }
            }
          });
          
          mcpClient.on('error', () => {
            if (!hasResolved) {
              hasResolved = true;
              clearTimeout(clientTimeout);
              resolve(null);
            }
          });
          
          // 发送MCP消息
          setTimeout(() => {
            try {
              if (!mcpClient.killed) {
                mcpClient.stdin.write(JSON.stringify({
                  jsonrpc: "2.0",
                  id: 1,
                  method: "initialize",
                  params: {
                    protocolVersion: "2024-11-05",
                    capabilities: {},
                    clientInfo: { name: "mcp-import-script", version: "1.0.0" }
                  }
                }) + '\n');
                
                setTimeout(() => {
                  if (!mcpClient.killed) {
                    mcpClient.stdin.write(JSON.stringify({
                      jsonrpc: "2.0",
                      id: 2,
                      method: "tools/list"
                    }) + '\n');
                  }
                }, 1000);
              }
            } catch (err) {
              // ignore
            }
          }, 500);
          
        } catch (error) {
          resolve(null);
        }
      });
      
      npmInstall.on('error', () => {
        resolve(null);
      });
      
    }), 'MCP工具获取');
    
  } catch (error) {
    console.log(`  ⚠️ 获取MCP工具信息失败: ${error.message}`);
    return null;
  } finally {
    cleanupTempDir(tempDir);
  }
}

/**
 * 解析MCP输出获取工具信息
 */
function parseMcpOutput(output) {
  try {
    const lines = output.split('\n').filter(line => line.trim());
    let tools = [];
    
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        
        if (parsed.result && parsed.result.tools) {
          tools = parsed.result.tools;
          break;
        }
        
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
          tools = parsed;
          break;
        }
      } catch (parseError) {
        continue;
      }
    }
    
    if (Array.isArray(tools) && tools.length > 0) {
      const validTools = tools.filter(tool => 
        tool && typeof tool === 'object' && tool.name
      );
      
      if (validTools.length > 0) {
        return validTools;
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 优化工具描述为中文
 */
async function optimizeToolsDescriptions(tools) {
  if (!tools || !Array.isArray(tools) || tools.length === 0) {
    return tools;
  }

  const optimizedTools = [];
  
  for (const tool of tools) {
    if (!tool.description) {
      optimizedTools.push(tool);
      continue;
    }

    const prompt = `
请将这个MCP工具的英文描述翻译为简洁的中文描述：

${tool.description}

要求：
1. 直接翻译成中文，不要添加"工具名称"、"描述"等前缀
2. 突出工具的核心功能
3. 保持技术准确性
4. 控制在20字以内
5. 只返回翻译后的描述文本，不要任何其他内容或格式

示例：
英文：Close the current browser tab
中文：关闭当前浏览器标签页

英文：Search files in the current directory
中文：搜索当前目录下的文件
`;

    const optimizedDesc = await callAI(prompt);
    
    optimizedTools.push({
      ...tool,
      description: optimizedDesc || tool.description,
      translation: optimizedDesc
    });
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return optimizedTools;
}

/**
 * 处理单个npm包
 */
async function processPackage(packageConfig, existingServer = null) {
  const npmUrl = packageConfig.npm_url || packageConfig.url || packageConfig;
  const configData = typeof packageConfig === 'object' ? packageConfig : {};
  
  const packageName = extractPackageName(npmUrl);
  if (!packageName) {
    throw new Error('无法从URL提取包名');
  }

  console.log(`  📋 包名: ${packageName}`);
  
  // 获取npm包信息
  const packageInfo = await fetchNpmPackageInfo(packageName);
  if (!packageInfo) {
    throw new Error('获取npm包信息失败');
  }
  
  // 获取GitHub信息
  let githubInfo = null;
  if (configData.github_url) {
    console.log('  🔗 使用配置中的GitHub URL');
    githubInfo = await fetchGitHubInfo(configData.github_url);
  } else {
    const repoUrl = packageInfo.repository?.url || packageInfo.repository;
    githubInfo = await fetchGitHubInfo(repoUrl);
  }
  
  // 处理各种字段
  console.log('  🎯 处理字段信息...');
  const [optimizedDisplayName, optimizedDescription, optimizedTags] = await Promise.all([
    generateDisplayName(packageInfo, githubInfo, existingServer?.display_name, configData.display_name),
    generateChineseDescription(packageInfo, githubInfo, existingServer?.description, configData.description),
    generateTags(packageInfo, githubInfo, existingServer?.tag, configData.tag)
  ]);

  console.log('  🔍 尝试获取工具信息...');
  const tools = await getMcpServerTools(packageName, configData.env);
  
  if (tools && tools.length > 0) {
    console.log(`  🔧 找到 ${tools.length} 个工具:`, tools.map(t => t.name).join(', '));
  } else {
    console.log(`  🔧 未找到工具`);
  }
  
  // 优化工具描述
  const optimizedTools = tools ? await optimizeToolsDescriptions(tools) : null;
  
  console.log(`  🔧 优化后tools: ${optimizedTools ? `${optimizedTools.length}个` : '0个'}`);
  
  // 获取使用统计
  console.log('  📊 获取npm下载量...');
  const npmDownloads = await fetchNpmDownloads(packageName);
  
  // 计算使用次数
  let useCount = existingServer?.use_count || 0;
  
  if (npmDownloads > 0) {
    if (!existingServer || npmDownloads > (existingServer.use_count || 0)) {
      useCount = npmDownloads;
      console.log(`  📈 更新使用次数（npm下载量）: ${existingServer?.use_count || 0} -> ${useCount}`);
    }
  } else if (githubInfo?.stargazers_count && githubInfo.stargazers_count > 0) {
    if (!existingServer || githubInfo.stargazers_count > (existingServer.use_count || 0)) {
      useCount = githubInfo.stargazers_count;
      console.log(`  ⭐ 更新使用次数（GitHub stars）: ${existingServer?.use_count || 0} -> ${useCount}`);
    }
  }
  
  // 生成服务器数据
  const serverData = {
    qualified_name: packageName,
    display_name: optimizedDisplayName,
    description: optimizedDescription,
    package_url: npmUrl,
    creator: packageInfo.author?.name || packageInfo.author || '未知',
    repository_id: githubInfo?.full_name || null,
    logo: configData.logo || githubInfo?.owner?.avatar_url || null,
    tag: optimizedTags,
    type: 3,
    use_count: useCount,
    connections: generateConnections(packageName, configData.env)
  };

  console.log(`  ✨ 显示名称: ${optimizedDisplayName}`);
  console.log(`  📝 描述: ${optimizedDescription}`);
  console.log(`  🏷️  标签: ${optimizedTags}`);
  console.log(`  ⭐ 使用次数: ${useCount}`);
  if (configData.env) {
    console.log(`  🔐 环境变量: ${Object.keys(configData.env).join(', ')}`);
  }
  
  return {
    packageName,
    serverData,
    tools: optimizedTools
  };
}

/**
 * 同步单个批次到数据库
 */
async function syncBatchToDatabase(batchResults, existingServersMap) {
  for (const result of batchResults) {
    const { packageName, serverData, tools } = result;
    
    console.log(`  💾 同步 ${packageName}...`);
    
    const existingServer = existingServersMap.get(packageName);
    let serverId;
    
    if (existingServer) {
      const { error: updateError } = await supabase
        .from('mcp_servers')
        .update({
          ...serverData,
          updated_at: new Date().toISOString()
        })
        .eq('qualified_name', packageName);
        
      if (updateError) {
        console.error(`    ❌ 更新服务器失败:`, updateError);
        continue;
      }
      
      serverId = existingServer.server_id;
      console.log(`    🔄 更新现有记录 (ID: ${serverId})`);
    } else {
      const { data: insertedServer, error: insertError } = await supabase
        .from('mcp_servers')
        .insert(serverData)
        .select('server_id')
        .single();
        
      if (insertError) {
        console.error(`    ❌ 插入服务器失败:`, insertError);
        continue;
      }
      
      serverId = insertedServer.server_id;
      console.log(`    ✅ 插入新记录 (ID: ${serverId})`);
      
      existingServersMap.set(packageName, { ...serverData, server_id: serverId });
    }
    
    // 处理metainfo数据
    const metaData = {
      qualified_name: packageName,
      server_id: serverId,
      tools: tools ? JSON.stringify(tools) : null,
      resources: null,
      prompts: null
    };
    
    const { data: existingMeta } = await supabase
      .from('mcp_server_metainfo')
      .select('id')
      .eq('qualified_name', packageName)
      .single();
    
    if (existingMeta) {
      const { error: metaUpdateError } = await supabase
        .from('mcp_server_metainfo')
        .update(metaData)
        .eq('qualified_name', packageName);
        
      if (metaUpdateError) {
        console.error(`    ❌ 更新metainfo失败:`, metaUpdateError);
      } else {
        console.log(`    📝 更新metainfo成功 (tools: ${tools ? tools.length : 0}个)`);
      }
    } else {
      const { error: metaInsertError } = await supabase
        .from('mcp_server_metainfo')
        .insert(metaData);
        
      if (metaInsertError) {
        console.error(`    ❌ 插入metainfo失败:`, metaInsertError);
      } else {
        console.log(`    📝 插入metainfo成功 (tools: ${tools ? tools.length : 0}个)`);
      }
    }
    
    console.log(`    ✅ ${packageName} 同步完成`);
  }
}

/**
 * 同步数据库
 */
async function syncDatabase(options = {}) {
  const { batchSize = CONFIG.BATCH_SIZE } = options;
  
  console.log('🚀 开始同步MCP数据库...\n');
  
  // 检查环境变量
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 请设置NEXT_PUBLIC_SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY环境变量');
    process.exit(1);
  }
  
  // 加载配置
  const serversPath = path.join(__dirname, 'mcp-servers.json');
  if (!fs.existsSync(serversPath)) {
    console.error('❌ mcp-servers.json文件不存在');
    process.exit(1);
  }
  
  const serverConfigs = JSON.parse(fs.readFileSync(serversPath, 'utf8'));
  console.log(`📋 共需要处理 ${serverConfigs.length} 个包\n`);
  
  // 获取现有服务器数据
  const { data: existingServers } = await supabase
    .from('mcp_servers')
    .select('*');
  
  const existingServersMap = new Map();
  existingServers?.forEach(server => {
    existingServersMap.set(server.qualified_name, server);
  });
  
  // 处理包
  let successCount = 0;
  let failureCount = 0;
  
  // 分批处理包
  for (let i = 0; i < serverConfigs.length; i += batchSize) {
    const batch = serverConfigs.slice(i, i + batchSize);
    const batchResults = [];
    
    console.log(`\n📦 处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(serverConfigs.length / batchSize)} (${batch.length} 个包)`);
    
    for (let j = 0; j < batch.length; j++) {
      const serverConfig = batch[j];
      const packageName = extractPackageNameFromConfig(serverConfig);
      const overallIndex = i + j + 1;
      
      console.log(`\n[${overallIndex}/${serverConfigs.length}] ${packageName}`);
      
      try {
        const existingServer = existingServersMap.get(packageName);
        const result = await processPackage(serverConfig, existingServer);
        
        if (result) {
          batchResults.push(result);
          successCount++;
          console.log(`  ✅ 处理成功`);
        }
        
      } catch (error) {
        failureCount++;
        console.error(`  ❌ 处理出错: ${error.message}`);
      }
      
      // 包之间添加延迟
      if (j < batch.length - 1) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_PACKAGES));
      }
    }
    
    // 批次处理完成后同步数据库
    if (batchResults.length > 0) {
      console.log(`\n💾 同步批次 ${Math.floor(i / batchSize) + 1} 的 ${batchResults.length} 个包到数据库...`);
      
      try {
        await syncBatchToDatabase(batchResults, existingServersMap);
        console.log(`  ✅ 批次 ${Math.floor(i / batchSize) + 1} 同步完成`);
      } catch (error) {
        console.error(`  ❌ 批次 ${Math.floor(i / batchSize) + 1} 同步失败:`, error.message);
      }
    }
    
    // 批次之间休息
    if (i + batchSize < serverConfigs.length) {
      console.log(`\n⏸️ 批次间休息 2 秒...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n📊 处理完成！成功: ${successCount}，失败: ${failureCount}`);
  
  // 数据库清理
  console.log('\n💾 执行数据库清理...\n');
  
  try {
    const urlPackageNames = serverConfigs.map(config => extractPackageNameFromConfig(config)).filter(Boolean);
    
    const serversToDelete = existingServers?.filter(server => 
      !urlPackageNames.includes(server.qualified_name)
    ) || [];
    
    if (serversToDelete.length > 0) {
      console.log(`🗑️  删除 ${serversToDelete.length} 个不在配置中的服务器...`);
      
      const serverIdsToDelete = serversToDelete.map(s => s.server_id);
      await supabase
        .from('mcp_server_metainfo')
        .delete()
        .in('server_id', serverIdsToDelete);
      
      await supabase
        .from('mcp_servers')
        .delete()
        .in('qualified_name', serversToDelete.map(s => s.qualified_name));
        
      console.log(`  ✅ 清理完成`);
    } else {
      console.log(`✨ 无需清理，所有服务器都在配置文件中`);
    }
    
    console.log('\n🎉 所有操作完成！');
    console.log(`📊 最终状态: ${successCount} 个MCP服务器已同步到数据库`);
    
  } catch (error) {
    console.error('❌ 数据库同步失败:', error);
    process.exit(1);
  }
}

// 命令行接口
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {};
  
  const batchSizeIndex = args.indexOf('--batch-size');
  if (batchSizeIndex !== -1 && args[batchSizeIndex + 1]) {
    options.batchSize = parseInt(args[batchSizeIndex + 1]) || CONFIG.BATCH_SIZE;
  }
  
  if (args.includes('--help')) {
    console.log(`
使用方法: node import-npm-packages.js [选项]

选项:
  --batch-size <数量>  设置批处理大小 (默认: ${CONFIG.BATCH_SIZE})
  --help              显示此帮助信息

示例:
  node import-npm-packages.js                    # 使用默认设置
  node import-npm-packages.js --batch-size 3     # 设置批处理大小为3
`);
    process.exit(0);
  }
  
  syncDatabase(options).catch((error) => {
    console.error('💥 脚本执行失败:', error);
    process.exit(1);
  });
}

export { processPackage, syncDatabase, extractPackageName, extractPackageNameFromConfig }; 