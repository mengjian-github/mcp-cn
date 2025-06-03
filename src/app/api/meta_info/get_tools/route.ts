import { supabase } from '@/lib/supabase';
import { GetMcpToolResponse } from "@/types/server";
import { NextRequest, NextResponse } from "next/server";
/**
 * 获取服务器详情
 * 复制自McpServerService的getMcpServerDetails函数
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const serverId = searchParams.get("serverId") || "";
    console.info("getMcpServerDetails params:", { serverId });

    // 查询supabase
    const { data, error } = await supabase
      .from('mcp_server_metainfo')
      .select('*')
      .eq('server_id', serverId)
      .single();

    console.log('data', JSON.parse(data.tools));

    if (error || !data) {
      const notFoundResponse = NextResponse.json(
        {
          code: 0,
          message: "Tool not found",
        },
        { status: 200 }
      );
      
      // 404响应也不缓存
      notFoundResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      notFoundResponse.headers.set('Pragma', 'no-cache');
      notFoundResponse.headers.set('Expires', '0');
      
      return notFoundResponse;
    }

    const response: GetMcpToolResponse = {
      code: 0,
      message: "success",
      data: {
        ...data,
        tools: data.tools ? JSON.parse(data.tools) : []
      },
    };

    const nextResponse = NextResponse.json(response);
    
    // 设置缓存控制头
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');
    
    return nextResponse;
  } catch (error: any) {
    console.error("getMcpServerDetails error:", error);
    const errorResponse = NextResponse.json(
      {
        code: 500,
        message: error.message || "服务器内部错误",
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
