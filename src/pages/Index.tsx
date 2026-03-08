import { useOutletContext } from "react-router-dom";
import DashboardHome from "@/components/DashboardHome";

const Index = () => {
  const { onAddCompany } = useOutletContext<{ onAddCompany: () => void }>();
  return <DashboardHome onAddCompany={onAddCompany} />;
};

export default Index;
