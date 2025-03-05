import Image from "next/image";
import Link from "next/link";
import { MCPServer } from "@/types/mcp";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServerCardProps {
  server: MCPServer;
}

export function ServerCard({ server }: ServerCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all border-border/40 hover:border-primary/20">
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          {server.logo && (
            <div className="relative h-12 w-12 overflow-hidden rounded-lg border bg-background/50 p-1">
              <Image
                src={server.logo}
                alt={server.name}
                fill
                className="object-contain"
              />
            </div>
          )}
          <div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {server.name}
            </CardTitle>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <span>{server.downloads.toLocaleString()}</span>
              <span className="text-xs">下载</span>
              <span className="mx-1">•</span>
              <span className="text-xs">{new Date(server.updatedAt).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {server.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span
            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
          >
            {server.category.name}
          </span>
          {server.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {tag.name}
            </span>
          ))}
          {server.tags.length > 2 && (
            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              +{server.tags.length - 2}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full justify-between">
          <Button variant="outline" size="sm" asChild className="group-hover:border-primary/50 group-hover:text-primary transition-colors">
            <Link href={`/servers/${server.id}`}>查看详情</Link>
          </Button>
          <Button size="sm" className="group-hover:bg-primary/90 transition-colors">
            安装
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 