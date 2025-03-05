export interface MCPServer {
  id: string;
  name: string;
  description: string;
  downloads: number;
  author: string;
  authorUrl?: string;
  githubUrl?: string;
  tags: MCPTag[];
  category: MCPCategory;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MCPCategory {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface MCPTag {
  id: string;
  name: string;
  count: number;
}

export interface MCPAuthor {
  id: string;
  name: string;
  url?: string;
  avatarUrl?: string;
  bio?: string;
  servers: number;
} 