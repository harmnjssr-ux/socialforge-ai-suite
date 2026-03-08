import { Heart, MessageCircle, Repeat2, Share, BarChart3, Bookmark, MoreHorizontal, BadgeCheck } from "lucide-react";
import type { MockupProps } from "./types";

const TwitterMockup = ({ imageUrl, caption, username }: MockupProps) => (
  <div className="mx-auto w-full max-w-[480px] overflow-hidden rounded-xl border bg-card shadow-xl">
    {/* X top bar */}
    <div className="flex items-center justify-center border-b bg-card px-4 py-2.5">
      <span className="text-lg font-black text-card-foreground">𝕏</span>
    </div>

    {/* Tweet */}
    <div className="px-4 pt-3">
      <div className="flex gap-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-sm font-bold text-foreground">
          {(username || "Y")[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-card-foreground">{username || "Your Company"}</span>
            <BadgeCheck className="h-4 w-4 fill-[#1DA1F2] text-card" />
            <span className="text-sm text-muted-foreground">@{(username || "yourcompany").toLowerCase().replace(/\s/g, "")}</span>
            <span className="text-sm text-muted-foreground">· 2h</span>
          </div>

          {/* Tweet text */}
          <p className="mt-1 text-sm text-card-foreground leading-relaxed">
            {caption || "Your tweet will appear here. Keep it short and engaging! 🚀"}
          </p>

          {/* Image */}
          {(imageUrl || !caption) && (
            <div className="mt-3 overflow-hidden rounded-2xl border" style={{ aspectRatio: "16/9" }}>
              {imageUrl ? (
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">Upload an image</div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between py-3">
            {[
              { icon: MessageCircle, count: "18" },
              { icon: Repeat2, count: "42" },
              { icon: Heart, count: "248" },
              { icon: BarChart3, count: "12K" },
            ].map(({ icon: Icon, count }, i) => (
              <div key={i} className="flex items-center gap-1.5 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span className="text-xs">{count}</span>
              </div>
            ))}
            <div className="flex gap-2 text-muted-foreground">
              <Bookmark className="h-4 w-4" />
              <Share className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t py-1.5 text-center text-[9px] text-muted-foreground">1200 × 675px</div>
  </div>
);

export default TwitterMockup;
