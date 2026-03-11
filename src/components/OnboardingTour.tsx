import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Building2, Grid3X3, Wand2, Rocket } from "lucide-react";

interface OnboardingTourProps { open: boolean; onOpenChange: (open: boolean) => void; onAddCompany: () => void; }

const STEPS = [
  { icon: Sparkles, title: "Welcome to SocialForge AI", description: "Your all-in-one social media management platform powered by AI. Manage multiple brands, create stunning content, and schedule posts — all from one place.", highlights: ["Social Media Management", "AI Content Studio", "Smart Scheduling"] },
  { icon: Building2, title: "Add Your First Client", description: "Start by adding a company or brand. Each company gets its own social accounts, media library, and analytics dashboard.", highlights: ["Brand colors & identity", "Multiple companies", "Separate workspaces"] },
  { icon: Grid3X3, title: "Connect Social Media", description: "Link Instagram, Facebook, YouTube, TikTok, LinkedIn, X, Pinterest, and Snapchat. Manage all platforms from a single dashboard.", highlights: ["8 platforms supported", "Real-time status", "One-click posting"] },
  { icon: Wand2, title: "Create AI Content", description: "Use the AI Studio to generate images, videos, voiceovers, and even AI avatar spokespersons — tailored to your brand.", highlights: ["AI image generation", "Video creation", "Voiceover & music"] },
  { icon: Rocket, title: "You're Ready!", description: "You're all set to supercharge your social media workflow. Let's start by adding your first company.", highlights: [] },
];

const OnboardingTour = ({ open, onOpenChange, onAddCompany }: OnboardingTourProps) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleFinish = () => { onOpenChange(false); setStep(0); if (isLast) onAddCompany(); };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onOpenChange(false); setStep(0); } }}>
      <DialogContent className="max-w-md p-0 overflow-hidden card-glass border-[hsl(0_0%_100%/0.1)]">
        <div className="flex justify-center gap-1.5 pt-6">
          {STEPS.map((_, i) => (<div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 gradient-primary" : "w-1.5 bg-secondary"}`} />))}
        </div>
        <div className="flex flex-col items-center px-8 pb-8 pt-4 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary glow-orange">
            <current.icon className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">{current.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{current.description}</p>
          {current.highlights.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {current.highlights.map((h) => (<span key={h} className="rounded-full bg-primary/15 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">{h}</span>))}
            </div>
          )}
          <div className="mt-6 flex w-full gap-3">
            {step > 0 && <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>Back</Button>}
            {isLast ? (<Button className="flex-1" onClick={handleFinish}><Building2 className="mr-1.5 h-4 w-4" /> Add My First Company</Button>) : (<Button className="flex-1" onClick={() => setStep(step + 1)}>{step === 0 ? "Get Started" : "Next"}</Button>)}
          </div>
          {!isLast && (<button onClick={() => { onOpenChange(false); setStep(0); }} className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors">Skip tour</button>)}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTour;
