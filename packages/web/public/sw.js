// Service Worker - 处理缓存策略和错误恢复
const CACHE_NAME = 'mcp-cn-v1';
const STATIC_CACHE_NAME = 'mcp-cn-static-v1';

// 需要预缓存的核心资源
const CORE_ASSETS = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', event => {
  console.log('SW: Installing service worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('SW: Activating service worker');
  event.waitUntil(
    // 清理旧缓存
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }

  // 静态资源缓存策略
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            return response;
          }

          return fetch(request).then(fetchResponse => {
            // 只缓存成功的响应
            if (fetchResponse.ok) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          }).catch(error => {
            console.warn('SW: 静态资源加载失败', request.url, error);

            // 尝试从缓存中获取类似的资源（版本回退）
            if (url.pathname.includes('chunks/')) {
              const chunkPattern = url.pathname.match(/chunks\/(\d+)-[a-f0-9]+\.js$/);
              if (chunkPattern) {
                const chunkId = chunkPattern[1];
                return caches.open(STATIC_CACHE_NAME).then(cache => {
                  return cache.keys().then(keys => {
                    // 查找同一个 chunk 的其他版本
                    const fallbackKey = keys.find(key => {
                      const keyUrl = new URL(key.url);
                      return keyUrl.pathname.includes(`chunks/${chunkId}-`) &&
                             keyUrl.pathname.endsWith('.js');
                    });

                    if (fallbackKey) {
                      console.log('SW: 使用回退资源', fallbackKey.url);
                      return cache.match(fallbackKey);
                    }

                    throw error;
                  });
                });
              }
            }

            throw error;
          });
        });
      })
    );
    return;
  }

  // HTML 页面缓存策略 - 网络优先，失败时使用缓存
  if (request.mode === 'navigate' ||
      (request.method === 'GET' && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // 网络失败时使用缓存
        return caches.match(request).then(response => {
          return response || caches.match('/');
        });
      })
    );
    return;
  }

  // API 请求不缓存
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 其他资源使用默认策略
});

// 监听消息，支持手动清除缓存
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});
