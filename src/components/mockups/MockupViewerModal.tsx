import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Copy, Grid3X3, Maximize2, Upload, Calendar, Send, X } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";

import InstagramFeedMockup from "./InstagramFeedMockup";
import InstagramStoryMockup from "./InstagramStoryMockup";
import InstagramReelMockup from "./InstagramReelMockup";
import FacebookMockup from "./FacebookMockup";
import YouTubeMockup from "./YouTubeMockup";
import TikTokMockup from "./TikTokMockup";
import LinkedInMockup from "./LinkedInMockup";
import TwitterMockup from "./TwitterMockup";
import { MOCKUP_CONFIGS, type MockupProps } from "./types";

interface MockupViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialImage?: string | null;
  initialCaption?: string;
}

const MOCKUP_COMPONENTS: Record<string, React.ComponentType<MockupProps>> = {
  "instagram-feed": InstagramFeedMockup,
  "instagram-story": InstagramStoryMockup,
  "instagram-reel": InstagramReelMockup,
  "facebook": FacebookMockup,
  "youtube": YouTubeMockup,
  "tiktok": TikTokMockup,
  "linkedin": LinkedInMockup,
  "twitter": TwitterMockup,
};

const PLATFORM_ICONS: Record<string, string> = {
  "instagram-feed": "📸",
  "instagram-story": "📱",
  "instagram-reel": "🎬",
  "facebook": "👤",
  "youtube": "▶️",
  "tiktok": "🎵",
  "linkedin": "💼",
  "twitter": "𝕏",
};

const MockupViewerModal = ({ open, onOpenChange, initialImage, initialCaption }: MockupViewerModalProps) => {
  const [selectedMockup, setSelectedMockup] = useState("instagram-feed");
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
  const [caption, setCaption] = useState(initialCaption || "");
  const [username, setUsername] = useState("yourcompany");
  const [hashtags, setHashtags] = useState("");
  const [batchView, setBatchView] = useState(false);
  const mockupRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleDownload = async (ref?: HTMLDivElement | null) => {
    const node = ref || mockupRef.current;
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `mockup-${selectedMockup}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Mockup downloaded!");
    } catch {
      toast.error("Failed to download mockup");
    }
  };

  const copyDimensions = (config: typeof MOCKUP_CONFIGS[0]) => {
    navigator.clipboard.writeText(`${config.width}x${config.height}`);
    toast.success(`Copied: ${config.dimensions}`);
  };

  const config = MOCKUP_CONFIGS.find((c) => c.key === selectedMockup)!;
  const ActiveMockup = MOCKUP_COMPONENTS[selectedMockup];
  const mockupProps: MockupProps = { imageUrl, caption: `${caption}${hashtags ? " " + hashtags : ""}`, username, hashtags };

  const charLimits: Record<string, number> = {
    "instagram-feed": 2200, "instagram-story": 2200, "instagram-reel": 2200,
    "facebook": 63206, "youtube": 5000, "tiktok": 2200, "linkedin": 3000, "twitter": 280,
  };
  const charLimit = charLimits[selectedMockup] || 2200;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel */}
          <div className="w-[30%] min-w-[280px] border-r flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Mockup Previewer</h2>
              <button onClick={() => onOpenChange(false)} className="rounded-md p-1 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Media</Label>
                  {imageUrl ? (
                    <div className="relative">
                      <img src={imageUrl} alt="" className="w-full rounded-lg object-cover" style={{ maxHeight: 120 }} />
                      <button
                        onClick={() => setImageUrl(null)}
                        className="absolute right-1 top-1 rounded-full bg-foreground/60 p-0.5"
                      >
                        <X className="h-3 w-3 text-card" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-xs text-muted-foreground hover:border-primary/40 transition-colors"
                    >
                      <Upload className="h-4 w-4" /> Upload Image/Video
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Username</Label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} className="h-8 text-sm" placeholder="@yourcompany" />
                </div>

                {/* Caption */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Caption</Label>
                    <span className={`text-[10px] ${caption.length > charLimit ? "text-destructive" : "text-muted-foreground"}`}>
                      {caption.length}/{charLimit}
                    </span>
                  </div>
                  <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write your caption…" rows={4} className="text-sm" />
                </div>

                {/* Hashtags */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Hashtags</Label>
                  <Input value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="h-8 text-sm" placeholder="#marketing #social" />
                </div>

                {/* Platform Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Platform</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {MOCKUP_CONFIGS.map((cfg) => (
                      <button
                        key={cfg.key}
                        onClick={() => { setSelectedMockup(cfg.key); setBatchView(false); }}
                        className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                          selectedMockup === cfg.key && !batchView
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <span>{PLATFORM_ICONS[cfg.key]}</span>
                        {cfg.name.replace("Instagram ", "IG ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Bottom buttons */}
            <div className="space-y-2 border-t p-4">
              <Button className="w-full" size="sm">
                <Send className="mr-1.5 h-3.5 w-3.5" /> Post Now
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <Calendar className="mr-1.5 h-3.5 w-3.5" /> Schedule
              </Button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <div className="flex items-center gap-2">
                {MOCKUP_CONFIGS.map((cfg) => (
                  <button
                    key={cfg.key}
                    onClick={() => { setSelectedMockup(cfg.key); setBatchView(false); }}
                    className={`rounded-md p-1.5 text-sm transition-colors ${
                      selectedMockup === cfg.key && !batchView ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                    }`}
                    title={cfg.name}
                  >
                    {PLATFORM_ICONS[cfg.key]}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={batchView ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBatchView(!batchView)}
                >
                  <Grid3X3 className="mr-1.5 h-3.5 w-3.5" /> {batchView ? "Single View" : "See All Platforms"}
                </Button>
                {!batchView && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => copyDimensions(config)}>
                      <Copy className="mr-1.5 h-3.5 w-3.5" /> {config.dimensions}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload()}>
                      <Download className="mr-1.5 h-3.5 w-3.5" /> Download PNG
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mockup Display */}
            <ScrollArea className="flex-1 p-6">
              {batchView ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {MOCKUP_CONFIGS.map((cfg) => {
                    const MockupComp = MOCKUP_COMPONENTS[cfg.key];
                    return (
                      <div key={cfg.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-foreground">{PLATFORM_ICONS[cfg.key]} {cfg.name}</span>
                          <span className="text-[10px] text-muted-foreground">{cfg.dimensions}</span>
                        </div>
                        <div className="transform scale-[0.65] origin-top-left" style={{ width: "153%", height: 0, paddingBottom: "153%" }}>
                          <div className="absolute">
                            <MockupComp {...mockupProps} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-center">
                  <div ref={mockupRef}>
                    <ActiveMockup {...mockupProps} />
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MockupViewerModal;
