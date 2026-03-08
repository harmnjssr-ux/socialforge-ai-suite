import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

const industries = ["Restaurant", "Retail", "Real Estate", "Healthcare", "Fitness", "Beauty", "Technology", "Other"];

interface AddCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isWelcome?: boolean;
}

const AddCompanyModal = ({ open, onOpenChange, isWelcome }: AddCompanyModalProps) => {
  const { user } = useAuth();
  const { refetch, setSelectedCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    industry: "",
    website: "",
    brand_primary_color: "#1A73E8",
    brand_secondary_color: "#0F1F3D",
    bio: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    let logo_url: string | null = null;
    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("company-logos").upload(path, logoFile);
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from("company-logos").getPublicUrl(path);
        logo_url = urlData.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from("companies")
      .insert({
        user_id: user.id,
        name: form.name,
        industry: form.industry || null,
        website: form.website || null,
        brand_primary_color: form.brand_primary_color,
        brand_secondary_color: form.brand_secondary_color,
        bio: form.bio || null,
        logo_url,
      })
      .select()
      .single();

    setLoading(false);
    if (error) {
      toast.error("Failed to add company");
    } else {
      toast.success("Company added!");
      await refetch();
      if (data) setSelectedCompany(data as any);
      onOpenChange(false);
      setForm({ name: "", industry: "", website: "", brand_primary_color: "#1A73E8", brand_secondary_color: "#0F1F3D", bio: "" });
      setLogoFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isWelcome ? "Welcome to SocialForge AI — Let's add your first client" : "Add New Company"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Company Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
              <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
              <SelectContent>
                {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Brand Color</Label>
              <div className="flex gap-2">
                <input type="color" value={form.brand_primary_color} onChange={(e) => setForm({ ...form, brand_primary_color: e.target.value })} className="h-10 w-10 cursor-pointer rounded border-0" />
                <Input value={form.brand_primary_color} onChange={(e) => setForm({ ...form, brand_primary_color: e.target.value })} className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Brand Color</Label>
              <div className="flex gap-2">
                <input type="color" value={form.brand_secondary_color} onChange={(e) => setForm({ ...form, brand_secondary_color: e.target.value })} className="h-10 w-10 cursor-pointer rounded border-0" />
                <Input value={form.brand_secondary_color} onChange={(e) => setForm({ ...form, brand_secondary_color: e.target.value })} className="flex-1" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Brief description of the company…" rows={3} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving…" : "Add Company"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyModal;
