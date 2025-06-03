#!/usr/bin/env node

import { processPackage, extractPackageName } from './import-npm-packages.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载 .env 文件
dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
  const npmUrl = process.argv[2];
  
  if (!npmUrl) {
    console.error('❌ 请提供npm包URL');
    console.log('用法: node import-single-package.js <npm-url>');
    console.log('示例: node import-single-package.js https://www.npmjs.com/package/@upstash/context7-mcp');
    process.exit(1);
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ 请设置NEXT_PUBLIC_SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY环境变量');
    process.exit(1);
  }
  
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  console.log('🚀 开始导入npm包...\n');
  
  try {
    const result = await processPackage(npmUrl);
    if (!result) {
      console.log('\n❌ 导入失败！');
      process.exit(1);
    }
    
    const { serverData, tools } = result;
    const packageName = extractPackageName(npmUrl);
    
    console.log('\n💾 保存到数据库...');
    
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
        console.error('❌ 更新服务器失败:', updateError);
        process.exit(1);
      }
      
      serverId = existingServer.server_id;
      console.log(`✅ 更新服务器成功 (ID: ${serverId})`);
    } else {
      // 插入新记录
      const { data: insertedServer, error: insertError } = await supabase
        .from('mcp_servers')
        .insert(serverData)
        .select('server_id')
        .single();
        
      if (insertError) {
        console.error('❌ 插入服务器失败:', insertError);
        process.exit(1);
      }
      
      serverId = insertedServer.server_id;
      console.log(`✅ 插入服务器成功 (ID: ${serverId})`);
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
      const { error: metaError } = await supabase
        .from('mcp_server_metainfo')
        .update(metaData)
        .eq('qualified_name', packageName);
        
      if (metaError) {
        console.error('❌ 更新元数据失败:', metaError);
      } else {
        console.log('✅ 更新元数据成功');
      }
    } else {
      // 插入新metainfo
      const { error: metaError } = await supabase
        .from('mcp_server_metainfo')
        .insert(metaData);
        
      if (metaError) {
        console.error('❌ 插入元数据失败:', metaError);
      } else {
        console.log('✅ 插入元数据成功');
      }
    }
    
    console.log('\n🎉 导入完成！');
    
  } catch (error) {
    console.error('\n❌ 导入过程中出错:', error);
    process.exit(1);
  }
}

main().catch(console.error); 