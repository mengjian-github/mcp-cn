'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

// 生成构建时间戳
const BUILD_TIME = process.env.NODE_ENV === 'production' ? Date.now() : 0;

export default function VersionChecker() {
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    // 检查是否有新版本
    const checkForUpdates = async () => {
      try {
        // 定期检查是否有新版本
        const response = await fetch('/api/version', {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const serverBuildTime = data.buildTime;

          // 如果服务器构建时间比本地构建时间新，说明有更新
          if (serverBuildTime > BUILD_TIME) {
            setHasUpdate(true);
            showUpdateNotification();
          }
        }
      } catch (error) {
        console.log('版本检查失败:', error);
      }
    };

    // 立即检查一次
    if (BUILD_TIME > 0) {
      checkForUpdates();
    }

    // 每 5 分钟检查一次
    const interval = setInterval(checkForUpdates, 5 * 60 * 1000);

    // 监听 Service Worker 的更新事件
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setHasUpdate(true);
        showUpdateNotification();
      });
    }

    return () => clearInterval(interval);
  }, []);

  const showUpdateNotification = () => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <div className="font-medium">🎉 发现新版本！</div>
        <div className="text-sm text-gray-600">
          点击刷新按钮获取最新功能和修复
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              // 清除所有缓存
              if ('caches' in window) {
                caches.keys().then(names => {
                  names.forEach(name => caches.delete(name));
                });
              }

              // 清除 Service Worker 缓存
              if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                const messageChannel = new MessageChannel();
                messageChannel.port1.onmessage = () => {
                  window.location.reload();
                };
                navigator.serviceWorker.controller.postMessage(
                  { type: 'CLEAR_CACHE' },
                  [messageChannel.port2]
                );
              } else {
                window.location.reload();
              }
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            刷新页面
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            稍后再说
          </button>
        </div>
      </div>
    ), {
      duration: 0, // 不自动消失
      position: 'top-center',
    });
  };

  return null; // 这个组件不渲染任何内容
}
