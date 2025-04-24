import { ServerInfo } from "@mcp-monorepo/shared/zod";
import { create } from "zustand";

interface ServerState {
  servers: ServerInfo[];
  loading: boolean;
  error: string | null;
  fetchServers: () => Promise<void>;
}

export const useServerStore = create<ServerState>()((set) => ({
  servers: [],
  loading: false,
  error: null,
  fetchServers: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch("/mcp_api/servers");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as { data?: ServerInfo[] };
      set({ servers: data.data ?? [], loading: false });
    } catch (error) {
      console.error("Failed to fetch servers:", error);
      set({
        error: error instanceof Error ? error.message : "获取服务器列表失败",
        loading: false,
      });
    }
  },
}));
