import Image from "next/image";
import Link from "next/link";
import { MCPServer } from "@/types/mcp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Download, ExternalLink, Github, MessageSquare } from "lucide-react";

interface ServerDetailProps {
  server: MCPServer;
}

export function ServerDetail({ server }: ServerDetailProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左侧信息卡片 */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src={server.logo || "/placeholder.png"}
                  alt={server.name}
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
              <CardTitle>{server.name}</CardTitle>
              <CardDescription>
                {server.category.name} · {server.downloads.toLocaleString()} 下载
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  创建于 {new Date(server.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {server.downloads.toLocaleString()} 下载
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {server.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full">安装</Button>
              {server.githubUrl && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={server.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              )}
              {server.authorUrl && (
                <Button variant="ghost" className="w-full" asChild>
                  <Link href={server.authorUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    访问作者网站
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* 右侧详情内容 */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="documentation">文档</TabsTrigger>
              <TabsTrigger value="examples">示例</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <div className="prose max-w-none">
                <h2>描述</h2>
                <p>{server.description}</p>
                
                <h2 className="mt-8">功能特点</h2>
                <ul>
                  {server.tags.map((tag) => (
                    <li key={tag.id}>
                      <strong>{tag.name}</strong>: 支持{tag.name}相关功能
                    </li>
                  ))}
                </ul>
                
                <h2 className="mt-8">作者信息</h2>
                <p>
                  <strong>作者</strong>: {server.author}
                  {server.authorUrl && (
                    <span>
                      {" "}
                      (<Link href={server.authorUrl} target="_blank" rel="noopener noreferrer">
                        访问网站
                      </Link>)
                    </span>
                  )}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="documentation" className="mt-6">
              <div className="prose max-w-none">
                <h2>使用文档</h2>
                <p>此MCP服务器的详细使用文档将在此处显示。</p>
                
                <h3>安装</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>npm install {server.name.toLowerCase()}-mcp</code>
                </pre>
                
                <h3>基本用法</h3>
                <p>以下是使用此MCP服务器的基本示例：</p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`
import { ${server.name}MCP } from '${server.name.toLowerCase()}-mcp';

// 初始化MCP客户端
const client = new ${server.name}MCP({
  apiKey: 'YOUR_API_KEY',
});

// 使用客户端
const response = await client.sendMessage({
  content: '你好，世界！',
});
                  `}</code>
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="examples" className="mt-6">
              <div className="prose max-w-none">
                <h2>示例</h2>
                <p>以下是一些使用此MCP服务器的示例：</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">基础集成示例</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>展示如何将此MCP服务器集成到基本应用程序中。</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        查看示例
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">高级功能示例</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>展示如何使用此MCP服务器的高级功能。</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        查看示例
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 