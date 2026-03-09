import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/contexts/CompanyContext";
import { PLATFORMS } from "@/lib/platforms";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link2, Maximize2 } from "lucide-react";
import PlatformCard from "@/components/social/PlatformCard";
import ConnectPlatformModal from "@/components/social/ConnectPlatformModal";
import PostComposerModal from "@/components/social/PostComposerModal";
import ContentPreview from "@/components/social/ContentPreview";
import MockupViewerModal from "@/components/mockups/MockupViewerModal";
import type { PlatformInfo } from "@/lib/platforms";

interface Connection {
  id: string;
  platform: string;
  username: string | null;
  is_active: boolean;
  connected_at: string;
  company_id: string;
}

const SocialMediaPage = () => {
  const { selectedCompany } = useCompany();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectModal, setConnectModal] = useState<PlatformInfo | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerPlatform, setComposerPlatform] = useState<string | undefined>();
  const [composerFile, setComposerFile] = useState<File | null>(null);
  const [mockupViewerOpen, setMockupViewerOpen] = useState(false);

  const fetchConnections = useCallback(async () => {
    if (!selectedCompany) return;
    setLoading(true);
    const { data } = await supabase.from("social_connections").select("*").eq("company_id", selectedCompany.id);
    setConnections((data as Connection[]) || []);
    setLoading(false);
  }, [selectedCompany]);

  useEffect(() => { fetchConnections(); }, [fetchConnections]);

  const handleDisconnect = async (connectionId: string) => {
    const { error } = await supabase.from("social_connections").delete().eq("id", connectionId);
    if (error) toast.error("Failed to disconnect");
    else { toast.success("Disconnected"); fetchConnections(); }
  };

  const getConnection = (platformKey: string) => connections.find((c) => c.platform === platformKey && c.is_active);
  const connectedCount = PLATFORMS.filter((p) => getConnection(p.dbKey)).length;
  const notConnectedCount = PLATFORMS.length - connectedCount;

  const openComposer = (platform?: string, file?: File | null) => {
    setComposerPlatform(platform);
    setComposerFile(file || null);
    setComposerOpen(true);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-display font-bold text-foreground">Social Media</h1>
          {selectedCompany && <p className="text-sm text-muted-foreground">{selectedCompany.name}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {[
              { label: `${PLATFORMS.length} Platforms`, cls: "text-muted-foreground" },
              { label: `${connectedCount} Connected`, cls: "text-success" },
              { label: `${notConnectedCount} Not Connected`, cls: "text-muted-foreground" },
            ].map((s) => (
              <span key={s.label} className={`card-glass px-3 py-1.5 text-xs font-medium ${s.cls}`}>{s.label}</span>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => setMockupViewerOpen(true)}><Maximize2 className="mr-1.5 h-4 w-4" /> Preview Mockups</Button>
          <Button variant="outline" size="sm"><Link2 className="mr-1.5 h-4 w-4" /> Connect All</Button>
        </div>
      </div>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PLATFORMS.map((platform) => {
          const conn = getConnection(platform.dbKey);
          return (
            <PlatformCard
              key={platform.key}
              platform={platform}
              connection={conn || null}
              onConnect={() => setConnectModal(platform)}
              onDisconnect={() => conn && handleDisconnect(conn.id)}
              onNewPost={() => openComposer(platform.key)}
            />
          );
        })}
      </div>

      {/* Content Preview */}
      <ContentPreview onUseContent={(file) => openComposer(undefined, file)} />

      {/* Modals */}
      <ConnectPlatformModal open={!!connectModal} onOpenChange={(open) => !open && setConnectModal(null)} platform={connectModal} onConnected={fetchConnections} />
      <PostComposerModal open={composerOpen} onOpenChange={setComposerOpen} initialPlatform={composerPlatform} initialFile={composerFile} />
      <MockupViewerModal open={mockupViewerOpen} onOpenChange={setMockupViewerOpen} />
    </div>
  );
};

export default SocialMediaPage;
