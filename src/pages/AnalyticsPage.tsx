import { useState, useMemo } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import { PLATFORMS } from "@/lib/platforms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell,
} from "recharts";
import {
  Users, FileText, TrendingUp, Eye, Sparkles, Award, Download, Info,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const RANGE_OPTIONS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E4405F", facebook: "#1877F2", youtube: "#FF0000",
  tiktok: "#000000", linkedin: "#0A66C2", twitter: "#14171A",
};

// Mock data generators
const generateFollowerGrowth = () => {
  const days = 30;
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      instagram: 12000 + Math.floor(Math.random() * 800 + i * 30),
      facebook: 8500 + Math.floor(Math.random() * 500 + i * 20),
      youtube: 5200 + Math.floor(Math.random() * 400 + i * 25),
      linkedin: 3100 + Math.floor(Math.random() * 300 + i * 15),
      tiktok: 9800 + Math.floor(Math.random() * 600 + i * 40),
      twitter: 4500 + Math.floor(Math.random() * 350 + i * 10),
    };
  });
};

const generatePostingFrequency = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((d) => ({
    day: d,
    instagram: Math.floor(Math.random() * 4 + 1),
    facebook: Math.floor(Math.random() * 3 + 1),
    youtube: Math.floor(Math.random() * 2),
    tiktok: Math.floor(Math.random() * 3 + 1),
    linkedin: Math.floor(Math.random() * 2 + 1),
    twitter: Math.floor(Math.random() * 5 + 2),
  }));
};

const generateEngagement = () =>
  Object.entries(PLATFORM_COLORS).map(([key, color]) => ({
    platform: PLATFORMS.find((p) => p.dbKey === key)?.name || key,
    rate: +(Math.random() * 5 + 1).toFixed(2),
    color,
  }));

const generateHeatmap = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 15 }, (_, i) => i + 8);
  return days.map((day) => ({
    day,
    hours: hours.map((h) => ({ hour: h, value: Math.random() })),
  }));
};

const generateTopPosts = () => [
  { id: 1, platform: "instagram", caption: "New product launch — check out our latest collection! 🚀", likes: 2481, comments: 187, reach: 45200, date: "Mar 5, 2026" },
  { id: 2, platform: "tiktok", caption: "Behind the scenes of our photoshoot 🎬", likes: 8923, comments: 412, reach: 128000, date: "Mar 3, 2026" },
  { id: 3, platform: "facebook", caption: "Thank you for 10K followers! Here's a special giveaway 🎁", likes: 1345, comments: 289, reach: 32100, date: "Mar 1, 2026" },
  { id: 4, platform: "linkedin", caption: "Our team just won the Innovation Award at Tech Summit 2026", likes: 892, comments: 67, reach: 18400, date: "Feb 28, 2026" },
  { id: 5, platform: "youtube", caption: "Full tutorial: Building your brand on social media", likes: 3201, comments: 156, reach: 67800, date: "Feb 25, 2026" },
];

const PLATFORM_STATS = [
  { key: "instagram", followers: "12.4K", growth: 4.2, posts: 24, engagement: 3.8 },
  { key: "facebook", followers: "8.9K", growth: 1.8, posts: 18, engagement: 2.1 },
  { key: "youtube", followers: "5.6K", growth: 6.1, posts: 8, engagement: 4.5 },
  { key: "tiktok", followers: "10.2K", growth: 12.3, posts: 32, engagement: 5.2 },
  { key: "linkedin", followers: "3.4K", growth: 2.9, posts: 12, engagement: 3.1 },
  { key: "twitter", followers: "4.8K", growth: -0.5, posts: 45, engagement: 1.9 },
];

const AnalyticsPage = () => {
  const { selectedCompany } = useCompany();
  const [range, setRange] = useState("30");
  const [platformFilter, setPlatformFilter] = useState("all");

  const followerData = useMemo(generateFollowerGrowth, [range]);
  const postingData = useMemo(generatePostingFrequency, [range]);
  const engagementData = useMemo(generateEngagement, [range]);
  const heatmapData = useMemo(generateHeatmap, [range]);
  const topPosts = useMemo(generateTopPosts, [range]);

  const metrics = [
    { label: "Total Followers", value: "44.3K", change: "+3.2%", up: true, icon: Users },
    { label: "Total Posts", value: "139", change: "+12", up: true, icon: FileText },
    { label: "Avg Engagement", value: "3.4%", change: "+0.6%", up: true, icon: TrendingUp },
    { label: "Total Reach", value: "291K", change: "+18%", up: true, icon: Eye },
    { label: "Content Generated", value: "47", change: "+8", up: true, icon: Sparkles },
    { label: "Best Platform", value: "TikTok", change: "5.2% eng.", up: true, icon: Award },
  ];

  const visiblePlatforms = platformFilter === "all"
    ? Object.keys(PLATFORM_COLORS)
    : [platformFilter];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          {selectedCompany && <p className="text-sm text-muted-foreground">{selectedCompany.name}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {RANGE_OPTIONS.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {PLATFORMS.slice(0, 6).map((p) => <SelectItem key={p.dbKey} value={p.dbKey}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export Report</Button>
        </div>
      </div>

      {/* Banner */}
      <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <Info className="h-5 w-5 text-primary shrink-0" />
        <p className="text-sm text-muted-foreground">Connect your platforms to see live data. Currently showing demo analytics.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <Card key={m.label} className="card-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <m.icon className="h-4 w-4 text-muted-foreground" />
                <span className={`flex items-center text-xs font-medium ${m.up ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                  {m.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {m.change}
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Follower Growth */}
        <Card className="card-shadow">
          <CardHeader className="pb-2"><CardTitle className="text-base">Follower Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={followerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {visiblePlatforms.map((key) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={PLATFORM_COLORS[key]} strokeWidth={2} dot={false} name={PLATFORMS.find((p) => p.dbKey === key)?.name || key} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Posting Frequency */}
        <Card className="card-shadow">
          <CardHeader className="pb-2"><CardTitle className="text-base">Posting Frequency</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={postingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {visiblePlatforms.map((key) => (
                  <Bar key={key} dataKey={key} fill={PLATFORM_COLORS[key]} radius={[2, 2, 0, 0]} name={PLATFORMS.find((p) => p.dbKey === key)?.name || key} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Engagement by Platform */}
        <Card className="card-shadow">
          <CardHeader className="pb-2"><CardTitle className="text-base">Engagement by Platform</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={engagementData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" unit="%" />
                <YAxis type="category" dataKey="platform" tick={{ fontSize: 11 }} width={80} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {engagementData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Best Posting Times Heatmap */}
        <Card className="card-shadow">
          <CardHeader className="pb-2"><CardTitle className="text-base">Best Posting Times</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex gap-1 ml-10">
                {Array.from({ length: 15 }, (_, i) => i + 8).map((h) => (
                  <div key={h} className="flex-1 text-center text-[9px] text-muted-foreground">
                    {h > 12 ? `${h - 12}p` : h === 12 ? "12p" : `${h}a`}
                  </div>
                ))}
              </div>
              {heatmapData.map((row) => (
                <div key={row.day} className="flex items-center gap-1">
                  <span className="w-10 text-xs text-muted-foreground text-right pr-1">{row.day}</span>
                  {row.hours.map((cell, i) => (
                    <div
                      key={i}
                      className="flex-1 aspect-square rounded-sm"
                      style={{ backgroundColor: `hsl(217 83% 51% / ${0.1 + cell.value * 0.8})` }}
                      title={`${row.day} ${cell.hour}:00 — ${(cell.value * 100).toFixed(0)}% engagement`}
                    />
                  ))}
                </div>
              ))}
              <div className="flex items-center justify-end gap-2 pt-2">
                <span className="text-[10px] text-muted-foreground">Low</span>
                <div className="flex gap-0.5">
                  {[0.15, 0.3, 0.5, 0.7, 0.9].map((v, i) => (
                    <div key={i} className="h-3 w-6 rounded-sm" style={{ backgroundColor: `hsl(217 83% 51% / ${v})` }} />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts Table */}
      <Card className="card-shadow">
        <CardHeader className="pb-2"><CardTitle className="text-base">Content Performance — Top Posts</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {topPosts.map((post) => {
              const platform = PLATFORMS.find((p) => p.dbKey === post.platform);
              return (
                <div key={post.id} className="flex items-center gap-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: `${PLATFORM_COLORS[post.platform]}15` }}>
                    {platform && <platform.icon className="h-5 w-5" style={{ color: PLATFORM_COLORS[post.platform] }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{post.caption}</p>
                    <p className="text-xs text-muted-foreground">{post.date}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
                    <span>❤ {post.likes.toLocaleString()}</span>
                    <span>💬 {post.comments}</span>
                    <span>👁 {post.reach.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Platform Breakdown</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_STATS.map((stat) => {
            const platform = PLATFORMS.find((p) => p.dbKey === stat.key);
            if (!platform) return null;
            return (
              <Card key={stat.key} className="card-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${PLATFORM_COLORS[stat.key]}15` }}>
                      <platform.icon className="h-5 w-5" style={{ color: PLATFORM_COLORS[stat.key] }} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{platform.name}</p>
                      <p className="text-xs text-muted-foreground">{stat.followers} followers</p>
                    </div>
                    <span className={`ml-auto flex items-center text-xs font-medium ${stat.growth >= 0 ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                      {stat.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(stat.growth)}%
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Posts</p>
                      <p className="text-lg font-semibold">{stat.posts}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <p className="text-lg font-semibold">{stat.engagement}%</p>
                    </div>
                  </div>
                  <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs">View Detailed Analytics →</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
