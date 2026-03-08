import { X as XIcon, Send } from "lucide-react";
import type { MockupProps } from "./types";

const InstagramStoryMockup = ({ imageUrl, username }: MockupProps) => (
  <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border bg-foreground shadow-xl" style={{ aspectRatio: "9/16" }}>
    {/* Story progress bars */}
    <div className="flex gap-0.5 px-2 pt-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`h-0.5 flex-1 rounded-full ${i === 1 ? "bg-card" : "bg-card/30"}`} />
      ))}
    </div>

    {/* Header */}
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="h-8 w-8 rounded-full border-2 border-card bg-card/20" />
      <span className="flex-1 text-xs font-semibold text-card">{username || "yourcompany"}</span>
      <span className="text-[10px] text-card/60">3h</span>
      <XIcon className="h-5 w-5 text-card" />
    </div>

    {/* Image area */}
    <div className="relative flex-1" style={{ height: "calc(100% - 100px)" }}>
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-card/50">Upload an image</div>
      )}
    </div>

    {/* Bottom bar */}
    <div className="flex items-center gap-2 bg-foreground/80 px-3 py-2">
      <div className="flex-1 rounded-full border border-card/30 px-3 py-1.5 text-[11px] text-card/50">
        Send Message
      </div>
      <Send className="h-5 w-5 text-card" />
    </div>

    <div className="py-1 text-center text-[8px] text-card/40">1080 × 1920px</div>
  </div>
);

export default InstagramStoryMockup;
