import { useState } from "react";
import { Upload, Download, Send, FolderOpen, RefreshCw, Sparkles, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "@/hooks/use-toast";

const PROMPT_TEMPLATES = [
  "Product on clean white background",
  "Lifestyle scene with product",
  "Social media advertisement",
  "Before and after comparison",
  "Team/staff professional photo",
  "Store/location exterior shot",
];

const STYLES = [
  { id: "photorealistic", label: "Photorealistic", emoji: "📷" },
  { id: "cinematic", label: "Cinematic", emoji: "🎬" },
  { id: "minimalist", label: "Minimalist", emoji: "◻️" },
  { id: "bold-graphic", label: "Bold Graphic", emoji: "🎨" },
  { id: "watercolor", label: "Watercolor", emoji: "🖌️" },
  { id: "vintage", label: "Vintage", emoji: "📻" },
];

const SIZE_PRESETS = [
  { id: "1:1", label: "Instagram Square", ratio: "1:1" },
  { id: "9:16", label: "Story", ratio: "9:16" },
  { id: "1.91:1", label: "Facebook Ad", ratio: "1.91:1" },
  { id: "16:9", label: "YouTube", ratio: "16:9" },
  { id: "4:1", label: "LinkedIn Banner", ratio: "4:1" },
  { id: "9:16-tiktok", label: "TikTok", ratio: "9:16" },
];

const ImageTab = () => {
  const { selectedCompany } = useCompany();
  const [mode, setMode] = useState<"text" | "upload">("text");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photorealistic");
  const [sizePreset, setSizePreset] = useState("1:1");
  const [imageCount, setImageCount] = useState(1);
  const [includeBrandColors, setIncludeBrandColors] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast({ title: "Please enter a prompt", variant: "destructive" }); return; }
    if (!selectedCompany) { toast({ title: "Please select a company first", variant: "destructive" }); return; }
    setGenerating(true);
    setGeneratedImages([]);
    try {
      let finalPrompt = prompt;
      if (includeBrandColors && selectedCompany.brand_primary_color) {
        finalPrompt += ` using brand colors ${selectedCompany.brand_primary_color} and ${selectedCompany.brand_secondary_color}`;
      }
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ prompt: finalPrompt, style, aspectRatio: sizePreset, companyId: selectedCompany.id, count: imageCount }),
      });
      if (response.status === 429) { toast({ title: "Rate limit exceeded", description: "Please try again in a moment.", variant: "destructive" }); return; }
      if (response.status === 402) { toast({ title: "Usage limit reached", description: "Please add credits to continue.", variant: "destructive" }); return; }
      if (!response.ok) throw new Error("Generation failed");
      const data = await response.json();
      if (data.images?.length > 0) { setGeneratedImages(data.images); toast({ title: "Images generated!", description: `${data.images.length} image(s) created.` }); }
      else { toast({ title: "No images generated", description: "Try a different prompt.", variant: "destructive" }); }
    } catch (e) { console.error(e); toast({ title: "Generation failed", description: "Please try again.", variant: "destructive" }); }
    finally { setGenerating(false); }
  };

  const handleFileDrop = (e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file?.type.startsWith("image/")) { setUploadedFile(file); setUploadPreview(URL.createObjectURL(file)); } };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { setUploadedFile(file); setUploadPreview(URL.createObjectURL(file)); } };

  return (
    <div className="flex gap-6 h-full">
      {/* Left Panel - Controls */}
      <div className="w-2/5 space-y-5 overflow-y-auto pr-2">
        {/* Mode Toggle */}
        <div className="flex rounded-xl bg-secondary/50 p-1 border border-[hsl(0_0%_100%/0.06)]">
          <button onClick={() => setMode("text")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-display font-medium transition-all duration-200 ${mode === "text" ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Text to Image</button>
          <button onClick={() => setMode("upload")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-display font-medium transition-all duration-200 ${mode === "upload" ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Upload & Enhance</button>
        </div>

        {mode === "text" ? (
          <>
            {/* Company Context */}
            {selectedCompany && (
              <div className="card-glass p-3 text-sm border-primary/20" style={{ borderColor: 'hsl(243 95% 69% / 0.2)' }}>
                <Sparkles className="inline h-3.5 w-3.5 text-primary mr-1.5" />
                <span className="font-medium text-foreground">Generating for: </span>
                <span className="gradient-text font-semibold">{selectedCompany.name}</span>
                {selectedCompany.industry && <span className="text-muted-foreground"> | {selectedCompany.industry}</span>}
              </div>
            )}

            {/* Prompt */}
            <div className="space-y-2">
              <label className="text-sm font-display font-medium text-foreground">Prompt</label>
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the image you want to create..." rows={4} className="resize-none bg-[hsl(var(--background-secondary))] border-primary/20 focus:border-primary/60 focus:shadow-[0_0_0_3px_hsl(243_95%_69%/0.15)]" />
            </div>

            {/* Prompt Templates */}
            <div className="space-y-2">
              <label className="text-sm font-display font-medium text-foreground">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                {PROMPT_TEMPLATES.map((t) => (
                  <button key={t} onClick={() => setPrompt(t)} className="card-glass px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200 hover:shadow-[0_0_10px_hsl(243_95%_69%/0.15)]">{t}</button>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-2">
              <label className="text-sm font-display font-medium text-foreground">Style</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map((s) => (
                  <button key={s.id} onClick={() => setStyle(s.id)} className={`card-glass p-3 text-center text-xs font-medium transition-all duration-200 ${style === s.id ? "border-primary/60 gradient-text shadow-[0_0_15px_hsl(243_95%_69%/0.2)]" : "text-muted-foreground hover:border-primary/30"}`}>
                    <div className="text-lg mb-1">{s.emoji}</div>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Presets */}
            <div className="space-y-2">
              <label className="text-sm font-display font-medium text-foreground">Platform Size</label>
              <div className="flex flex-wrap gap-2">
                {SIZE_PRESETS.map((p) => (
                  <button key={p.id} onClick={() => setSizePreset(p.ratio)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${sizePreset === p.ratio ? "gradient-primary text-primary-foreground" : "card-glass text-muted-foreground hover:text-foreground"}`}>{p.label}</button>
                ))}
              </div>
            </div>

            {/* Brand Colors Toggle */}
            <div className="card-glass flex items-center justify-between p-3">
              <span className="text-sm font-medium text-foreground">Include brand colors</span>
              <Switch checked={includeBrandColors} onCheckedChange={setIncludeBrandColors} />
            </div>

            {/* Image Count */}
            <div className="space-y-2">
              <label className="text-sm font-display font-medium text-foreground">Number of images</label>
              <div className="flex gap-2">
                {[1, 2, 4].map((n) => (
                  <button key={n} onClick={() => setImageCount(n)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${imageCount === n ? "gradient-primary text-primary-foreground" : "card-glass text-muted-foreground hover:text-foreground"}`}>{n}</button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button onClick={handleGenerate} disabled={generating || !prompt.trim()} className="w-full h-12 text-base font-semibold" size="lg">
              <Sparkles className="mr-2 h-5 w-5" />
              {generating ? "Generating..." : "Generate Images"}
            </Button>
          </>
        ) : (
          <>
            <div onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop} className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[hsl(0_0%_100%/0.1)] bg-[hsl(var(--background-secondary))] p-10 text-center cursor-pointer hover:border-primary/40 transition-all duration-200" onClick={() => document.getElementById("enhance-upload")?.click()}>
              {uploadPreview ? (
                <img src={uploadPreview} alt="Upload" className="max-h-48 rounded-lg object-contain mb-3" />
              ) : (
                <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              )}
              <p className="text-sm font-medium text-foreground">{uploadPreview ? "Image uploaded" : "Drop image here or click to upload"}</p>
              <input id="enhance-upload" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
            {uploadPreview && (
              <div className="space-y-2">
                <label className="text-sm font-display font-medium text-foreground">Enhancement Options</label>
                {["Remove Background", "Enhance Quality", "Generate 4 Variations", "Add Lifestyle Context", "Add Brand Overlay"].map((opt) => (
                  <div key={opt} className="card-glass flex items-center justify-between p-3">
                    <span className="text-sm text-foreground">{opt}</span>
                    <Switch />
                  </div>
                ))}
                <Button className="w-full mt-3" size="lg"><Sparkles className="mr-2 h-4 w-4" /> Enhance</Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Panel - Results */}
      <div className="flex-1 min-h-0">
        {generating ? (
          <div className="grid grid-cols-2 gap-4 h-full">
            {Array.from({ length: imageCount }).map((_, i) => (
              <div key={i} className="rounded-xl bg-gradient-to-br from-primary/5 via-secondary to-accent/5 animate-pulse flex items-center justify-center card-glass">
                <div className="text-center">
                  <Sparkles className="h-8 w-8 text-primary/40 mx-auto mb-2 animate-spin" />
                  <p className="text-sm text-muted-foreground">Generating your images...</p>
                </div>
              </div>
            ))}
          </div>
        ) : generatedImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 h-full">
            {generatedImages.map((url, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden card-glass">
                <img src={url} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[hsl(var(--background))/0.6] backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  <a href={url} download className="rounded-full card-glass p-2.5 text-foreground hover:scale-110 transition-transform" title="Download"><Download className="h-4 w-4" /></a>
                  <button className="rounded-full card-glass p-2.5 text-foreground hover:scale-110 transition-transform" title="Use for Post"><Send className="h-4 w-4" /></button>
                  <button className="rounded-full card-glass p-2.5 text-foreground hover:scale-110 transition-transform" title="Save to Library"><FolderOpen className="h-4 w-4" /></button>
                  <button className="rounded-full card-glass p-2.5 text-foreground hover:scale-110 transition-transform" title="Regenerate" onClick={handleGenerate}><RefreshCw className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl card-glass gradient-border-animated">
            <div className="text-center">
              <div className="grid grid-cols-2 gap-3 mx-auto mb-4 w-40">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-lg bg-secondary/50 border border-[hsl(0_0%_100%/0.06)]" />
                ))}
              </div>
              <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-display font-medium text-muted-foreground">Your generated images will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTab;
