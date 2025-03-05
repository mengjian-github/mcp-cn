import Link from "next/link";
import { Button } from "./button";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 py-20">
      {/* 装饰元素 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />
      </div>
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            中国MCP生态系统
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            连接中国本土平台，赋能AI应用开发。MCP中国生态系统提供丰富的服务器集合，
            帮助开发者轻松构建与国内平台无缝集成的智能应用。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/servers">浏览服务器</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs/getting-started">开始使用</Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-primary">20+</div>
              <div className="ml-2 text-sm text-muted-foreground">服务器</div>
            </div>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="ml-2 text-sm text-muted-foreground">下载</div>
            </div>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="ml-2 text-sm text-muted-foreground">开发者</div>
            </div>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-primary">5+</div>
              <div className="ml-2 text-sm text-muted-foreground">平台集成</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 