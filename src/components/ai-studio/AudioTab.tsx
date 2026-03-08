import { useState, useMemo } from "react";
import { Mic, Music, Play, Pause, Download, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

const VOICES = [
  { id: "professional-male", label: "Professional Male", emoji: "🎙️" },
  { id: "professional-female", label: "Professional Female", emoji: "🎤" },
  { id: "warm-friendly", label: "Warm Friendly", emoji: "☀️" },
  { id: "high-energy", label: "High Energy", emoji: "⚡" },
  { id: "calm-authority", label: "Calm Authority", emoji: "🌊" },
  { id: "young-casual", label: "Young Casual", emoji: "😎" },
];

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Portuguese", "Italian", "Japanese", "Korean", "Chinese", "Arabic",
];

const MOODS = [
  { id: "upbeat", label: "Upbeat", emoji: "🎉" },
  { id: "corporate", label: "Corporate", emoji: "🏢" },
  { id: "emotional", label: "Emotional", emoji: "💝" },
  { id: "exciting", label: "Exciting", emoji: "🔥" },
  { id: "calm", label: "Calm", emoji: "🧘" },
  { id: "motivational", label: "Motivational", emoji: "💪" },
];

const GENRES = ["Pop", "Electronic", "Acoustic", "Orchestral", "Hip-hop"];
const MUSIC_DURATIONS = ["15s", "30s", "60s", "90s"];
const TEMPOS = ["Slow", "Medium", "Fast"];

const AudioTab = () => {
  const [subTab, setSubTab] = useState<"voiceover" | "music">("voiceover");

  // Voiceover state
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState("professional-male");
  const [language, setLanguage] = useState("English");
  const [speed, setSpeed] = useState([1.0]);
  const [generatingVoice, setGeneratingVoice] = useState(false);

  // Music state
  const [mood, setMood] = useState("upbeat");
  const [genre, setGenre] = useState("Pop");
  const [musicDuration, setMusicDuration] = useState("30s");
  const [tempo, setTempo] = useState("Medium");
  const [generatingMusic, setGeneratingMusic] = useState(false);

  const wordCount = useMemo(() => script.trim().split(/\s+/).filter(Boolean).length, [script]);
  const estimatedDuration = useMemo(() => {
    const minutes = wordCount / 150;
    const secs = Math.ceil(minutes * 60);
    return secs > 60 ? `${Math.floor(secs / 60)}m ${secs % 60}s` : `${secs}s`;
  }, [wordCount]);

  const handleGenerateVoice = () => {
    if (!script.trim()) {
      toast({ title: "Please enter a script", variant: "destructive" });
      return;
    }
    setGeneratingVoice(true);
    setTimeout(() => {
      setGeneratingVoice(false);
      toast({
        title: "Voiceover generation requires API setup",
        description: "Connect ElevenLabs API to enable voiceover generation.",
      });
    }, 2000);
  };

  const handleGenerateMusic = () => {
    setGeneratingMusic(true);
    setTimeout(() => {
      setGeneratingMusic(false);
      toast({
        title: "Music generation requires API setup",
        description: "Connect ElevenLabs API to enable music generation.",
      });
    }, 2000);
  };

  // Animated bars for waveform visualization
  const WaveformBars = () => (
    <div className="flex items-end gap-0.5 h-16 justify-center">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-primary/30"
          style={{
            height: `${20 + Math.random() * 80}%`,
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex rounded-lg bg-secondary p-1 w-fit">
        <button
          onClick={() => setSubTab("voiceover")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            subTab === "voiceover" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <Mic className="h-4 w-4" /> Voiceover
        </button>
        <button
          onClick={() => setSubTab("music")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            subTab === "music" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <Music className="h-4 w-4" /> Background Music
        </button>
      </div>

      <div className="flex gap-6">
        {/* Left Controls */}
        <div className="w-2/5 space-y-5">
          {subTab === "voiceover" ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Script</label>
                <Textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Type your ad script or voiceover text here..."
                  rows={6}
                  className="resize-none"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{wordCount} words</span>
                  <span>~{estimatedDuration} estimated</span>
                </div>
              </div>

              {/* Voice Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Voice</label>
                <div className="grid grid-cols-2 gap-2">
                  {VOICES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVoice(v.id)}
                      className={`flex items-center gap-2 rounded-lg border p-3 text-xs font-medium transition-all ${
                        voice === v.id
                          ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                          : "border-border bg-card text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <span>{v.emoji}</span>
                      <span className="flex-1 text-left">{v.label}</span>
                      <Play className="h-3 w-3 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Speed */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Speed: {speed[0]}x</label>
                <Slider value={speed} onValueChange={setSpeed} min={0.75} max={1.5} step={0.05} />
              </div>

              <Button onClick={handleGenerateVoice} disabled={generatingVoice} className="w-full h-12" size="lg">
                <Mic className="mr-2 h-5 w-5" />
                {generatingVoice ? "Generating..." : "Generate Voiceover"}
              </Button>
            </>
          ) : (
            <>
              {/* Mood */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mood</label>
                <div className="grid grid-cols-3 gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMood(m.id)}
                      className={`rounded-lg border p-3 text-center text-xs font-medium transition-all ${
                        mood === m.id
                          ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                          : "border-border bg-card text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <div className="text-lg mb-1">{m.emoji}</div>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenre(g)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        genre === g
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Duration</label>
                <div className="flex gap-2">
                  {MUSIC_DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setMusicDuration(d)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                        musicDuration === d
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tempo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tempo</label>
                <div className="flex gap-2">
                  {TEMPOS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTempo(t)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                        tempo === t
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleGenerateMusic} disabled={generatingMusic} className="w-full h-12" size="lg">
                <Music className="mr-2 h-5 w-5" />
                {generatingMusic ? "Generating..." : "Generate Music"}
              </Button>
            </>
          )}
        </div>

        {/* Right Panel - Result */}
        <div className="flex-1 flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 min-h-[400px]">
          <div className="text-center w-full px-8">
            <WaveformBars />
            <Volume2 className="h-8 w-8 text-muted-foreground mx-auto mt-4 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              {subTab === "voiceover" ? "Generated voiceover" : "Generated music"} will play here
            </p>
            <p className="text-xs text-muted-foreground mt-1">Requires ElevenLabs API connection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTab;
