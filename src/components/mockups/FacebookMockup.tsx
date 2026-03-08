import { ThumbsUp, MessageCircle, Share2, Globe, MoreHorizontal } from "lucide-react";
import type { MockupProps } from "./types";

const FacebookMockup = ({ imageUrl, caption, username }: MockupProps) => (
  <div className="mx-auto w-full max-w-[480px] overflow-hidden rounded-xl border bg-card shadow-xl">
    {/* Browser chrome */}
    <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2">
      <div className="flex gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
      </div>
      <div className="flex-1 rounded-md bg-card px-3 py-1 text-[10px] text-muted-foreground">facebook.com</div>
    </div>

    {/* Facebook header */}
    <div className="bg-[#1877F2] px-4 py-2">
      <span className="text-lg font-bold text-card">facebook</span>
    </div>

    {/* Post card */}
    <div className="bg-card">
      {/* Post header */}
      <div className="flex items-center gap-2.5 px-4 pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-sm font-bold text-card">
          {(username || "Y")[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-card-foreground">{username || "Your Company"}</p>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>Sponsored</span>
            <span>·</span>
            <Globe className="h-3 w-3" />
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Post text */}
      {caption && (
        <p className="px-4 pt-3 text-sm text-card-foreground">{caption}</p>
      )}

      {/* Image */}
      <div className="mt-3" style={{ aspectRatio: "1.91/1" }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">Upload an image</div>
        )}
      </div>

      {/* Reactions count */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-1">
          <span className="text-sm">👍❤️</span>
          <span className="text-xs text-muted-foreground">142</span>
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>24 comments</span>
          <span>8 shares</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-around py-1.5">
        {[
          { icon: ThumbsUp, label: "Like" },
          { icon: MessageCircle, label: "Comment" },
          { icon: Share2, label: "Share" },
        ].map(({ icon: Icon, label }) => (
          <button key={label} className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
            <Icon className="h-5 w-5" /> {label}
          </button>
        ))}
      </div>
    </div>

    <div className="border-t py-1.5 text-center text-[9px] text-muted-foreground">1200 × 630px</div>
  </div>
);

export default FacebookMockup;
