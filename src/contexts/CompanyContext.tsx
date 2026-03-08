import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface Company {
  id: string;
  user_id: string;
  name: string;
  logo_url: string | null;
  industry: string | null;
  website: string | null;
  brand_primary_color: string | null;
  brand_secondary_color: string | null;
  brand_font: string | null;
  bio: string | null;
  created_at: string;
}

interface CompanyContextType {
  companies: Company[];
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
  loading: boolean;
  refetch: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType>({
  companies: [],
  selectedCompany: null,
  setSelectedCompany: () => {},
  loading: true,
  refetch: async () => {},
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    if (!user) {
      setCompanies([]);
      setSelectedCompany(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });
    
    const list = (data as Company[]) || [];
    setCompanies(list);
    if (!selectedCompany && list.length > 0) {
      setSelectedCompany(list[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, [user]);

  return (
    <CompanyContext.Provider
      value={{ companies, selectedCompany, setSelectedCompany, loading, refetch: fetchCompanies }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
