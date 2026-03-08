import { Home, Grid3X3, Sparkles, Image, Calendar, BarChart3, Settings, LogOut, ChevronDown, Plus } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { title: "Dashboard", path: "/", icon: Home },
  { title: "Social Media", path: "/social", icon: Grid3X3 },
  { title: "AI Studio", path: "/ai-studio", icon: Sparkles },
  { title: "Media Library", path: "/media", icon: Image },
  { title: "Scheduler", path: "/scheduler", icon: Calendar },
  { title: "Analytics", path: "/analytics", icon: BarChart3 },
  { title: "Settings", path: "/settings", icon: Settings },
];

interface AppSidebarProps {
  onAddCompany: () => void;
}

const AppSidebar = ({ onAddCompany }: AppSidebarProps) => {
  const { user, signOut } = useAuth();
  const { companies, selectedCompany, setSelectedCompany } = useCompany();
  const location = useLocation();

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <aside className="flex h-screen w-64 flex-col bg-navy text-navy-foreground">
      {/* Company Selector */}
      <div className="border-b border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md p-2 text-left text-sm hover:bg-navy-light transition-colors">
            {selectedCompany?.logo_url ? (
              <img src={selectedCompany.logo_url} className="h-8 w-8 rounded-md object-cover" alt="" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                {selectedCompany ? initials(selectedCompany.name) : "?"}
              </div>
            )}
            <div className="flex-1 truncate">
              <p className="truncate font-medium text-navy-foreground">
                {selectedCompany?.name || "Select Company"}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {companies.map((c) => (
              <DropdownMenuItem key={c.id} onClick={() => setSelectedCompany(c)}>
                <span className="truncate">{c.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onAddCompany}>
              <Plus className="mr-2 h-4 w-4" /> Add New Company
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-navy-light hover:text-navy-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {user?.user_metadata?.full_name ? initials(user.user_metadata.full_name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-navy-foreground">
              {user?.user_metadata?.full_name || "User"}
            </p>
            <p className="truncate text-xs text-sidebar-foreground">
              {user?.user_metadata?.agency_name || user?.email}
            </p>
          </div>
          <button onClick={signOut} className="rounded-md p-1.5 hover:bg-navy-light transition-colors" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
