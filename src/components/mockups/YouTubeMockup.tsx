import { Play } from "lucide-react";
import type { MockupProps } from "./types";

const YouTubeMockup = ({ imageUrl, caption, username }: MockupProps) => (
  <div className="mx-auto w-full max-w-[480px] overflow-hidden rounded-xl border bg-card shadow-xl">
    {/* Thumbnail area */}
    <div className="relative" style={{ aspectRatio: "16/9" }}>
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center bg-foreground/90 text-sm text-card/50">Upload a thumbnail</div>
      )}

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-20 items-center justify-center rounded-xl bg-[#FF0000]/90">
          <Play className="h-8 w-8 fill-card text-card" />
        </div>
      </div>

      {/* Duration badge */}
      <div className="absolute bottom-2 right-2 rounded bg-foreground/80 px-1.5 py-0.5 text-[11px] font-medium text-card">
        1:24
      </div>
    </div>

    {/* Video info */}
    <div className="flex gap-3 p-3">
      <div className="h-9 w-9 shrink-0 rounded-full bg-[#FF0000]/20" />
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-medium leading-tight text-card-foreground">
          {caption || "Your video title will appear here — make it engaging!"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{username || "Your Channel"}</p>
        <p className="text-xs text-muted-foreground">12K views · 3 hours ago</p>
      </div>
    </div>

    <div className="border-t py-1.5 text-center text-[9px] text-muted-foreground">1280 × 720px</div>
  </div>
);

export default YouTubeMockup;
