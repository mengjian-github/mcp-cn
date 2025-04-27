import { GetMcpToolResponse } from "@/types/server";
import { toolsData } from "@/utils/tools-data";
import { NextRequest, NextResponse } from "next/server";
/**
 * 获取服务器详情
 * 复制自McpServerService的getMcpServerDetails函数
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const qualifiedName = searchParams.get("qualifiedName") || "";
    console.info("getMcpServerDetails params:", { qualifiedName });

    const tool = toolsData.find((s) => s.qualified_name === qualifiedName);

    if (!tool) {
      return NextResponse.json(
        {
          code: 0,
          message: "Tool not found",
        },
        { status: 200 }
      );
    }

    const response: GetMcpToolResponse = {
      code: 0,
      message: "success",
      data: { ...tool, tools: JSON.parse(tool.tools) },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("getMcpServerDetails error:", error);
    return NextResponse.json(
      {
        code: 500,
        message: error.message || "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
