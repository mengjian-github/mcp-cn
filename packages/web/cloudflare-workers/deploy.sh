#!/bin/bash

# Cloudflare Worker 部署脚本
# 用于部署API缓存Worker来减少Vercel Function调用

echo "🚀 开始部署 Cloudflare Worker..."

# 检查是否安装了 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ 未检测到 wrangler CLI，正在安装..."
    npm install -g wrangler
fi

# 检查是否已登录 Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "🔐 请先登录 Cloudflare..."
    wrangler login
fi

# 部署到开发环境
echo "📦 部署到开发环境..."
wrangler deploy --env development

# 部署到生产环境
echo "🌟 部署到生产环境..."
wrangler deploy --env production

echo "✅ Cloudflare Worker 部署完成！"
echo ""
echo "📋 接下来的步骤："
echo "1. 在 Cloudflare Dashboard 中配置自定义域名"
echo "2. 更新 wrangler.toml 中的 VERCEL_DOMAIN"
echo "3. 测试 API 缓存是否正常工作"
echo "4. 监控 Vercel Function 调用次数的减少情况"
echo ""
echo "🔍 监控工具:"
echo "- Cloudflare Analytics: https://dash.cloudflare.com"
echo "- Vercel Analytics: https://vercel.com/dashboard"

# 显示部署的Worker URL
echo ""
echo "🌐 Worker URLs:"
wrangler deployments list --env production | head -5
