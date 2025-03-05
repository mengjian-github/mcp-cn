import { 
  CloudIcon, 
  CodeIcon, 
  GlobeIcon, 
  LightningBoltIcon, 
  LockClosedIcon, 
  ServerIcon 
} from "@/components/ui/icons";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="group relative rounded-lg border p-6 hover:shadow-md transition-all">
      <div className="absolute -inset-px z-0 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-medium">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          为什么选择MCP中国生态
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          我们提供全面的解决方案，帮助开发者轻松构建与中国本土平台集成的智能应用
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Feature
          icon={<ServerIcon className="h-5 w-5" />}
          title="丰富的服务器集合"
          description="提供20+中国本土平台的MCP服务器，包括飞书、企业微信、钉钉等主流平台"
        />
        <Feature
          icon={<CodeIcon className="h-5 w-5" />}
          title="简单易用的API"
          description="统一的API设计，降低学习成本，让开发者可以快速上手不同平台的集成"
        />
        <Feature
          icon={<LightningBoltIcon className="h-5 w-5" />}
          title="高性能架构"
          description="优化的性能设计，确保在高并发场景下依然保持稳定的响应速度"
        />
        <Feature
          icon={<CloudIcon className="h-5 w-5" />}
          title="云原生支持"
          description="完全兼容云原生环境，支持容器化部署和Kubernetes集成"
        />
        <Feature
          icon={<LockClosedIcon className="h-5 w-5" />}
          title="安全可靠"
          description="内置安全机制，保护敏感数据，符合国内数据安全和隐私保护要求"
        />
        <Feature
          icon={<GlobeIcon className="h-5 w-5" />}
          title="本地化支持"
          description="针对中国市场优化，提供完善的中文文档和技术支持"
        />
      </div>
    </div>
  );
} 