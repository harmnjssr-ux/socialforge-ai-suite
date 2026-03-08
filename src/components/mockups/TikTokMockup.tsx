import { Heart, MessageCircle, Share2, Music, Plus } from "lucide-react";
import type { MockupProps } from "./types";

const TikTokMockup = ({ imageUrl, caption, username }: MockupProps) => (
  <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-xl" style={{ aspectRatio: "9/16" }}>
    {/* Full bleed */}
    {imageUrl ? (
      <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center text-xs text-card/40">Upload content</div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-transparent to-[#1a1a1a]/40" />

    {/* TikTok logo */}
    <div className="absolute left-3 top-3">
      <span className="text-sm font-black text-card">TikTok</span>
    </div>

    {/* Top tabs */}
    <div className="absolute left-0 right-0 top-10 flex items-center justify-center gap-4">
      <span className="text-xs text-card/60">Following</span>
      <span className="border-b-2 border-card pb-0.5 text-xs font-semibold text-card">For You</span>
    </div>

    {/* Right actions */}
    <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5">
      <div className="relative">
        <div className="h-11 w-11 rounded-full border-2 border-card bg-card/20" />
        <div className="absolute -bottom-1.5 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-[#FE2C55]">
          <Plus className="h-3 w-3 text-card" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Heart className="h-8 w-8 text-card" />
        <span className="mt-0.5 text-[10px] font-semibold text-card">24.5K</span>
      </div>
      <div className="flex flex-col items-center">
        <MessageCircle className="h-8 w-8 text-card" />
        <span className="mt-0.5 text-[10px] font-semibold text-card">1,842</span>
      </div>
      <div className="flex flex-col items-center">
        <Share2 className="h-8 w-8 text-card" />
        <span className="mt-0.5 text-[10px] font-semibold text-card">Share</span>
      </div>
      {/* Spinning disc */}
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-card/40 bg-card/10" style={{ animationDuration: "3s" }}>
        <div className="flex h-full w-full items-center justify-center rounded-full">
          <div className="h-4 w-4 rounded-full bg-card/30" />
        </div>
      </div>
    </div>

    {/* Bottom info */}
    <div className="absolute bottom-4 left-3 right-16">
      <p className="text-[13px] font-bold text-card">@{username || "yourcompany"}</p>
      <p className="mt-0.5 line-clamp-2 text-xs text-card/90">{caption || "Your caption here #fyp #viral"}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <Music className="h-3 w-3 text-card" />
        <span className="text-[10px] text-card/80">Original Sound — {username || "yourcompany"}</span>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 py-0.5 text-center text-[8px] text-card/30">1080 × 1920px</div>
  </div>
);

export default TikTokMockup;
