import { useState, useRef, useCallback } from "react";
import { Upload, X, ChevronDown, ChevronUp, Heart, MessageCircle, Send, ThumbsUp, Share2, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentPreviewProps {
  onUseContent: (file: File) => void;
}

const ContentPreview = ({ onUseContent }: ContentPreviewProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setExpanded(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Content Preview</h2>

      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
          }`}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drop an image or video here to preview it on any platform</p>
          <p className="text-xs text-muted-foreground">or click to browse</p>
          <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{file?.name}</p>
            <button onClick={clear} className="rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>

          {/* 3 Main mockups */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Instagram */}
            <div className="overflow-hidden rounded-xl border bg-card card-shadow">
              <div className="flex items-center gap-2 border-b p-3">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]" />
                <span className="text-xs font-semibold text-card-foreground">yourcompany</span>
              </div>
              <img src={preview} alt="" className="aspect-square w-full object-cover" />
              <div className="flex items-center gap-4 p-3">
                <Heart className="h-5 w-5 text-card-foreground" />
                <MessageCircle className="h-5 w-5 text-card-foreground" />
                <Send className="h-5 w-5 text-card-foreground" />
              </div>
              <p className="px-3 pb-3 text-[10px] text-muted-foreground">Instagram Preview</p>
            </div>

            {/* Facebook */}
            <div className="overflow-hidden rounded-xl border bg-card card-shadow">
              <div className="flex items-center gap-2 border-b p-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1877F2] text-xs font-bold text-primary-foreground">f</div>
                <span className="text-xs font-semibold text-card-foreground">Your Page</span>
              </div>
              <img src={preview} alt="" className="aspect-video w-full object-cover" />
              <div className="flex items-center justify-around border-t p-2.5">
                <div className="flex items-center gap-1 text-xs text-muted-foreground"><ThumbsUp className="h-4 w-4" /> Like</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle className="h-4 w-4" /> Comment</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground"><Share2 className="h-4 w-4" /> Share</div>
              </div>
              <p className="px-3 pb-3 text-[10px] text-muted-foreground">Facebook Preview</p>
            </div>

            {/* TikTok */}
            <div className="relative overflow-hidden rounded-xl bg-foreground card-shadow" style={{ aspectRatio: "9/16", maxHeight: 320 }}>
              <img src={preview} alt="" className="h-full w-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-3">
                <p className="text-xs font-semibold text-card">@yourcompany</p>
                <p className="text-[10px] text-card/70">Your caption here #fyp</p>
              </div>
              <div className="absolute bottom-16 right-2 flex flex-col items-center gap-3">
                <Heart className="h-5 w-5 text-card" />
                <MessageCircle className="h-5 w-5 text-card" />
                <Share2 className="h-5 w-5 text-card" />
                <Music2 className="h-5 w-5 text-card" />
              </div>
              <p className="absolute left-3 top-3 text-[10px] text-card/60">TikTok Preview</p>
            </div>
          </div>

          {expanded && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {["YouTube", "LinkedIn", "X (Twitter)", "Pinterest", "Snapchat"].map((name) => (
                <div key={name} className="flex flex-col items-center rounded-xl border bg-card p-4 card-shadow">
                  <img src={preview} alt="" className="mb-2 aspect-square w-full rounded-lg object-cover" />
                  <span className="text-xs font-medium text-card-foreground">{name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}
              {expanded ? "Show Less" : "Preview on More Platforms"}
            </Button>
            <Button size="sm" onClick={() => file && onUseContent(file)}>
              Use This Content
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPreview;
