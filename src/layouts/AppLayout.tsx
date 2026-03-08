import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import AddCompanyModal from "@/components/AddCompanyModal";
import OnboardingTour from "@/components/OnboardingTour";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/social": "Social Media",
  "/ai-studio": "AI Studio",
  "/media": "Media Library",
  "/scheduler": "Scheduler",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

const AppLayout = () => {
  const { companies, loading } = useCompany();
  const { user } = useAuth();
  const location = useLocation();
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update page title
  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] || "SocialForge AI";
    document.title = `${title} — SocialForge AI`;
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  // Onboarding check
  useEffect(() => {
    if (!loading && companies.length === 0 && user) {
      // Check if onboarding was dismissed
      const dismissed = localStorage.getItem(`onboarding_dismissed_${user.id}`);
      if (!dismissed) {
        setShowOnboarding(true);
      } else {
        setShowWelcome(true);
      }
    }
  }, [loading, companies.length, user]);

  const handleDismissOnboarding = (open: boolean) => {
    setShowOnboarding(open);
    if (!open && user) {
      localStorage.setItem(`onboarding_dismissed_${user.id}`, "true");
      if (companies.length === 0) setShowWelcome(true);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar onAddCompany={() => setShowAddCompany(true)} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-10 h-full w-64 animate-fade-in">
            <AppSidebar onAddCompany={() => { setShowAddCompany(true); setMobileMenuOpen(false); }} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-foreground">{PAGE_TITLES[location.pathname] || "SocialForge AI"}</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet context={{ onAddCompany: () => setShowAddCompany(true) }} />
        </main>
      </div>

      <AddCompanyModal
        open={showAddCompany || showWelcome}
        onOpenChange={(open) => {
          setShowAddCompany(open);
          if (!open) setShowWelcome(false);
        }}
        isWelcome={showWelcome}
      />

      <OnboardingTour
        open={showOnboarding}
        onOpenChange={handleDismissOnboarding}
        onAddCompany={() => { setShowOnboarding(false); setShowAddCompany(true); }}
      />
    </div>
  );
};

export default AppLayout;
