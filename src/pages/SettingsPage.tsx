import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany, Company } from "@/contexts/CompanyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { User, Building2, Key, Users, Bell, CreditCard, Save, Trash2, Plus, Eye, EyeOff, Check, X, Mail, Shield, Crown, Edit } from "lucide-react";

const SECTIONS = [
  { key: "profile", label: "Agency Profile", icon: User },
  { key: "companies", label: "Companies", icon: Building2 },
  { key: "apikeys", label: "API Keys", icon: Key },
  { key: "team", label: "Team Members", icon: Users },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "billing", label: "Billing", icon: CreditCard },
];

const TIMEZONES = ["UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney"];

const TEAM_MEMBERS = [
  { name: "Sarah Johnson", email: "sarah@agency.com", role: "Editor", avatar: "SJ" },
  { name: "Mike Chen", email: "mike@agency.com", role: "Viewer", avatar: "MC" },
];

const SettingsPage = () => {
  const { user } = useAuth();
  const { companies, selectedCompany, refetch } = useCompany();
  const [section, setSection] = useState("profile");
  const [agencyName, setAgencyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Company | null>(null);
  const [editName, setEditName] = useState("");
  const [editIndustry, setEditIndustry] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPrimary, setEditPrimary] = useState("");
  const [editSecondary, setEditSecondary] = useState("");
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({ replicate: "", runway: "", elevenlabs: "", did: "" });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [notifications, setNotifications] = useState({ postPublished: true, aiComplete: true, weeklyReport: false, failedPost: true });

  useEffect(() => { if (user) { setAgencyName(user.user_metadata?.agency_name || ""); setContactEmail(user.email || ""); } }, [user]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({ agency_name: agencyName, full_name: user?.user_metadata?.full_name || "" }).eq("user_id", user!.id);
    setSavingProfile(false);
    if (error) toast.error("Failed to save profile"); else toast.success("Profile saved");
  };

  const openEditCompany = (c: Company) => { setEditingCompany(c); setEditName(c.name); setEditIndustry(c.industry || ""); setEditWebsite(c.website || ""); setEditBio(c.bio || ""); setEditPrimary(c.brand_primary_color || "#6C63FF"); setEditSecondary(c.brand_secondary_color || "#00D4FF"); };

  const handleSaveCompany = async () => {
    if (!editingCompany) return;
    const { error } = await supabase.from("companies").update({ name: editName, industry: editIndustry, website: editWebsite, bio: editBio, brand_primary_color: editPrimary, brand_secondary_color: editSecondary }).eq("id", editingCompany.id);
    if (error) toast.error("Failed to update company"); else { toast.success("Company updated"); setEditingCompany(null); refetch(); }
  };

  const handleDeleteCompany = async () => {
    if (!deleteConfirm) return;
    const { error } = await supabase.from("companies").delete().eq("id", deleteConfirm.id);
    if (error) toast.error("Failed to delete"); else { toast.success("Company deleted"); setDeleteConfirm(null); refetch(); }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-[28px] font-display font-bold text-foreground mb-6">Settings</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <nav className="flex lg:w-56 lg:flex-col gap-1 overflow-x-auto lg:overflow-visible shrink-0">
          {SECTIONS.map((s) => (
            <button key={s.key} onClick={() => setSection(s.key)} className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-display font-medium transition-all duration-200 whitespace-nowrap", section === s.key ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:bg-[hsl(0_0%_100%/0.05)] hover:text-foreground")}>
              <s.icon className="h-4 w-4 shrink-0" /> {s.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0 space-y-6">
          {section === "profile" && (
            <Card>
              <CardHeader><CardTitle>Agency Profile</CardTitle><CardDescription>Manage your agency details</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div><label className="text-xs font-medium text-muted-foreground">Agency Name</label><Input className="mt-1.5" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Contact Email</label><Input className="mt-1.5" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Website</label><Input className="mt-1.5" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Timezone</label><Select value={timezone} onValueChange={setTimezone}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent>{TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <Button onClick={handleSaveProfile} disabled={savingProfile}><Save className="mr-1.5 h-4 w-4" /> {savingProfile ? "Saving..." : "Save Changes"}</Button>
              </CardContent>
            </Card>
          )}

          {section === "companies" && (
            <>
              <div className="flex items-center justify-between"><h2 className="text-lg font-display font-semibold text-foreground">Your Companies</h2><Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add New Company</Button></div>
              {companies.length === 0 ? (
                <Card><CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground"><Building2 className="mb-3 h-12 w-12 opacity-40" /><p className="font-medium">No companies yet</p><p className="text-sm">Add your first company to get started</p></CardContent></Card>
              ) : (
                <div className="space-y-3">
                  {companies.map((c) => (
                    <Card key={c.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary text-primary-foreground font-bold text-sm">{c.logo_url ? <img src={c.logo_url} className="h-12 w-12 rounded-lg object-cover" alt="" /> : c.name.slice(0, 2).toUpperCase()}</div>
                        <div className="flex-1 min-w-0"><p className="font-display font-medium text-foreground">{c.name}</p><p className="text-xs text-muted-foreground">{c.industry || "No industry"} · {c.website || "No website"}</p></div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditCompany(c)}><Edit className="mr-1 h-3.5 w-3.5" /> Edit</Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteConfirm(c)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              <Dialog open={!!editingCompany} onOpenChange={(o) => !o && setEditingCompany(null)}><DialogContent><DialogHeader><DialogTitle>Edit Company</DialogTitle></DialogHeader><div className="space-y-3"><div><label className="text-xs font-medium text-muted-foreground">Name</label><Input className="mt-1" value={editName} onChange={(e) => setEditName(e.target.value)} /></div><div><label className="text-xs font-medium text-muted-foreground">Industry</label><Input className="mt-1" value={editIndustry} onChange={(e) => setEditIndustry(e.target.value)} /></div><div><label className="text-xs font-medium text-muted-foreground">Website</label><Input className="mt-1" value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} /></div><div><label className="text-xs font-medium text-muted-foreground">Bio</label><Textarea className="mt-1" rows={2} value={editBio} onChange={(e) => setEditBio(e.target.value)} /></div><div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-medium text-muted-foreground">Primary Color</label><div className="mt-1 flex gap-2"><Input value={editPrimary} onChange={(e) => setEditPrimary(e.target.value)} /><input type="color" value={editPrimary} onChange={(e) => setEditPrimary(e.target.value)} className="h-10 w-10 rounded cursor-pointer" /></div></div><div><label className="text-xs font-medium text-muted-foreground">Secondary Color</label><div className="mt-1 flex gap-2"><Input value={editSecondary} onChange={(e) => setEditSecondary(e.target.value)} /><input type="color" value={editSecondary} onChange={(e) => setEditSecondary(e.target.value)} className="h-10 w-10 rounded cursor-pointer" /></div></div></div></div><DialogFooter><Button onClick={handleSaveCompany}>Save Changes</Button></DialogFooter></DialogContent></Dialog>
              <Dialog open={!!deleteConfirm} onOpenChange={(o) => !o && setDeleteConfirm(null)}><DialogContent><DialogHeader><DialogTitle>Delete Company</DialogTitle><DialogDescription>Are you sure? This will disconnect all social accounts for "{deleteConfirm?.name}" and delete all associated data.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button><Button variant="destructive" onClick={handleDeleteCompany}><Trash2 className="mr-1.5 h-4 w-4" /> Delete Company</Button></DialogFooter></DialogContent></Dialog>
            </>
          )}

          {section === "apikeys" && (
            <Card>
              <CardHeader><CardTitle>API Keys</CardTitle><CardDescription>Connect your AI service keys to unlock AI Studio features</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="card-glass p-3 text-sm text-muted-foreground" style={{ borderColor: 'hsl(243 95% 69% / 0.2)' }}><Key className="inline mr-2 h-4 w-4 text-primary" />Your API keys are stored securely and never shared.</div>
                {[{ key: "replicate", label: "Replicate API Key", desc: "For image generation" }, { key: "runway", label: "Runway ML API Key", desc: "For video generation" }, { key: "elevenlabs", label: "ElevenLabs API Key", desc: "For voiceover & music" }, { key: "did", label: "D-ID API Key", desc: "For AI avatars" }].map((item) => (
                  <div key={item.key} className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">{item.label} <span className="text-[10px]">— {item.desc}</span></label>
                    <div className="flex gap-2">
                      <div className="relative flex-1"><Input type={showKeys[item.key] ? "text" : "password"} placeholder={`Enter your ${item.label}...`} value={apiKeys[item.key]} onChange={(e) => setApiKeys((prev) => ({ ...prev, [item.key]: e.target.value }))} /><button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowKeys((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}>{showKeys[item.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                      <Button variant="outline" size="sm" onClick={() => toast.info("Connection test — feature coming soon")}>Test</Button>
                    </div>
                  </div>
                ))}
                <Button onClick={() => toast.success("API keys saved securely")}><Save className="mr-1.5 h-4 w-4" /> Save Keys</Button>
              </CardContent>
            </Card>
          )}

          {section === "team" && (
            <Card>
              <CardHeader><div className="flex items-center justify-between"><div><CardTitle>Team Members</CardTitle><CardDescription>Manage your team access</CardDescription></div><Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Invite Member</Button></div></CardHeader>
              <CardContent>
                <div className="divide-y divide-[hsl(0_0%_100%/0.06)]">
                  <div className="flex items-center gap-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">{user?.user_metadata?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "U"}</div>
                    <div className="flex-1"><p className="text-sm font-medium text-foreground">{user?.user_metadata?.full_name || "You"}</p><p className="text-xs text-muted-foreground">{user?.email}</p></div>
                    <Badge className="bg-warning/10 text-warning border-warning/30"><Crown className="mr-1 h-3 w-3" /> Admin</Badge>
                  </div>
                  {TEAM_MEMBERS.map((m) => (
                    <div key={m.email} className="flex items-center gap-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">{m.avatar}</div>
                      <div className="flex-1"><p className="text-sm font-medium text-foreground">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></div>
                      <Badge variant="outline">{m.role}</Badge>
                      <Button size="icon" variant="ghost" className="h-8 w-8"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {section === "notifications" && (
            <Card>
              <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Choose what you want to be notified about</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {[{ key: "postPublished" as const, label: "Email me when a post is published", desc: "Get notified after successful publication" }, { key: "aiComplete" as const, label: "Email me when AI generation completes", desc: "Get notified when images, videos, or audio are ready" }, { key: "weeklyReport" as const, label: "Weekly performance report", desc: "Receive a summary email every Monday" }, { key: "failedPost" as const, label: "Failed post alerts", desc: "Get immediately notified if a scheduled post fails" }].map((item) => (
                  <div key={item.key} className="card-glass flex items-center justify-between p-4">
                    <div><p className="text-sm font-medium text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch checked={notifications[item.key]} onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))} />
                  </div>
                ))}
                <Button onClick={() => toast.success("Notification preferences saved")}><Save className="mr-1.5 h-4 w-4" /> Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {section === "billing" && (
            <Card>
              <CardHeader><CardTitle>Billing</CardTitle><CardDescription>Manage your subscription and usage</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="card-glass p-5" style={{ borderColor: 'hsl(243 95% 69% / 0.3)' }}>
                  <div className="flex items-center justify-between">
                    <div><Badge className="mb-2 gradient-primary">Current Plan</Badge><h3 className="text-xl font-display font-bold text-foreground">Starter Plan</h3><p className="text-muted-foreground">$49/month · Renews April 8, 2026</p></div>
                    <Button>Upgrade Plan</Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-display font-semibold mb-3 text-foreground">Usage This Month</h4>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[{ label: "Posts Published", value: "47 / 100", pct: 47 }, { label: "AI Images", value: "23 / 50", pct: 46 }, { label: "AI Videos", value: "5 / 10", pct: 50 }, { label: "Storage Used", value: "1.2 GB / 5 GB", pct: 24 }].map((u) => (
                      <div key={u.label} className="space-y-2"><p className="text-xs text-muted-foreground">{u.label}</p><p className="text-sm font-mono-stat font-medium text-foreground">{u.value}</p><div className="h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${u.pct}%` }} /></div></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
