import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 增加服务器使用次数
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

            // 使用 Supabase 更新使用次数 - 先获取当前值，然后增加1
    const { data: currentServer, error: fetchError } = await supabaseAdmin
      .from('mcp_servers')
      .select('use_count')
      .eq('qualified_name', qualifiedName)
      .single();

    if (fetchError) {
      console.error('Fetch server error:', fetchError);
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          {
            code: 404,
            message: '服务器不存在'
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          code: 500,
          message: '获取服务器信息失败'
        },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin
      .from('mcp_servers')
      .update({
        use_count: (currentServer.use_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('qualified_name', qualifiedName);

        if (error) {
      console.error('Database update error:', error);
      return NextResponse.json(
        {
          code: 500,
          message: '更新使用次数失败'
        },
        { status: 500 }
      );
    }

    const successResponse = NextResponse.json({
      code: 0,
      message: 'success'
    });

    // 设置缓存控制头
    successResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    successResponse.headers.set('Pragma', 'no-cache');
    successResponse.headers.set('Expires', '0');

    return successResponse;
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
