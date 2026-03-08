import { useState } from "react";
import { Upload, Download, Send, FolderOpen, Sparkles, Film, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "@/hooks/use-toast";

const STYLES = ["Product Showcase", "Lifestyle", "Animated", "Documentary", "Cinematic"];
const DURATIONS = ["5s", "10s", "15s", "30s"];
const FORMATS = [
  { id: "9:16", label: "Reels/TikTok/Shorts" },
  { id: "1:1", label: "Feed" },
  { id: "16:9", label: "YouTube" },
  { id: "4:5", label: "Ad" },
];

const VideoTab = () => {
  const { selectedCompany } = useCompany();
  const [mode, setMode] = useState<"text" | "images">("text");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Product Showcase");
  const [duration, setDuration] = useState("10s");
  const [format, setFormat] = useState("9:16");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!prompt.trim() && mode === "text") {
      toast({ title: "Please enter a prompt", variant: "destructive" });
      return;
    }
    setGenerating(true);
    setProgress(0);
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setGenerating(false);
            toast({
              title: "Video generation requires API setup",
              description: "Connect a video generation API (like Runway ML) to enable this feature.",
            });
          }, 1000);
          return 95;
        }
        return p + Math.random() * 15;
      });
    }, 800);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((f) => URL.createObjectURL(f));
    setUploadedImages((prev) => [...prev, ...previews].slice(0, 10));
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Left Panel */}
      <div className="w-2/5 space-y-5 overflow-y-auto pr-2">
        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-secondary p-1">
          <button
            onClick={() => setMode("text")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === "text" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Text to Video
          </button>
          <button
            onClick={() => setMode("images")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === "images" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Images to Video
          </button>
        </div>

        {mode === "text" ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Prompt</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to create..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Duration</label>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                      duration === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Style</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      style === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => document.getElementById("video-images-upload")?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">Upload 3-10 images</p>
              <p className="text-xs text-muted-foreground mt-1">AI creates a slideshow with smooth transitions</p>
              <input
                id="video-images-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {uploadedImages.map((img, i) => (
                  <img key={i} src={img} alt="" className="aspect-square rounded-lg object-cover border border-border" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Format Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Format</label>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  format === f.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={generating} className="w-full h-12 text-base font-semibold" size="lg">
          <Film className="mr-2 h-5 w-5" />
          {generating ? "Generating..." : "Generate Video"}
        </Button>
      </div>

      {/* Right Panel */}
      <div className="flex-1 min-h-0">
        {generating ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 p-10">
            <Film className="h-12 w-12 text-primary/40 mb-4 animate-pulse" />
            <p className="text-sm font-medium text-foreground mb-4">Generating your video...</p>
            <div className="w-64">
              <Progress value={progress} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Video generation takes 30–120 seconds</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-32 items-center justify-center rounded-xl bg-secondary">
                <Play className="h-8 w-8 text-muted-foreground" />
              </div>
              <Film className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Your generated video will appear here</p>
              <p className="text-xs text-muted-foreground mt-1">Requires video generation API (Runway ML)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoTab;
