import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/contexts/CompanyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Search, Upload, Grid3X3, List, Download, Trash2, Send, Eye,
  Image, Video, Music, User, X, Copy, Clock, FileType
} from "lucide-react";

interface MediaAsset {
  id: string;
  company_id: string;
  type: string;
  url: string;
  prompt: string | null;
  platform_preset: string | null;
  style: string | null;
  metadata: any;
  created_at: string;
}

const TYPE_FILTERS = [
  { label: "All", value: "all", icon: Grid3X3 },
  { label: "Images", value: "image", icon: Image },
  { label: "Videos", value: "video", icon: Video },
  { label: "Audio", value: "audio", icon: Music },
  { label: "Avatars", value: "avatar", icon: User },
];

const PLATFORM_OPTIONS = ["All Platforms", "Instagram", "Facebook", "YouTube", "TikTok", "LinkedIn", "X"];

const MediaPage = () => {
  const { selectedCompany } = useCompany();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("All Platforms");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchAssets = useCallback(async () => {
    if (!selectedCompany) return;
    setLoading(true);
    let query = supabase
      .from("media_assets")
      .select("*")
      .eq("company_id", selectedCompany.id)
      .order("created_at", { ascending: false });

    if (typeFilter !== "all") query = query.eq("type", typeFilter);
    if (search) query = query.or(`prompt.ilike.%${search}%,url.ilike.%${search}%`);

    const { data } = await query;
    setAssets((data as MediaAsset[]) || []);
    setLoading(false);
  }, [selectedCompany, typeFilter, search]);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !selectedCompany) return;
    setUploading(true);
    for (const file of Array.from(files).slice(0, 20)) {
      const ext = file.name.split(".").pop();
      const path = `${selectedCompany.id}/uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media-library").upload(path, file);
      if (uploadError) { toast.error(`Failed to upload ${file.name}`); continue; }
      const { data: urlData } = supabase.storage.from("media-library").getPublicUrl(path);
      const type = file.type.startsWith("video") ? "video" : file.type.startsWith("audio") ? "audio" : "image";
      await supabase.from("media_assets").insert({
        company_id: selectedCompany.id, type, url: urlData.publicUrl,
        metadata: { fileName: file.name, size: file.size, mimeType: file.type }
      });
    }
    toast.success("Upload complete");
    setUploading(false);
    setUploadModalOpen(false);
    fetchAssets();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("media_assets").delete().eq("id", id);
    toast.success("Deleted");
    setSelectedAsset(null);
    fetchAssets();
  };

  const bulkDelete = async () => {
    for (const id of selectedIds) {
      await supabase.from("media_assets").delete().eq("id", id);
    }
    toast.success(`Deleted ${selectedIds.size} assets`);
    setSelectedIds(new Set());
    fetchAssets();
  };

  const filtered = assets.filter((a) => {
    if (platformFilter !== "All Platforms" && a.platform_preset?.toLowerCase() !== platformFilter.toLowerCase()) return false;
    return true;
  });

  const getFileName = (asset: MediaAsset) =>
    (asset.metadata as any)?.fileName || asset.url.split("/").pop() || "Untitled";

  const getTypeIcon = (type: string) => {
    if (type === "video") return <Video className="h-4 w-4" />;
    if (type === "audio") return <Music className="h-4 w-4" />;
    if (type === "avatar") return <User className="h-4 w-4" />;
    return <Image className="h-4 w-4" />;
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
        {selectedCompany && <p className="text-sm text-muted-foreground">{selectedCompany.name}</p>}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by filename, prompt, or date..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="flex gap-1">
          {TYPE_FILTERS.map((f) => (
            <Button key={f.value} size="sm" variant={typeFilter === f.value ? "default" : "outline"} onClick={() => setTypeFilter(f.value)}>
              <f.icon className="mr-1 h-3.5 w-3.5" /> {f.label}
            </Button>
          ))}
        </div>

        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
        >
          {PLATFORM_OPTIONS.map((p) => <option key={p}>{p}</option>)}
        </select>

        <div className="flex gap-1 rounded-md border border-input p-0.5">
          <Button size="icon" variant={viewMode === "grid" ? "default" : "ghost"} className="h-8 w-8" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant={viewMode === "list" ? "default" : "ghost"} className="h-8 w-8" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={() => setUploadModalOpen(true)}>
          <Upload className="mr-1.5 h-4 w-4" /> Upload Assets
        </Button>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-3">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <Button size="sm" variant="destructive" onClick={bulkDelete}><Trash2 className="mr-1 h-3.5 w-3.5" /> Delete</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>Clear Selection</Button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Image className="mb-3 h-12 w-12 opacity-40" />
              <p className="font-medium">No media assets yet</p>
              <p className="text-sm">Upload files or generate content in AI Studio</p>
            </div>
          ) : (
            filtered.map((asset) => (
              <div
                key={asset.id}
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:card-shadow-hover"
                onClick={() => setSelectedAsset(asset)}
              >
                {/* Select checkbox */}
                <div
                  className="absolute left-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIds((prev) => {
                      const next = new Set(prev);
                      next.has(asset.id) ? next.delete(asset.id) : next.add(asset.id);
                      return next;
                    });
                  }}
                >
                  <div className={`h-5 w-5 rounded border-2 flex items-center justify-center text-xs ${selectedIds.has(asset.id) ? "bg-primary border-primary text-primary-foreground" : "border-white bg-black/30 text-white"}`}>
                    {selectedIds.has(asset.id) && "✓"}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="aspect-square bg-muted">
                  {asset.type === "image" || asset.type === "avatar" ? (
                    <img src={asset.url} alt="" className="h-full w-full object-cover" />
                  ) : asset.type === "video" ? (
                    <div className="flex h-full items-center justify-center bg-foreground/5">
                      <Video className="h-10 w-10 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-foreground/5">
                      <Music className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="truncate text-xs font-medium text-foreground">{getFileName(asset)}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    {getTypeIcon(asset.type)}
                    <span className="text-[10px] text-muted-foreground capitalize">{asset.type}</span>
                    {asset.platform_preset && (
                      <Badge variant="secondary" className="h-4 text-[10px] px-1">{asset.platform_preset}</Badge>
                    )}
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={(e) => { e.stopPropagation(); window.open(asset.url, "_blank"); }}>
                    <Download className="mr-1 h-3 w-3" /> Download
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Preview</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((asset) => (
                <TableRow key={asset.id} className="cursor-pointer" onClick={() => setSelectedAsset(asset)}>
                  <TableCell>
                    <div className="h-10 w-10 overflow-hidden rounded bg-muted">
                      {asset.type === "image" ? (
                        <img src={asset.url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">{getTypeIcon(asset.type)}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{getFileName(asset)}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{asset.type}</Badge></TableCell>
                  <TableCell>{asset.platform_preset || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(asset.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Assets</DialogTitle></DialogHeader>
          <label className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-10 cursor-pointer hover:border-primary/50 transition-colors">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">Drag & drop files or click to browse</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, MP4, MOV, MP3, WAV — up to 20 files</p>
            <input type="file" className="hidden" multiple accept="image/*,video/*,audio/*" onChange={(e) => handleUpload(e.target.files)} />
          </label>
          {uploading && <div className="flex items-center justify-center gap-2 py-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-sm">Uploading...</span></div>}
        </DialogContent>
      </Dialog>

      {/* Asset Detail Modal */}
      <Dialog open={!!selectedAsset} onOpenChange={(o) => !o && setSelectedAsset(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Asset Details</DialogTitle></DialogHeader>
          {selectedAsset && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Preview */}
              <div className="flex items-center justify-center rounded-lg bg-muted p-4">
                {selectedAsset.type === "image" || selectedAsset.type === "avatar" ? (
                  <img src={selectedAsset.url} alt="" className="max-h-80 rounded object-contain" />
                ) : selectedAsset.type === "video" ? (
                  <video src={selectedAsset.url} controls className="max-h-80 rounded" />
                ) : (
                  <audio src={selectedAsset.url} controls className="w-full" />
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Filename</p>
                  <p className="font-medium">{getFileName(selectedAsset)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <Badge variant="outline" className="capitalize mt-1">{selectedAsset.type}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Platform</p>
                    <p className="text-sm">{selectedAsset.platform_preset || "None"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Style</p>
                    <p className="text-sm">{selectedAsset.style || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm">{new Date(selectedAsset.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {selectedAsset.prompt && (
                  <div>
                    <p className="text-xs text-muted-foreground">AI Prompt</p>
                    <div className="mt-1 flex items-start gap-2 rounded-md bg-muted p-2">
                      <p className="flex-1 text-sm">{selectedAsset.prompt}</p>
                      <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => { navigator.clipboard.writeText(selectedAsset.prompt!); toast.success("Prompt copied"); }}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => window.open(selectedAsset.url, "_blank")}><Download className="mr-1 h-3.5 w-3.5" /> Download</Button>
                  <Button size="sm" variant="outline"><Send className="mr-1 h-3.5 w-3.5" /> Use for Post</Button>
                  <Button size="sm" variant="outline"><Eye className="mr-1 h-3.5 w-3.5" /> Preview Mockups</Button>
                </div>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(selectedAsset.id)}>
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete Asset
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaPage;
