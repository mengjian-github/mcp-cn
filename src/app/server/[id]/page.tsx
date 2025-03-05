import { notFound } from "next/navigation";
import { ServerDetail } from "@/components/server/server-detail";
import { servers } from "@/data/servers";

interface ServerPageProps {
  params: {
    id: string;
  };
}

export default function ServerPage({ params }: ServerPageProps) {
  const server = servers.find((s) => s.id === params.id);

  if (!server) {
    notFound();
  }

  return <ServerDetail server={server} />;
}

export function generateStaticParams() {
  return servers.map((server) => ({
    id: server.id,
  }));
} 