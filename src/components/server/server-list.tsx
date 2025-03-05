import { MCPServer } from "@/types/mcp";
import { ServerCard } from "@/components/server/server-card";

interface ServerListProps {
  servers: MCPServer[];
}

export function ServerList({ servers }: ServerListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {servers.map((server) => (
        <ServerCard key={server.id} server={server} />
      ))}
    </div>
  );
} 