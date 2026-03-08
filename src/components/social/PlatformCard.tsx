import { useState, useEffect } from "react";
import { Edit2, Check, X, Unlink, Plus, Eye, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PlatformInfo } from "@/lib/platforms";

interface Connection {
  id: string;
  platform: string;
  username: string | null;
  is_active: boolean;
  connected_at: string;
}

interface PlatformCardProps {
  platform: PlatformInfo;
  connection: Connection | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onNewPost: () => void;
}

const PlatformCard = ({ platform, connection, onConnect, onDisconnect, onNewPost }: PlatformCardProps) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const isConnected = !!connection && connection.is_active;

  const handleSaveUsername = async () => {
    if (!connection || !editValue.trim()) return;
    const { error } = await supabase
      .from("social_connections")
      .update({ username: editValue.trim() })
      .eq("id", connection.id);
    if (error) toast.error("Failed to update");
    else toast.success("Username updated");
    setEditing(false);
  };

  const mockFollowers = isConnected ? `${(Math.random() * 50 + 1).toFixed(1)}K` : null;
  const mockLastPost = isConnected ? "2 days ago" : null;

  return (
    <div className="group rounded-lg border bg-card p-5 card-shadow transition-all hover:card-shadow-hover">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${platform.color}15` }}
          >
            <platform.icon className="h-5 w-5" style={{ color: platform.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{platform.name}</h3>
            {isConnected ? (
              <Badge variant="outline" className="mt-0.5 border-success/30 bg-success/10 text-success text-xs">
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="mt-0.5 text-xs text-muted-foreground">
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                Not Connected
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Username / Handle */}
      {isConnected && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            {editing ? (
              <div className="flex flex-1 items-center gap-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                />
                <button onClick={handleSaveUsername} className="rounded p-1 hover:bg-muted">
                  <Check className="h-4 w-4 text-success" />
                </button>
                <button onClick={() => setEditing(false)} className="rounded p-1 hover:bg-muted">
                  <X className="h-4 w-4 text-destructive" />
                </button>
              </div>
            ) : (
              <div className="flex flex-1 items-center gap-2">
                <span className="text-sm font-medium text-card-foreground">@{connection.username}</span>
                <button
                  onClick={() => {
                    setEditValue(connection.username || "");
                    setEditing(true);
                  }}
                  className="rounded p-1 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
                >
                  <Edit2 className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{mockFollowers} followers</span>
            <span>Last post: {mockLastPost}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4">
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={onNewPost}>
                <Plus className="mr-1 h-3 w-3" /> New Post
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <Eye className="mr-1 h-3 w-3" /> View Feed
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <BarChart3 className="mr-1 h-3 w-3" /> Analytics
              </Button>
            </div>
            <button
              onClick={onDisconnect}
              className="text-xs text-destructive hover:underline"
            >
              <Unlink className="mr-1 inline h-3 w-3" /> Disconnect
            </button>
          </div>
        ) : (
          <Button onClick={onConnect} size="sm" className="w-full">
            Connect Account
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlatformCard;
