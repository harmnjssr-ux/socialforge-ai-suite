import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import type { PlatformInfo } from "@/lib/platforms";
import type { Database } from "@/integrations/supabase/types";

type SocialPlatform = Database["public"]["Enums"]["social_platform"];

interface ConnectPlatformModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: PlatformInfo | null;
  onConnected: () => void;
}

const ConnectPlatformModal = ({ open, onOpenChange, platform, onConnected }: ConnectPlatformModalProps) => {
  const { selectedCompany } = useCompany();
  const [username, setUsername] = useState("");
  const [isBusiness, setIsBusiness] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!platform) return null;

  const handleConnect = async () => {
    if (!selectedCompany || !username.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("social_connections").insert({
      company_id: selectedCompany.id,
      platform: platform.dbKey as SocialPlatform,
      username: username.trim(),
      is_active: true,
      profile_url: `https://${platform.key}.com/${username.trim()}`,
    });

    setLoading(false);
    if (error) {
      toast.error("Failed to connect account");
    } else {
      toast.success(`${platform.name} connected!`);
      setUsername("");
      setIsBusiness(false);
      onOpenChange(false);
      onConnected();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${platform.color}15` }}>
              <platform.icon className="h-4 w-4" style={{ color: platform.color }} />
            </div>
            Connect {platform.name}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          You will be redirected to {platform.name} to authorize SocialForge AI. For now, enter your account details below.
        </p>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Enter your {platform.name} username/handle</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={`@your${platform.key}handle`}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="business-toggle" className="cursor-pointer text-sm">
              This is a Business/Creator account
            </Label>
            <Switch id="business-toggle" checked={isBusiness} onCheckedChange={setIsBusiness} />
          </div>
          <Button onClick={handleConnect} disabled={loading || !username.trim()} className="w-full">
            {loading ? "Connecting…" : "Connect Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectPlatformModal;
