import {
    ListMcpServersRequest,
    ListMcpServersResponse
} from '@/types/server';
import { serverData } from '@/utils/server-data';
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
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined;
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : undefined;

    // 构造请求参数
    const params: ListMcpServersRequest = {
      keywords,
      page,
      pageSize
    };

    console.info('listMcpServers params:', params);

    // 构造查询条件
    const where: any = {};
    if (params.keywords) {
      // 使用模糊匹配搜索 qualified_name 或 display_name
      where.or = [
        { qualified_name: { contains: params.keywords } },
        { display_name: { contains: params.keywords } }
      ];
    }

    let offset: number | undefined;
    let limit: number | undefined;

    if (page && pageSize) {
      offset = (page - 1) * pageSize;
      limit = pageSize;
    }

    // 模拟过滤
    let filteredServers = [...serverData];
    if (params.keywords) {
      const keyword = params.keywords.toLowerCase();
      filteredServers = filteredServers.filter(
        server => 
          server.qualified_name.toLowerCase().includes(keyword) || 
          server.display_name.toLowerCase().includes(keyword)
      );
    }

    // 模拟分页
    const total = filteredServers.length;
    if (offset !== undefined && limit !== undefined) {
      filteredServers = filteredServers.slice(offset, offset + limit);
    }

    // 按使用次数排序
    filteredServers.sort((a, b) => b.use_count - a.use_count);

    // 返回结果
    const response: ListMcpServersResponse = {
      code: 0,
      message: 'success',
      data: filteredServers,
      pagination: {
        total,
        page,
        pageSize
      }
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('listMcpServers error:', error);
    return NextResponse.json(
      {
        code: 500,
        message: error.message || '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

/**
 * 注册MCP服务器
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      code: 0,
      message: 'success',
      data: `服务器注册成功: ${JSON.stringify(body)}`
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        code: 500,
        message: error.message || '服务器内部错误'
      },
      { status: 500 }
    );
  }
}