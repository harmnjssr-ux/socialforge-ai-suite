import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import type { MockupProps } from "./types";

const InstagramFeedMockup = ({ imageUrl, caption, username }: MockupProps) => (
  <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border bg-card shadow-xl">
    {/* Status bar */}
    <div className="flex items-center justify-between bg-card px-4 py-2 text-[10px] font-semibold text-card-foreground">
      <span>9:41</span>
      <div className="flex gap-1">
        <div className="h-2 w-4 rounded-sm bg-card-foreground/60" />
        <div className="h-2 w-4 rounded-sm bg-card-foreground/60" />
        <div className="h-2.5 w-5 rounded-sm border border-card-foreground/60">
          <div className="h-full w-3/4 rounded-sm bg-card-foreground/60" />
        </div>
      </div>
    </div>

    {/* Instagram Header */}
    <div className="flex items-center justify-between border-b px-3 py-2">
      <svg viewBox="0 0 120 35" className="h-7 w-auto text-card-foreground" fill="currentColor">
        <text x="0" y="26" fontSize="22" fontWeight="500" fontFamily="system-ui" fontStyle="italic">Instagram</text>
      </svg>
      <div className="flex gap-4">
        <Heart className="h-5 w-5 text-card-foreground" />
        <Send className="h-5 w-5 text-card-foreground" />
      </div>
    </div>

    {/* Post Header */}
    <div className="flex items-center gap-2.5 px-3 py-2.5">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] p-[2px]">
        <div className="h-full w-full rounded-full bg-card" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-card-foreground">{username || "yourcompany"}</p>
        <p className="text-[10px] text-muted-foreground">Sponsored</p>
      </div>
      <MoreHorizontal className="h-5 w-5 text-card-foreground" />
    </div>

    {/* Image */}
    <div className="aspect-square w-full bg-muted">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Upload an image</div>
      )}
    </div>

    {/* Actions */}
    <div className="flex items-center justify-between px-3 py-2.5">
      <div className="flex gap-4">
        <Heart className="h-6 w-6 text-card-foreground" />
        <MessageCircle className="h-6 w-6 text-card-foreground" />
        <Send className="h-6 w-6 text-card-foreground" />
      </div>
      <Bookmark className="h-6 w-6 text-card-foreground" />
    </div>

    {/* Likes */}
    <div className="px-3 pb-1">
      <p className="text-xs font-semibold text-card-foreground">❤️ 248 likes</p>
    </div>

    {/* Caption */}
    <div className="px-3 pb-2">
      <p className="text-xs text-card-foreground">
        <span className="font-semibold">{username || "yourcompany"}</span>{" "}
        {caption || "Your caption will appear here..."}
      </p>
    </div>

    <div className="px-3 pb-3">
      <p className="text-[11px] text-muted-foreground">View all 18 comments</p>
    </div>

    <div className="border-t px-3 py-1.5 text-center text-[9px] font-medium text-muted-foreground">
      1080 × 1080px
    </div>
  </div>
);

export default InstagramFeedMockup;
