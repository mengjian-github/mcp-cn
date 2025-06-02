"use client";

import Head from 'next/head';
import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  jsonLd?: object;
  noindex?: boolean;
  nofollow?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = '/images/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  jsonLd,
  noindex = false,
  nofollow = false,
}) => {
  const siteUrl = 'https://mcp-cn.com';
  const fullTitle = title ? `${title} | MCP Hub 中国` : 'MCP Hub 中国 - 国内首个 MCP 生态平台';
  const finalDescription = description || 'MCP Hub 中国是国内首个专注于 Model Context Protocol (MCP) 生态的开源平台。汇聚全球优质 MCP 服务，提供一站式解决方案，从服务发现、接入指南到使用示例，全流程支持中文生态。';
  const finalCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const finalOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  // 客户端动态更新 meta 标签
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 更新 title
    document.title = fullTitle;

    // 更新或创建 meta 标签的通用函数
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (meta) {
        meta.content = content;
      } else {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // 更新基础 meta 标签
    updateMetaTag('description', finalDescription);
    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }

    // 更新 robots
    const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;
    updateMetaTag('robots', robotsContent);

    // 更新 Open Graph 标签
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:image', finalOgImage, true);
    updateMetaTag('og:url', finalCanonical, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', 'MCP Hub 中国', true);
    updateMetaTag('og:locale', 'zh_CN', true);

    // 更新 Twitter 标签
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', finalOgImage);

    // 更新 canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = finalCanonical;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = finalCanonical;
      document.head.appendChild(canonicalLink);
    }

    // 清理函数（可选）
    return () => {
      // 如果需要，可以在这里进行清理
    };
  }, [
    fullTitle,
    finalDescription,
    keywords,
    finalCanonical,
    finalOgImage,
    ogType,
    twitterCard,
    noindex,
    nofollow
  ]);

  return (
    <>
      {/* 结构化数据 */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      )}
    </>
  );
};

// 特定页面的 SEO 预设
export const HomePageSEO: React.FC<{ stats?: any[] }> = ({ stats = [] }) => {
  const totalServers = stats.find(s => s.label === 'MCP 服务')?.value || 0;
  const totalUsage = stats.find(s => s.label === '总调用量')?.value || 0;
  
  const enhancedDescription = totalServers > 0 
    ? `MCP Hub 中国汇聚了 ${totalServers}+ 个优质 MCP 服务，总调用量超过 ${totalUsage.toLocaleString()}。支持 Cursor、Claude、Windsurf 等主流平台，让 AI 应用更强大。`
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MCP Hub 中国",
    description: "国内首个 MCP 生态平台，连接 AI 与世界的桥梁",
    url: "https://mcp-cn.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://mcp-cn.com/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    publisher: {
      "@type": "Organization",
      name: "MCP Hub 中国",
      url: "https://mcp-cn.com",
      logo: {
        "@type": "ImageObject",
        url: "https://mcp-cn.com/logo.png"
      }
    }
  };

  return (
    <SEO
      description={enhancedDescription}
      keywords={[
        'MCP',
        'Model Context Protocol',
        'AI工具',
        '人工智能',
        'Cursor',
        'Claude',
        'Windsurf',
        '开源',
        '中国',
        '生态平台'
      ]}
      canonical="/"
      jsonLd={jsonLd}
    />
  );
};

export const ServerPageSEO: React.FC<{ server: any; packageName: string }> = ({ 
  server, 
  packageName 
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: server.display_name,
    description: server.description,
    url: `https://mcp-cn.com/server/${packageName}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: ["Windows", "macOS", "Linux"],
    author: {
      "@type": "Person",
      name: server.creator
    },
    publisher: {
      "@type": "Organization",
      name: "MCP Hub 中国"
    },
    downloadUrl: server.package_url,
    installUrl: server.package_url
  };

  return (
    <SEO
      title={server.display_name}
      description={`${server.description} - 在 MCP Hub 中国发现和使用这个强大的 MCP 服务，支持 Cursor、Claude、Windsurf 等平台。`}
      keywords={[
        server.display_name,
        'MCP服务',
        'AI工具',
        server.creator,
        'Cursor',
        'Claude',
        'Windsurf'
      ]}
      canonical={`/server/${packageName}`}
      ogType="product"
      jsonLd={jsonLd}
    />
  );
}; 