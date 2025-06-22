import { supabase, supabaseAdmin } from '@/lib/supabase';
import {
  ListMcpServersResponse
} from '@/types/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 获取服务器列表
 * 复制自McpServerService的listMcpServers函数
 */
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const keywords = searchParams.get('keywords') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 10;

    // 构造 supabase 查询
    let query = supabase
      .from('mcp_servers')
      .select('*', { count: 'exact' })
      .order('use_count', { ascending: false });

    if (keywords) {
      query = query.or(`qualified_name.ilike.%${keywords}%,display_name.ilike.%${keywords}%`);
    }

    // 分页
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const response: ListMcpServersResponse = {
      code: 0,
      message: 'success',
      data: data || [],
      pagination: {
        total: count || 0,
        page,
        pageSize
      }
    };

    const nextResponse = NextResponse.json(response);

    // 设置缓存控制头 - 允许缓存5分钟
    nextResponse.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    nextResponse.headers.set('CDN-Cache-Control', 'public, s-maxage=300');

    return nextResponse;
  } catch (error: any) {
    console.error('listMcpServers error:', error);
    const errorResponse = NextResponse.json(
      {
        code: 500,
        message: error.message || '服务器内部错误'
      },
      { status: 500 }
    );

    // 错误响应也不缓存
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    errorResponse.headers.set('Pragma', 'no-cache');
    errorResponse.headers.set('Expires', '0');

    return errorResponse;
  }
}

/**
 * 注册MCP服务器
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = NextResponse.json({
      code: 0,
      message: 'success',
      data: `服务器注册成功: ${JSON.stringify(body)}`
    });

    // POST请求也不缓存
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error: any) {
    const errorResponse = NextResponse.json(
      {
        code: 500,
        message: error.message || '服务器内部错误'
      },
      { status: 500 }
    );

    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    errorResponse.headers.set('Pragma', 'no-cache');
    errorResponse.headers.set('Expires', '0');

    return errorResponse;
  }
}
