import { ThumbsUp, MessageCircle, Repeat2, Send, Globe, MoreHorizontal } from "lucide-react";
import type { MockupProps } from "./types";

const LinkedInMockup = ({ imageUrl, caption, username }: MockupProps) => (
  <div className="mx-auto w-full max-w-[480px] overflow-hidden rounded-xl border bg-card shadow-xl">
    {/* Browser chrome */}
    <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2">
      <div className="flex gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
      </div>
      <div className="flex-1 rounded-md bg-card px-3 py-1 text-[10px] text-muted-foreground">linkedin.com</div>
    </div>

    {/* LinkedIn header */}
    <div className="bg-[#0A66C2] px-4 py-2">
      <span className="text-base font-bold text-card">in</span>
    </div>

    {/* Post */}
    <div className="bg-card">
      <div className="flex items-start gap-2.5 px-4 pt-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0A66C2]/10 text-sm font-bold text-[#0A66C2]">
          {(username || "Y")[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-card-foreground">{username || "Your Name"}</p>
            <span className="rounded bg-muted px-1 text-[9px] font-medium text-muted-foreground">1st</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Marketing Director at Agency</p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>3h</span>
            <span>·</span>
            <Globe className="h-3 w-3" />
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Post text */}
      <div className="px-4 pt-3">
        <p className="text-sm text-card-foreground">
          {caption ? (
            <>
              {caption.slice(0, 150)}
              {caption.length > 150 && <span className="text-muted-foreground">...more</span>}
            </>
          ) : (
            "Your post text will appear here. Share your thoughts with your professional network..."
          )}
        </p>
      </div>

      {/* Image */}
      <div className="mt-3" style={{ aspectRatio: "1.91/1" }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">Upload an image</div>
        )}
      </div>

      {/* Reactions */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-1">
          <span className="text-sm">👍❤️</span>
          <span className="text-xs text-muted-foreground">86</span>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>12 comments</span>
          <span>3 reposts</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-around py-1">
        {[
          { icon: ThumbsUp, label: "Like" },
          { icon: MessageCircle, label: "Comment" },
          { icon: Repeat2, label: "Repost" },
          { icon: Send, label: "Send" },
        ].map(({ icon: Icon, label }) => (
          <button key={label} className="flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted">
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>
    </div>

    <div className="border-t py-1.5 text-center text-[9px] text-muted-foreground">1200 × 627px</div>
  </div>
);

export default LinkedInMockup;
