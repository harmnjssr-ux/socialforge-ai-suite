import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Hash, Heart, MessageCircle, Send, ThumbsUp, Share2, Music2, Image as ImageIcon, Video } from "lucide-react";
import { PLATFORMS, type PlatformInfo } from "@/lib/platforms";

interface PostComposerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlatform?: string;
  initialFile?: File | null;
}

const PostComposerModal = ({ open, onOpenChange, initialPlatform, initialFile }: PostComposerModalProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialPlatform ? [initialPlatform] : []);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  useEffect(() => {
    if (initialPlatform && !selectedPlatforms.includes(initialPlatform)) {
      setSelectedPlatforms([initialPlatform]);
    }
  }, [initialPlatform]);

  useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
      setPreview(URL.createObjectURL(initialFile));
    }
  }, [initialFile]);

  const handleFileChange = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const togglePlatform = (key: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const activePlatform = PLATFORMS.find((p) => p.key === selectedPlatforms[0]);
  const charLimit = activePlatform?.charLimit || 2200;
  const remaining = charLimit - caption.length;

  const suggestedHashtags = ["#socialmedia", "#marketing", "#content", "#digital", "#growth", "#brand"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        {/* Platform Tabs */}
        <div className="flex flex-wrap gap-2 border-b pb-3">
          {PLATFORMS.map((p) => (
            <button
              key={p.key}
              onClick={() => togglePlatform(p.key)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedPlatforms.includes(p.key)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <p.icon className="h-3.5 w-3.5" />
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Editor */}
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Media</Label>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="" className="max-h-48 w-full rounded-lg object-cover" />
                  <button
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute right-2 top-2 rounded-full bg-foreground/60 p-1 text-card hover:bg-foreground/80"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-sm text-muted-foreground hover:border-primary/40">
                    <ImageIcon className="h-5 w-5" /> Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
                  </label>
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-sm text-muted-foreground hover:border-primary/40">
                    <Video className="h-5 w-5" /> Upload Video
                    <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
                  </label>
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Caption</Label>
                <span className={`text-xs ${remaining < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  {caption.length}/{charLimit}
                </span>
              </div>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption…"
                rows={5}
              />
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Hash className="h-3.5 w-3.5" /> Suggested Hashtags</Label>
              <div className="flex flex-wrap gap-1.5">
                {suggestedHashtags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setCaption((c) => c + " " + tag)}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-3 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Schedule for Later
                </Label>
                <Switch checked={scheduleMode} onCheckedChange={setScheduleMode} />
              </div>
              {scheduleMode && (
                <div className="flex gap-2">
                  <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="flex-1" />
                  <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="flex-1" />
                </div>
              )}
            </div>

            <Button className="w-full" disabled={selectedPlatforms.length === 0}>
              {scheduleMode ? "Schedule Post" : "Publish Now"}
            </Button>
          </div>

          {/* Right: Live Preview */}
          <div className="space-y-3">
            <Label>Live Preview</Label>
            {activePlatform ? (
              <div className="overflow-hidden rounded-xl border bg-card card-shadow">
                <div className="flex items-center gap-2 border-b p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${activePlatform.color}20` }}>
                    <activePlatform.icon className="h-4 w-4" style={{ color: activePlatform.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">yourcompany</p>
                    <p className="text-[10px] text-muted-foreground">{activePlatform.name} • Just now</p>
                  </div>
                  <MoreHorizontal className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
                {preview && <img src={preview} alt="" className="w-full object-cover" style={{ maxHeight: 300 }} />}
                {caption && <p className="p-3 text-sm text-card-foreground whitespace-pre-wrap">{caption}</p>}
                <div className="flex items-center gap-4 border-t px-3 py-2.5">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <Send className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                Select a platform to see live preview
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostComposerModal;
