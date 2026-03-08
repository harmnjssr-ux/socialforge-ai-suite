import { Heart, MessageCircle, Send, Music, Plus } from "lucide-react";
import type { MockupProps } from "./types";

const InstagramReelMockup = ({ imageUrl, caption, username }: MockupProps) => (
  <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border bg-foreground shadow-xl" style={{ aspectRatio: "9/16" }}>
    {/* Full bleed image */}
    {imageUrl ? (
      <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center text-xs text-card/50">Upload content</div>
    )}

    {/* Dark overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-foreground/30" />

    {/* Right side actions */}
    <div className="absolute bottom-20 right-3 flex flex-col items-center gap-4">
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-2 border-card bg-card/20" />
        <div className="absolute -bottom-1 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-[#E4405F]">
          <Plus className="h-2.5 w-2.5 text-card" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Heart className="h-7 w-7 text-card" />
        <span className="mt-0.5 text-[10px] font-semibold text-card">12.4K</span>
      </div>
      <div className="flex flex-col items-center">
        <MessageCircle className="h-7 w-7 text-card" />
        <span className="mt-0.5 text-[10px] font-semibold text-card">892</span>
      </div>
      <div className="flex flex-col items-center">
        <Send className="h-7 w-7 text-card" />
        <span className="mt-0.5 text-[10px] font-semibold text-card">Share</span>
      </div>
      <div className="h-8 w-8 animate-spin rounded-lg border-2 border-card bg-card/20" style={{ animationDuration: "3s" }} />
    </div>

    {/* Bottom content */}
    <div className="absolute bottom-3 left-3 right-14">
      <p className="text-sm font-bold text-card">@{username || "yourcompany"}</p>
      <p className="mt-0.5 line-clamp-2 text-xs text-card/90">{caption || "Your caption here..."}</p>
      <div className="mt-1.5 flex items-center gap-1.5">
        <Music className="h-3 w-3 text-card" />
        <p className="text-[10px] text-card/80">Original Audio — {username || "yourcompany"}</p>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 py-1 text-center text-[8px] text-card/40">1080 × 1920px</div>
  </div>
);

export default InstagramReelMockup;
