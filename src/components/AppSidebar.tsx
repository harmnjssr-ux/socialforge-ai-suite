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
    <aside className="flex h-screen w-60 flex-col border-r border-sidebar-border bg-[hsl(var(--sidebar-background))]" style={{ boxShadow: '1px 0 20px hsl(243 95% 69% / 0.08)' }}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 pt-6 pb-4">
        <Sparkles className="h-5 w-5 text-primary glow-pulse" style={{ animation: 'glow-pulse 3s infinite' }} />
        <span className="font-display text-lg font-bold tracking-wide text-foreground">
          Social<span className="text-foreground">Forge</span>{" "}
          <span className="gradient-text">AI</span>
        </span>
      </div>

      {/* Company Selector */}
      <div className="px-3 pb-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-sm hover:bg-[hsl(0_0%_100%/0.06)] transition-all duration-150" style={{ background: 'hsl(0 0% 100% / 0.06)' }}>
            {selectedCompany?.logo_url ? (
              <img src={selectedCompany.logo_url} className="h-7 w-7 rounded-full object-cover" alt="" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground">
                {selectedCompany ? initials(selectedCompany.name) : "?"}
              </div>
            )}
            <span className="flex-1 truncate text-sm font-medium text-foreground">
              {selectedCompany?.name || "Select Company"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
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
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium tracking-[0.03em] transition-all duration-150 ${
                isActive
                  ? "bg-[hsl(243_95%_69%/0.15)] text-foreground border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-[hsl(0_0%_100%/0.05)] hover:text-foreground"
              }`}
              style={isActive ? { boxShadow: '0 0 12px hsl(243 95% 69% / 0.15)' } : {}}
            >
              <item.icon className={`h-[18px] w-[18px] shrink-0 transition-transform duration-150 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
              <span className="font-display">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-[hsl(0_0%_100%/0.06)] px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="gradient-primary text-[10px] font-bold text-primary-foreground">
              {user?.user_metadata?.full_name ? initials(user.user_metadata.full_name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-[13px] font-medium text-foreground">
              {user?.user_metadata?.full_name || "User"}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {user?.user_metadata?.agency_name || user?.email}
            </p>
          </div>
          <button onClick={signOut} className="rounded-md p-1.5 hover:bg-[hsl(0_0%_100%/0.06)] transition-colors text-muted-foreground hover:text-foreground" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
