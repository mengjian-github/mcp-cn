/**
 * Cloudflare Worker - API缓存代理
 * 将频繁访问的API请求缓存在Cloudflare边缘，减少Vercel Function调用
 */

// 配置
const CONFIG = {
  // 你的Vercel域名
  VERCEL_DOMAIN: 'mcp-cn.vercel.app',
  // 缓存配置
  CACHE_SETTINGS: {
    '/api/servers': { ttl: 300, staleWhileRevalidate: 3600 }, // 5分钟缓存，1小时stale
    '/api/meta_info/get_tools': { ttl: 1800, staleWhileRevalidate: 7200 }, // 30分钟缓存
    '/api/servers/get_details': { ttl: 600, staleWhileRevalidate: 1800 }, // 10分钟缓存
  }
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 只处理API请求
    if (!pathname.startsWith('/api/')) {
      return fetch(request);
    }

    // 对于POST请求（如increment-use-count），直接转发到Vercel
    if (request.method === 'POST') {
      return forwardToVercel(request);
    }

    // 检查是否有缓存配置
    const cacheConfig = getCacheConfig(pathname);
    if (!cacheConfig) {
      return forwardToVercel(request);
    }

    // 构建缓存key
    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;

    // 尝试从缓存获取
    let response = await cache.match(cacheKey);

    if (response) {
      // 检查是否需要后台刷新
      const cacheAge = getCacheAge(response);
      if (cacheAge > cacheConfig.ttl) {
        // 后台刷新缓存
        ctx.waitUntil(refreshCache(cacheKey, request, cacheConfig));
      }

      // 添加缓存头
      response = new Response(response.body, response);
      response.headers.set('CF-Cache-Status', 'HIT');
      response.headers.set('Cache-Control', `public, max-age=${cacheConfig.ttl}, stale-while-revalidate=${cacheConfig.staleWhileRevalidate}`);

      return response;
    }

    // 缓存未命中，从Vercel获取
    response = await forwardToVercel(request);

    // 缓存响应（仅对成功响应）
    if (response.ok) {
      const responseToCache = response.clone();
      responseToCache.headers.set('CF-Cache-Status', 'MISS');
      responseToCache.headers.set('Cache-Control', `public, max-age=${cacheConfig.ttl}, stale-while-revalidate=${cacheConfig.staleWhileRevalidate}`);
      responseToCache.headers.set('CF-Cached-At', new Date().toISOString());

      ctx.waitUntil(cache.put(cacheKey, responseToCache));
    }

    return response;
  },
};

async function forwardToVercel(request) {
  const url = new URL(request.url);
  url.hostname = CONFIG.VERCEL_DOMAIN;

  const modifiedRequest = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  return fetch(modifiedRequest);
}

function getCacheConfig(pathname) {
  // 精确匹配
  if (CONFIG.CACHE_SETTINGS[pathname]) {
    return CONFIG.CACHE_SETTINGS[pathname];
  }

  // 模式匹配
  for (const [pattern, config] of Object.entries(CONFIG.CACHE_SETTINGS)) {
    if (pathname.startsWith(pattern)) {
      return config;
    }
  }

  return null;
}

function getCacheAge(response) {
  const cachedAt = response.headers.get('CF-Cached-At');
  if (!cachedAt) return Infinity;

  return (Date.now() - new Date(cachedAt).getTime()) / 1000;
}

async function refreshCache(cacheKey, originalRequest, cacheConfig) {
  try {
    const response = await forwardToVercel(originalRequest);

    if (response.ok) {
      const responseToCache = response.clone();
      responseToCache.headers.set('CF-Cache-Status', 'REFRESH');
      responseToCache.headers.set('Cache-Control', `public, max-age=${cacheConfig.ttl}, stale-while-revalidate=${cacheConfig.staleWhileRevalidate}`);
      responseToCache.headers.set('CF-Cached-At', new Date().toISOString());

      await caches.default.put(cacheKey, responseToCache);
    }
  } catch (error) {
    console.error('Cache refresh failed:', error);
  }
}
