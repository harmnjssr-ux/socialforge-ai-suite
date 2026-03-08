import { Link, Globe, FileText, Calendar, Plus, Image, Video, Building2 } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";

const StatCard = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
  <div className="rounded-lg border bg-card p-5 card-shadow transition-shadow hover:card-shadow-hover">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold text-card-foreground">{value}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
  </div>
);

const QuickAction = ({ label, icon: Icon, onClick }: { label: string; icon: any; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-sm font-medium text-card-foreground card-shadow transition-all hover:card-shadow-hover hover:border-primary/30"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    {label}
  </button>
);

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
        <h1 className="text-2xl font-bold text-foreground">
          {selectedCompany ? `${selectedCompany.name} Dashboard` : "Dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">Overview of your social media performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Platforms Connected" value="0" icon={Globe} />
        <StatCard label="Posts This Month" value="0" icon={FileText} />
        <StatCard label="Content Generated" value="0" icon={FileText} />
        <StatCard label="Scheduled Posts" value="0" icon={Calendar} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickAction label="New Post" icon={Plus} />
          <QuickAction label="Generate Image" icon={Image} />
          <QuickAction label="Generate Video" icon={Video} />
          <QuickAction label="Add Company" icon={Building2} onClick={onAddCompany} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg border bg-card p-5 card-shadow">
          <h2 className="mb-4 text-lg font-semibold text-card-foreground">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-sm text-card-foreground">{item.text}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Posts */}
        <div className="rounded-lg border bg-card p-5 card-shadow">
          <h2 className="mb-4 text-lg font-semibold text-card-foreground">Upcoming Scheduled Posts</h2>
          <div className="space-y-3">
            {upcomingPosts.map((post, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.platform}</p>
                </div>
                <span className="text-xs font-medium text-primary">{post.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
