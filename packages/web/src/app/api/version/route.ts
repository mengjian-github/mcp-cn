import { NextResponse } from 'next/server';

// 在构建时生成版本信息
const BUILD_TIME = Date.now();
const VERSION = process.env.npm_package_version || '1.0.0';

export async function GET() {
  return NextResponse.json({
    version: VERSION,
    buildTime: BUILD_TIME,
    timestamp: Date.now()
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
