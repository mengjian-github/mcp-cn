import { MCPServer } from "@/types/mcp";
import { categories } from "./categories";
import { tags } from "./tags";

export const servers: MCPServer[] = [
  {
    id: "feishu",
    name: "飞书",
    description: "飞书MCP服务器，提供消息发送、文档读取、日历管理等功能",
    downloads: 5550,
    author: "mcp-cn",
    authorUrl: "https://github.com/mcp-cn",
    githubUrl: "https://github.com/mcp-cn/feishu-mcp",
    tags: [
      tags.find(tag => tag.id === "message") || tags[0],
      tags.find(tag => tag.id === "document") || tags[1],
      tags.find(tag => tag.id === "calendar") || tags[2],
      tags.find(tag => tag.id === "enterprise") || tags[3]
    ],
    category: categories.find(category => category.id === "enterprise") || categories[0],
    logo: "/logos/feishu.svg",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-05"
  },
  {
    id: "wechat-work",
    name: "企业微信",
    description: "企业微信MCP服务器，提供企业内部沟通、应用集成等功能",
    downloads: 4320,
    author: "mcp-cn",
    authorUrl: "https://github.com/mcp-cn",
    githubUrl: "https://github.com/mcp-cn/wechat-work-mcp",
    tags: [
      tags.find(tag => tag.id === "message") || tags[0],
      tags.find(tag => tag.id === "enterprise") || tags[3]
    ],
    category: categories.find(category => category.id === "enterprise") || categories[0],
    logo: "/logos/wechat-work.svg",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-04"
  },
  {
    id: "dingtalk",
    name: "钉钉",
    description: "钉钉MCP服务器，提供企业通讯、工作流、考勤等功能",
    downloads: 3890,
    author: "mcp-cn",
    authorUrl: "https://github.com/mcp-cn",
    githubUrl: "https://github.com/mcp-cn/dingtalk-mcp",
    tags: [
      tags.find(tag => tag.id === "message") || tags[0],
      tags.find(tag => tag.id === "workflow") || tags[4],
      tags.find(tag => tag.id === "enterprise") || tags[3]
    ],
    category: categories.find(category => category.id === "enterprise") || categories[0],
    logo: "/logos/dingtalk.svg",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-03"
  },
  {
    id: "taobao",
    name: "淘宝",
    description: "淘宝MCP服务器，提供商品搜索、订单管理、物流跟踪等功能",
    downloads: 6780,
    author: "mcp-cn",
    authorUrl: "https://github.com/mcp-cn",
    githubUrl: "https://github.com/mcp-cn/taobao-mcp",
    tags: [
      tags.find(tag => tag.id === "ecommerce") || tags[5],
      tags.find(tag => tag.id === "search") || tags[6],
      tags.find(tag => tag.id === "order") || tags[7]
    ],
    category: categories.find(category => category.id === "ecommerce") || categories[1],
    logo: "/logos/taobao.svg",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-05"
  },
  {
    id: "jd",
    name: "京东",
    description: "京东MCP服务器，提供商品信息、订单处理、售后服务等功能",
    downloads: 5430,
    author: "mcp-cn",
    authorUrl: "https://github.com/mcp-cn",
    githubUrl: "https://github.com/mcp-cn/jd-mcp",
    tags: [
      tags.find(tag => tag.id === "ecommerce") || tags[5],
      tags.find(tag => tag.id === "order") || tags[7],
      tags.find(tag => tag.id === "logistics") || tags[8]
    ],
    category: categories.find(category => category.id === "ecommerce") || categories[1],
    logo: "/logos/jd.svg",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-04"
  },
  {
    id: "douyin",
    name: "抖音",
    description: "抖音MCP服务器，提供视频内容获取、互动功能、直播功能等",
    downloads: 8920,
    author: "mcp-cn",
    authorUrl: "https://github.com/mcp-cn",
    githubUrl: "https://github.com/mcp-cn/douyin-mcp",
    tags: [
      tags.find(tag => tag.id === "video") || tags[9],
      tags.find(tag => tag.id === "social") || tags[10],
      tags.find(tag => tag.id === "live") || tags[11]
    ],
    category: categories.find(category => category.id === "social") || categories[2],
    logo: "/logos/douyin.svg",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-05"
  },
  {
    id: "dianping",
    name: "大众点评",
    description: "大众点评MCP服务器，提供餐厅搜索、评价查询、预订服务等功能",
    downloads: 4120,
    author: "mcp-cn",
    authorUrl: "https://github.com/mcp-cn",
    githubUrl: "https://github.com/mcp-cn/dianping-mcp",
    tags: [
      tags.find(tag => tag.id === "search") || tags[6],
      tags.find(tag => tag.id === "review") || tags[12],
      tags.find(tag => tag.id === "booking") || tags[13]
    ],
    category: categories.find(category => category.id === "lifestyle") || categories[3],
    logo: "/logos/dianping.svg",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-03"
  }
]; 