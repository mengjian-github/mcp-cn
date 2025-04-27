import { GetMcpServerResponse } from '@/types/server';
import { serverData } from '@/utils/server-data';
import { NextRequest, NextResponse } from 'next/server';
/**
 * 获取服务器详情
 * 复制自McpServerService的getMcpServerDetails函数
 */
export async function GET(
  request: NextRequest,
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const qualifiedName = searchParams.get('qualifiedName') || '';
    console.info('getMcpServerDetails params:', { qualifiedName });

    const server = serverData.find(s => s.qualified_name === qualifiedName);

    if (!server) {
      return NextResponse.json(
        {
          code: 404,
          message: '服务器不存在'
        },
        { status: 404 }
      );
    }

    const response: GetMcpServerResponse = {
      code: 0,
      message: 'success',
      data: server
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('getMcpServerDetails error:', error);
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
 * 删除服务器
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { qualifiedName: string } }
) {
  try {
    const qualifiedName = params.qualifiedName;
    console.info('removeMcpServer params:', { qualifiedName });

    // 此处需要替换为实际的数据库删除操作
    // 模拟删除成功
    const success = true;

    return NextResponse.json({
      code: 0,
      message: 'success',
      data: {
        qualifiedName,
        success
      }
    });
  } catch (error: any) {
    console.error('removeMcpServer error:', error);
    return NextResponse.json(
      {
        code: 500,
        message: error.message || '服务器内部错误'
      },
      { status: 500 }
    );
  }
} 