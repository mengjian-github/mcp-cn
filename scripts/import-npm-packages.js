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

/**
 * 调用AI生成内容
 */
async function callAI(prompt, systemPrompt = '你是一个专业的技术文档翻译和优化助手。') {
  if (!openrouterApiKey) {
    console.log('⚠️ 未设置OPENROUTER_API_KEY，跳过AI优化');
    return null;
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
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
      }
    });

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
 * 获取npm包信息
 */
async function fetchNpmPackageInfo(packageName) {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    return response.data;
  } catch (error) {
    console.error(`获取包 ${packageName} 信息失败:`, error.message);
    return null;
  }
}

/**
 * 获取GitHub仓库信息
 */
async function fetchGitHubInfo(repoUrl) {
  try {
    if (!repoUrl) return null;
    
    // 从各种格式的仓库URL中提取owner/repo
    const match = repoUrl.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
    if (!match) return null;
    
    const [, owner, repo] = match;
    const headers = {};
    
    // 如果设置了GitHub token，添加到请求头
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    return response.data;
  } catch (error) {
    console.error('获取GitHub信息失败:', error.message);
    return null;
  }
}

/**
 * 生成优化的显示名称
 */
async function generateDisplayName(packageInfo, githubInfo) {
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
async function generateChineseDescription(packageInfo, githubInfo) {
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
async function generateTags(packageInfo, githubInfo) {
  const keywords = packageInfo.keywords || [];
  const description = packageInfo.description || githubInfo?.description || '';
  const name = packageInfo.name;
  
  const prompt = `
请为这个MCP工具生成3-5个合适的中文标签：

包名: ${name}
描述: ${description}
关键词: ${keywords.join(', ')}

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
  
  // 从keywords获取
  if (packageInfo.keywords) {
    packageInfo.keywords.forEach(keyword => {
      if (keyword.length <= 20) {
        tags.add(keyword);
      }
    });
  }
  
  // 根据包名推断
  const name_lower = packageInfo.name.toLowerCase();
  if (name_lower.includes('browser')) tags.add('浏览器');
  if (name_lower.includes('file')) tags.add('文件操作');
  if (name_lower.includes('db') || name_lower.includes('database')) tags.add('数据库');
  if (name_lower.includes('api')) tags.add('API接口');
  if (name_lower.includes('web')) tags.add('网络');
  if (name_lower.includes('tool')) tags.add('开发工具');
  
  return Array.from(tags).slice(0, 5).join(',');
}

/**
 * 尝试获取MCP服务器的工具信息
 */
async function getMcpServerTools(packageName) {
  return new Promise((resolve) => {
    const tempDir = path.join(__dirname, 'temp', packageName.replace(/[@\/]/g, '_'));
    
    try {
      fs.mkdirSync(tempDir, { recursive: true });
      
      const npmInstall = spawn('npm', ['install', packageName], { 
        cwd: tempDir,
        stdio: 'pipe'
      });
      
      npmInstall.on('close', async (code) => {
        if (code !== 0) {
          console.log(`  📦 包 ${packageName} 安装失败，跳过工具检测`);
          fs.rmSync(tempDir, { recursive: true, force: true });
          resolve(null);
          return;
        }
        
        try {
          const commands = [
            ['npx', [packageName]],
            ['npx', [packageName, '--stdio']], 
            ['node', [`node_modules/.bin/${packageName}`]]
          ];
          
          let toolsFound = false;
          
          for (const [cmd, args] of commands) {
            if (toolsFound) break;
            
            try {
              const mcpClient = spawn(cmd, args, {
                cwd: tempDir,
                stdio: 'pipe'
              });
              
              let output = '';
              
              mcpClient.stdout.on('data', (data) => {
                output += data.toString();
              });
              
              const clientPromise = new Promise((clientResolve) => {
                mcpClient.on('close', () => {
                  try {
                    const tools = parseMcpOutput(output);
                    if (tools && tools.length > 0) {
                      toolsFound = true;
                      clientResolve(tools);
                    } else {
                      clientResolve(null);
                    }
                  } catch (error) {
                    clientResolve(null);
                  }
                });
                
                mcpClient.on('error', () => {
                  clientResolve(null);
                });
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
              
              const timeout = setTimeout(() => {
                if (!mcpClient.killed) {
                  mcpClient.kill();
                }
              }, 8000);
              
              const result = await clientPromise;
              clearTimeout(timeout);
              
              if (result) {
                fs.rmSync(tempDir, { recursive: true, force: true });
                resolve(result);
                return;
              }
              
            } catch (error) {
              continue;
            }
          }
          
          fs.rmSync(tempDir, { recursive: true, force: true });
          resolve(null);
          
        } catch (error) {
          fs.rmSync(tempDir, { recursive: true, force: true });
          resolve(null);
        }
      });
      
    } catch (error) {
      resolve(null);
    }
  });
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
        console.log(`  🔧 找到 ${validTools.length} 个工具:`, validTools.map(t => t.name).join(', '));
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
请将这个MCP工具的描述翻译并优化为中文：

工具名称: ${tool.name}
英文描述: ${tool.description}

要求：
1. 翻译成简洁的中文
2. 突出工具的核心功能
3. 保持技术准确性
4. 控制在30字以内
5. 只返回优化后的描述，不要其他内容
`;

    const optimizedDesc = await callAI(prompt);
    
    optimizedTools.push({
      ...tool,
      description: optimizedDesc || tool.description,
      translation: optimizedDesc // 保留原字段的同时添加翻译字段
    });
    
    // 避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return optimizedTools;
}

/**
 * 处理单个npm包
 */
async function processPackage(npmUrl) {
  console.log(`\n📦 处理包: ${npmUrl}`);
  
  const packageName = extractPackageName(npmUrl);
  if (!packageName) {
    console.error('  ❌ 无法从URL提取包名');
    return null;
  }

  console.log(`  📋 包名: ${packageName}`);
  
  // 获取npm包信息
  const packageInfo = await fetchNpmPackageInfo(packageName);
  if (!packageInfo) {
    console.error('  ❌ 获取npm包信息失败');
    return null;
  }
  
  // 获取GitHub信息
  const repoUrl = packageInfo.repository?.url || packageInfo.repository;
  const githubInfo = await fetchGitHubInfo(repoUrl);
  
  console.log('  🤖 使用AI优化内容...');
  
  // 使用AI优化各种字段
  const [optimizedDisplayName, optimizedDescription, optimizedTags] = await Promise.all([
    generateDisplayName(packageInfo, githubInfo),
    generateChineseDescription(packageInfo, githubInfo),
    generateTags(packageInfo, githubInfo)
  ]);

  console.log('  🔍 尝试获取工具信息...');
  const tools = await getMcpServerTools(packageName);
  
  // 优化工具描述
  const optimizedTools = tools ? await optimizeToolsDescriptions(tools) : null;
  
  // 生成服务器数据
  const serverData = {
    qualified_name: packageName,
    display_name: optimizedDisplayName,
    description: optimizedDescription,
    package_url: npmUrl,
    creator: packageInfo.author?.name || packageInfo.author || '未知',
    repository_id: githubInfo?.full_name || null,
    logo: githubInfo?.owner?.avatar_url || null,
    tag: optimizedTags,
    type: 3,
    use_count: githubInfo?.stargazers_count || 0, // 使用GitHub stars作为初始use_count
    connections: JSON.stringify([{
      type: "stdio",
      config: {
        command: "npx",
        args: [packageName]
      }
    }])
  };

  console.log(`  ✨ 显示名称: ${optimizedDisplayName}`);
  console.log(`  📝 描述: ${optimizedDescription}`);
  console.log(`  🏷️  标签: ${optimizedTags}`);
  console.log(`  ⭐ Stars: ${githubInfo?.stargazers_count || 0}`);
  
  return {
    serverData,
    tools: optimizedTools
  };
}

/**
 * 同步数据库
 */
async function syncDatabase() {
  console.log('🚀 开始同步MCP数据库...\n');
  
  // 检查环境变量
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 请设置NEXT_PUBLIC_SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY环境变量');
    process.exit(1);
  }
  
  // 加载URLs配置
  const urlsPath = path.join(__dirname, 'urls.json');
  if (!fs.existsSync(urlsPath)) {
    console.error('❌ urls.json文件不存在');
    process.exit(1);
  }
  
  const urls = JSON.parse(fs.readFileSync(urlsPath, 'utf8'));
  console.log(`📋 共需要处理 ${urls.length} 个包\n`);
  
  // 处理所有包
  const results = [];
  let successCount = 0;
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const packageName = extractPackageName(url);
    
    console.log(`[${i + 1}/${urls.length}] ${packageName}`);
    
    try {
      const result = await processPackage(url);
      if (result) {
        results.push({ packageName, ...result });
        successCount++;
        console.log(`  ✅ 处理成功`);
      } else {
        console.log(`  ❌ 处理失败`);
      }
      
      // 添加延迟避免请求过于频繁
      if (i < urls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`  ❌ 处理出错:`, error.message);
    }
  }
  
  console.log(`\n📊 处理完成！成功: ${successCount}/${urls.length}`);
  console.log('💾 开始同步到数据库...\n');
  
  // 开始数据库事务
  try {
    // 1. 获取当前数据库中的所有服务器
    const { data: existingServers } = await supabase
      .from('mcp_servers')
      .select('qualified_name, server_id');
    
    console.log(`📚 数据库中现有 ${existingServers?.length || 0} 个服务器`);
    
    // 2. 确定需要保留的qualified_names
    const urlPackageNames = urls.map(url => extractPackageName(url)).filter(Boolean);
    
    // 3. 删除不在urls.json中的服务器
    const serversToDelete = existingServers?.filter(server => 
      !urlPackageNames.includes(server.qualified_name)
    ) || [];
    
    if (serversToDelete.length > 0) {
      console.log(`🗑️  删除 ${serversToDelete.length} 个不在配置中的服务器...`);
      
      // 删除关联的metainfo记录
      const serverIdsToDelete = serversToDelete.map(s => s.server_id);
      await supabase
        .from('mcp_server_metainfo')
        .delete()
        .in('server_id', serverIdsToDelete);
      
      // 删除服务器记录
      await supabase
        .from('mcp_servers')
        .delete()
        .in('qualified_name', serversToDelete.map(s => s.qualified_name));
    }
    
    // 4. 插入或更新服务器数据
    for (const result of results) {
      const { packageName, serverData, tools } = result;
      
      console.log(`💾 同步 ${packageName}...`);
      
      // 查找现有记录
      const { data: existingServer } = await supabase
        .from('mcp_servers')
        .select('server_id')
        .eq('qualified_name', packageName)
        .single();
      
      let serverId;
      
      if (existingServer) {
        // 更新现有记录
        const { error: updateError } = await supabase
          .from('mcp_servers')
          .update({
            ...serverData,
            updated_at: new Date().toISOString()
          })
          .eq('qualified_name', packageName);
          
        if (updateError) {
          console.error(`  ❌ 更新服务器失败:`, updateError);
          continue;
        }
        
        serverId = existingServer.server_id;
      } else {
        // 插入新记录
        const { data: insertedServer, error: insertError } = await supabase
          .from('mcp_servers')
          .insert(serverData)
          .select('server_id')
          .single();
          
        if (insertError) {
          console.error(`  ❌ 插入服务器失败:`, insertError);
          continue;
        }
        
        serverId = insertedServer.server_id;
      }
      
      // 处理metainfo数据
      const metaData = {
        qualified_name: packageName,
        server_id: serverId,
        tools: tools ? JSON.stringify(JSON.stringify(tools)) : null,
        resources: null,
        prompts: null
      };
      
      // 检查metainfo是否存在
      const { data: existingMeta } = await supabase
        .from('mcp_server_metainfo')
        .select('id')
        .eq('qualified_name', packageName)
        .single();
      
      if (existingMeta) {
        // 更新现有metainfo
        await supabase
          .from('mcp_server_metainfo')
          .update(metaData)
          .eq('qualified_name', packageName);
      } else {
        // 插入新metainfo
        await supabase
          .from('mcp_server_metainfo')
          .insert(metaData);
      }
      
      console.log(`  ✅ 同步完成 (server_id: ${serverId})`);
    }
    
    console.log('\n🎉 数据库同步完成！');
    console.log(`📊 最终状态: ${results.length} 个MCP服务器`);
    
  } catch (error) {
    console.error('❌ 数据库同步失败:', error);
    process.exit(1);
  }
}

// 如果直接运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  syncDatabase().catch(console.error);
}

export { processPackage, syncDatabase, extractPackageName }; 