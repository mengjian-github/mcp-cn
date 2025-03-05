import Link from "next/link";
import Image from "next/image";
import { Button } from "./button";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden">
              <Image
                src="/logos/mcp-logo.svg"
                alt="MCP中国"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold">MCP中国</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              首页
            </Link>
            <Link href="/servers" className="text-sm font-medium transition-colors hover:text-primary">
              服务器
            </Link>
            <Link href="/docs" className="text-sm font-medium transition-colors hover:text-primary">
              文档
            </Link>
            <Link href="/community" className="text-sm font-medium transition-colors hover:text-primary">
              社区
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">登录</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">注册</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
} 