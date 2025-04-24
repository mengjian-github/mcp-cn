// @ts-check
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx", "ts", "jsx", "js", "md", "mdx"],
  turbopack: {
    rules: {
      '**/*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/mcp_api/:path*",
        destination: "http://localhost:3000/mcp_api/:path*",
      },
    ];
  },
};

export default withMDX(nextConfig);
