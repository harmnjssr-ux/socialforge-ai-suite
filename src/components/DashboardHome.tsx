import { Link, Globe, FileText, Calendar, Plus, Image, Video, Building2 } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";

const statColors = ["hsl(243 95% 69%)", "hsl(191 100% 50%)", "hsl(340 85% 60%)", "hsl(160 100% 50%)"];

const StatCard = ({ label, value, icon: Icon, colorIndex }: { label: string; value: string; icon: any; colorIndex: number }) => (
  <div className="card-glass card-glass-hover shimmer-card relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-[3px]">
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-[32px] font-mono-stat font-bold gradient-text">{value}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${statColors[colorIndex]}15` }}>
        <Icon className="h-5 w-5" style={{ color: statColors[colorIndex] }} />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${statColors[colorIndex]}, transparent)` }} />
  </div>
);

const QuickAction = ({ label, icon: Icon, onClick }: { label: string; icon: any; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="card-glass card-glass-hover flex flex-col items-center gap-3 p-5 text-sm font-display font-medium text-foreground transition-all duration-200 hover:-translate-y-[3px]"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
      <Icon className="h-5 w-5 text-primary-foreground" />
    </div>
    {label}
  </button>
);

const activityColors = ["hsl(243 95% 69%)", "hsl(191 100% 50%)", "hsl(160 100% 50%)", "hsl(243 95% 69%)", "hsl(340 85% 60%)"];

const recentActivity = [
  { text: "Created new Instagram post for campaign", time: "2 hours ago" },
  { text: "Generated AI content for blog article", time: "4 hours ago" },
  { text: "Scheduled 3 posts for next week", time: "Yesterday" },
  { text: "Connected Facebook page", time: "2 days ago" },
  { text: "Updated brand colors", time: "3 days ago" },
];

const upcomingPosts = [
  { title: "Product Launch Announcement", platform: "Instagram", date: "Mar 10, 2026" },
  { title: "Weekly Tips & Tricks", platform: "Twitter", date: "Mar 11, 2026" },
  { title: "Behind the Scenes Video", platform: "TikTok", date: "Mar 12, 2026" },
];

interface DashboardHomeProps {
  onAddCompany: () => void;
}

const DashboardHome = ({ onAddCompany }: DashboardHomeProps) => {
  const { selectedCompany } = useCompany();

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-[28px] font-display font-bold text-foreground">
          {selectedCompany ? `${selectedCompany.name} Dashboard` : "Dashboard"}
        </h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <span className="inline-block h-2 w-2 rounded-full bg-success pulse-dot" />
          Live • Overview of your social media performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Platforms Connected" value="0" icon={Globe} colorIndex={0} />
        <StatCard label="Posts This Month" value="0" icon={FileText} colorIndex={1} />
        <StatCard label="Content Generated" value="0" icon={FileText} colorIndex={2} />
        <StatCard label="Scheduled Posts" value="0" icon={Calendar} colorIndex={3} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-lg font-display font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickAction label="New Post" icon={Plus} />
          <QuickAction label="Generate Image" icon={Image} />
          <QuickAction label="Generate Video" icon={Video} />
          <QuickAction label="Add Company" icon={Building2} onClick={onAddCompany} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="card-glass p-5">
          <h2 className="mb-4 text-[15px] font-display font-semibold text-foreground">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-[hsl(0_0%_100%/0.04)] pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: activityColors[i] }} />
                  <p className="text-sm text-foreground">{item.text}</p>
                </div>
                <span className="shrink-0 text-xs font-mono-stat text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Posts */}
        <div className="card-glass p-5">
          <h2 className="mb-4 text-[15px] font-display font-semibold text-foreground">Upcoming Scheduled Posts</h2>
          <div className="space-y-3">
            {upcomingPosts.map((post, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-[hsl(0_0%_100%/0.06)] p-3 hover:border-primary/30 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.platform}</p>
                </div>
                <span className="text-xs font-mono-stat gradient-text">{post.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
