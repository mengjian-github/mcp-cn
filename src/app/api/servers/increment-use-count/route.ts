import { serverData } from '@/utils/server-data';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 增加服务器使用次数
 * 复制自McpServerService的incrementUseCount函数
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qualifiedName } = body;

    if (!qualifiedName) {
      return NextResponse.json(
        {
          code: 400,
          message: '缺少必要参数: qualifiedName'
        },
        { status: 400 }
      );
    }

    console.info('incrementUseCount params:', { qualifiedName });

    // 检查服务器是否存在
    const serverIndex = serverData.findIndex(s => s.qualified_name === qualifiedName);
    if (serverIndex === -1) {
      return NextResponse.json(
        {
          code: 404,
          message: '服务器不存在'
        },
        { status: 404 }
      );
    }

    // 模拟增加使用次数
    // 在实际应用中，这里应该更新数据库中的记录
    serverData[serverIndex].use_count += 1;

    return NextResponse.json({
      code: 0,
      message: 'success'
    });
  } catch (error: any) {
    console.error('incrementUseCount error:', error);
    return NextResponse.json(
      {
        code: 500,
        message: error.message || '服务器内部错误'
      },
      { status: 500 }
    );
  }
} 