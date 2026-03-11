import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ParticleCanvas from "@/components/ParticleCanvas";
import GrainOverlay from "@/components/GrainOverlay";
import CustomCursor from "@/components/CustomCursor";
import {
  Sparkles, ImageIcon, Film, Calendar, BarChart3, Building2, Mic, Star,
  ArrowRight, CheckCircle, Play
} from "lucide-react";
import { PLATFORMS } from "@/lib/platforms";

const FEATURES = [
  { icon: ImageIcon, title: "AI Image Generation", desc: "Create stunning visuals from text in seconds", badge: "Powered by Replicate SDXL" },
  { icon: Film, title: "AI Video Creation", desc: "Turn scripts into scroll-stopping video content", badge: "Runway ML Gen-3" },
  { icon: Calendar, title: "Smart Scheduling", desc: "Optimal posting times powered by engagement data", badge: "ML-powered" },
  { icon: BarChart3, title: "Deep Analytics", desc: "Track performance across all platforms in one view", badge: "Real-time data" },
  { icon: Building2, title: "Multi-Brand Management", desc: "Unlimited client companies with instant switching", badge: "Agency-ready" },
  { icon: Mic, title: "AI Audio & Avatars", desc: "Professional voiceovers and talking avatar videos", badge: "ElevenLabs + D-ID" },
];

const PRICING = [
  { name: "Free", price: "$0", period: "/mo", features: ["1 company", "3 platforms", "10 AI images/mo", "Basic analytics"], cta: "Get started free", popular: false },
  { name: "Pro", price: "$49", period: "/mo", features: ["3 companies", "All 8 platforms", "100 AI images + 10 videos/mo", "Full analytics"], cta: "Start Pro trial", popular: true },
  { name: "Agency", price: "$149", period: "/mo", features: ["Unlimited companies", "All 8 platforms", "Unlimited AI generation", "White-label + priority support"], cta: "Contact sales", popular: false },
];

const HomePage = () => {
  return (
    <div className="app-bg min-h-screen text-foreground" style={{ cursor: "none" }}>
      <ParticleCanvas />
      <GrainOverlay />
      <CustomCursor />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-[hsl(0_0%_100%/0.06)]" style={{ background: "hsl(280 33% 3% / 0.8)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">
              SocialForge <span className="gradient-text">AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#platforms" className="hover:text-foreground transition-colors">Platforms</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link to="/signup"><Button size="sm">Try for Free</Button></Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-8 animate-fade-in">
            <Sparkles className="h-3 w-3" /> Now with AI Video Generation
          </div>
          <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-display font-extrabold leading-tight animate-fade-in text-foreground">
            The AI-Powered Command Centre for{" "}
            <span className="gradient-text">Social Media Agencies</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "100ms" }}>
            Manage unlimited client brands, generate stunning AI content, and publish to 8 platforms — all from one dashboard.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Link to="/signup"><Button size="lg" className="text-base px-8">Start for Free — No credit card <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Button variant="outline" size="lg" className="text-base"><Play className="mr-2 h-4 w-4" /> Watch Demo</Button>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex -space-x-2">
              {["AK", "SJ", "MR", "TL"].map((initials) => (
                <div key={initials} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background gradient-primary text-[10px] font-bold text-primary-foreground">{initials}</div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}
            </div>
            <span>2,400+ agencies trust SocialForge</span>
          </div>

          {/* Platform logos */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            {PLATFORMS.map((p) => (
              <div key={p.key} className="card-glass flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground">
                <p.icon className="h-4 w-4" style={{ color: p.color }} />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">Everything you need to <span className="gradient-text">dominate social</span></h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Powerful AI tools, seamless scheduling, and deep analytics — built for agencies that move fast.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-glass card-glass-hover p-6 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary mb-4">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{f.badge}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Platforms */}
        <section id="platforms" className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">Every Platform. <span className="gradient-text">One Dashboard.</span></h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PLATFORMS.map((p) => (
              <div key={p.key} className="card-glass card-glass-hover flex flex-col items-center gap-3 p-6 text-center transition-all duration-300" style={{ ["--hover-color" as any]: p.color }}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${p.color}15` }}>
                  <p.icon className="h-7 w-7" style={{ color: p.color }} />
                </div>
                <span className="font-display font-semibold text-foreground">{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">Simple, <span className="gradient-text">transparent pricing.</span></h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PRICING.map((plan) => (
              <div key={plan.name} className={`card-glass p-8 transition-all duration-300 ${plan.popular ? "border-primary/40 glow-orange scale-105" : ""}`}>
                {plan.popular && <span className="mb-4 inline-block rounded-full gradient-primary px-3 py-1 text-xs font-bold text-primary-foreground">Most Popular</span>}
                <h3 className="text-xl font-display font-bold text-foreground">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-mono font-bold gradient-text">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button className="mt-8 w-full" variant={plan.popular ? "default" : "outline"}>{plan.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">Ready to <span className="gradient-text">10x your agency output?</span></h2>
          <p className="mt-4 text-muted-foreground">Join 2,400+ agencies already using SocialForge AI.</p>
          <Link to="/signup"><Button size="lg" className="mt-8 text-base px-10">Sign Up Free <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-[hsl(0_0%_100%/0.06)] py-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-display text-sm font-bold text-foreground">SocialForge <span className="gradient-text">AI</span></span>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 SocialForge AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
