import { useState } from "react";
import { Upload, Download, Send, FolderOpen, Sparkles, User, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const AVATAR_STYLES = [
  { id: "business", label: "Business Professional", emoji: "👔" },
  { id: "casual", label: "Casual Friendly", emoji: "😊" },
  { id: "bold", label: "Bold/Energetic", emoji: "⚡" },
  { id: "news", label: "News Anchor", emoji: "📺" },
];

const VOICES = [
  { id: "professional-male", label: "Professional Male", emoji: "🎙️" },
  { id: "professional-female", label: "Professional Female", emoji: "🎤" },
  { id: "warm-friendly", label: "Warm Friendly", emoji: "☀️" },
  { id: "high-energy", label: "High Energy", emoji: "⚡" },
  { id: "calm-authority", label: "Calm Authority", emoji: "🌊" },
  { id: "young-casual", label: "Young Casual", emoji: "😎" },
];

const BACKGROUNDS = [
  { id: "white", label: "Plain White", color: "bg-white" },
  { id: "office", label: "Office", color: "bg-amber-900/30" },
  { id: "studio", label: "Studio", color: "bg-secondary" },
  { id: "gradient", label: "Gradient", color: "gradient-primary" },
];

const AvatarTab = () => {
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [avatarStyle, setAvatarStyle] = useState("business");
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState("professional-male");
  const [background, setBackground] = useState("white");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadPreview(URL.createObjectURL(file));
  };

  const handleGenerate = () => {
    if (!uploadPreview) { toast({ title: "Please upload a headshot", variant: "destructive" }); return; }
    if (!script.trim()) { toast({ title: "Please enter a script", variant: "destructive" }); return; }
    setGenerating(true); setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => { if (p >= 95) { clearInterval(interval); setTimeout(() => { setGenerating(false); toast({ title: "Avatar generation requires API setup", description: "Connect D-ID API to enable avatar video generation." }); }, 1000); return 95; } return p + Math.random() * 12; });
    }, 600);
  };

  return (
    <div className="flex gap-6 h-full">
      <div className="w-2/5 space-y-5 overflow-y-auto pr-2">
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[hsl(0_0%_100%/0.1)] bg-[hsl(var(--background-secondary))] p-8 text-center cursor-pointer hover:border-primary/40 transition-all duration-200" onClick={() => document.getElementById("avatar-upload")?.click()}>
          {uploadPreview ? (
            <img src={uploadPreview} alt="Headshot" className="h-28 w-28 rounded-full object-cover border-4 border-primary/30 mb-3" style={{ boxShadow: '0 0 20px hsl(243 95% 69% / 0.2)' }} />
          ) : (
            <div className="h-28 w-28 rounded-full bg-secondary/50 flex items-center justify-center mb-3 border border-[hsl(0_0%_100%/0.08)]"><User className="h-12 w-12 text-muted-foreground" /></div>
          )}
          <p className="text-sm font-medium text-foreground">{uploadPreview ? "Photo uploaded" : "Upload a clear front-facing photo"}</p>
          <p className="text-xs text-muted-foreground mt-1">to create your AI spokesperson</p>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-display font-medium text-foreground">Avatar Style</label>
          <div className="grid grid-cols-2 gap-2">
            {AVATAR_STYLES.map((s) => (<button key={s.id} onClick={() => setAvatarStyle(s.id)} className={`card-glass p-3 text-center text-xs font-medium transition-all duration-200 ${avatarStyle === s.id ? "border-primary/60 gradient-text shadow-[0_0_12px_hsl(243_95%_69%/0.15)]" : "text-muted-foreground hover:border-primary/30"}`}><div className="text-lg mb-1">{s.emoji}</div>{s.label}</button>))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-display font-medium text-foreground">Script</label>
          <Textarea value={script} onChange={(e) => setScript(e.target.value.slice(0, 500))} placeholder="Type what the avatar will say..." rows={4} className="resize-none bg-[hsl(var(--background-secondary))] border-primary/20" />
          <p className="text-xs text-muted-foreground text-right font-mono-stat">{script.length}/500</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-display font-medium text-foreground">Voice</label>
          <div className="grid grid-cols-2 gap-2">
            {VOICES.map((v) => (<button key={v.id} onClick={() => setVoice(v.id)} className={`card-glass flex items-center gap-2 p-2.5 text-xs font-medium transition-all duration-200 ${voice === v.id ? "border-primary/60 text-foreground shadow-[0_0_12px_hsl(243_95%_69%/0.15)]" : "text-muted-foreground hover:border-primary/30"}`}><span>{v.emoji}</span><span className="flex-1 text-left">{v.label}</span></button>))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-display font-medium text-foreground">Background</label>
          <div className="flex gap-2">
            {BACKGROUNDS.map((b) => (<button key={b.id} onClick={() => setBackground(b.id)} className={`card-glass flex flex-col items-center gap-1 p-2.5 text-xs font-medium transition-all duration-200 ${background === b.id ? "border-primary/60" : "hover:border-primary/30"}`}><div className={`h-8 w-8 rounded-md ${b.color} border border-[hsl(0_0%_100%/0.1)]`} />{b.label}</button>))}
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={generating} className="w-full h-12" size="lg"><Sparkles className="mr-2 h-5 w-5" />{generating ? "Generating..." : "Generate Avatar Video"}</Button>
      </div>

      <div className="flex-1 min-h-0">
        {generating ? (
          <div className="flex h-full flex-col items-center justify-center card-glass p-10">
            <div className="h-24 w-24 rounded-full bg-secondary/50 animate-pulse flex items-center justify-center mb-4 border border-[hsl(0_0%_100%/0.08)]"><User className="h-10 w-10 text-muted-foreground" /></div>
            <p className="text-sm font-display font-medium text-foreground mb-4">Creating your avatar video...</p>
            <div className="w-64"><Progress value={progress} className="h-2" /></div>
            <p className="text-xs text-muted-foreground mt-3">Avatar generation takes 45–90 seconds</p>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex-1 flex items-center justify-center card-glass gradient-border-animated">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-secondary/50 border border-[hsl(0_0%_100%/0.08)]"><User className="h-12 w-12 text-muted-foreground" /></div>
                <p className="text-sm font-display font-medium text-muted-foreground">Your avatar video will appear here</p>
                <p className="text-xs text-muted-foreground mt-1">Requires D-ID API connection</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-display font-medium text-foreground mb-2">Saved Avatars</h3>
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (<div key={i} className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center border border-[hsl(0_0%_100%/0.08)]"><User className="h-6 w-6 text-muted-foreground/40" /></div>))}
                <div className="h-16 w-16 rounded-full border-2 border-dashed border-[hsl(0_0%_100%/0.1)] flex items-center justify-center text-muted-foreground text-xs">+</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarTab;
