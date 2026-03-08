import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import AddCompanyModal from "@/components/AddCompanyModal";
import { useCompany } from "@/contexts/CompanyContext";

const AppLayout = () => {
  const { companies, loading } = useCompany();
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!loading && companies.length === 0) {
      setShowWelcome(true);
    }
  }, [loading, companies.length]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar onAddCompany={() => setShowAddCompany(true)} />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet context={{ onAddCompany: () => setShowAddCompany(true) }} />
      </main>
      <AddCompanyModal
        open={showAddCompany || showWelcome}
        onOpenChange={(open) => {
          setShowAddCompany(open);
          if (!open) setShowWelcome(false);
        }}
        isWelcome={showWelcome}
      />
    </div>
  );
};

export default AppLayout;
