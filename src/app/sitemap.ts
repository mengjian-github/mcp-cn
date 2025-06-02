import { MetadataRoute } from 'next';

// 获取所有服务器数据的函数
async function getAllServers() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7777'}/api/servers`, {
      next: { revalidate: 3600 } // 1小时重新验证
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch servers');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching servers for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mcp-cn.com';
  const servers = await getAllServers();
  
  // 基础页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/playground`,
      lastModified: new Date(),
      changeFrequency: 'weekly', 
      priority: 0.8,
    },
  ];

  // 动态生成服务器页面
  const serverPages: MetadataRoute.Sitemap = servers.map((server: any) => {
    const packageName = server.package_url?.split('/').pop()?.replace('@', '').replace('/', '-') || server.qualified_name;
    
    return {
      url: `${baseUrl}/server/${packageName}`,
      lastModified: new Date(server.updated_at || server.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });

  // 分类页面 (如果有分类功能)
  const categoriesSet = new Set(servers.map((server: any) => server.tag).filter(Boolean));
  const categories = Array.from(categoriesSet) as string[];
  const categoryPages: MetadataRoute.Sitemap = categories.map((category: string) => ({
    url: `${baseUrl}/category/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...serverPages, ...categoryPages];
} 