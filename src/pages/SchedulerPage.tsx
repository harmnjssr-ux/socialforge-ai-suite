import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/contexts/CompanyContext";
import { getPlatform, PLATFORMS } from "@/lib/platforms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday, addMonths, subMonths, setHours, setMinutes } from "date-fns";
import {
  CalendarIcon, ChevronLeft, ChevronRight, Plus, List, Clock, Edit, Copy, Trash2, Send, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduledPost {
  id: string;
  company_id: string;
  platform: string;
  content_type: string;
  media_url: string | null;
  caption: string | null;
  hashtags: string | null;
  scheduled_at: string;
  status: string;
  created_at: string;
}

type ViewMode = "month" | "week" | "list";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-primary/10 text-primary",
  published: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
  failed: "bg-destructive/10 text-destructive",
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E4405F",
  facebook: "#1877F2",
  youtube: "#FF0000",
  tiktok: "#000000",
  linkedin: "#0A66C2",
  twitter: "#14171A",
  pinterest: "#E60023",
  snapchat: "#FFFC00",
};

const BEST_TIMES: Record<string, string> = {
  instagram: "11:00 AM & 7:00 PM",
  facebook: "1:00 PM & 4:00 PM",
  youtube: "2:00 PM & 5:00 PM",
  tiktok: "7:00 AM & 10:00 PM",
  linkedin: "8:00 AM & 12:00 PM",
  twitter: "9:00 AM & 6:00 PM",
};

const SchedulerPage = () => {
  const { selectedCompany } = useCompany();
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  // Composer state
  const [newPlatform, setNewPlatform] = useState("instagram");
  const [newCaption, setNewCaption] = useState("");
  const [newHashtags, setNewHashtags] = useState("");
  const [newDate, setNewDate] = useState<Date | undefined>(new Date());
  const [newTime, setNewTime] = useState("12:00");
  const [newStatus, setNewStatus] = useState("scheduled");

  const fetchPosts = useCallback(async () => {
    if (!selectedCompany) return;
    setLoading(true);
    const { data } = await supabase
      .from("scheduled_posts")
      .select("*")
      .eq("company_id", selectedCompany.id)
      .order("scheduled_at", { ascending: true });
    setPosts((data as ScheduledPost[]) || []);
    setLoading(false);
  }, [selectedCompany]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openNewPost = (date?: Date) => {
    setEditingPost(null);
    setNewPlatform("instagram");
    setNewCaption("");
    setNewHashtags("");
    setNewDate(date || new Date());
    setNewTime("12:00");
    setNewStatus("scheduled");
    setComposerOpen(true);
  };

  const openEditPost = (post: ScheduledPost) => {
    setEditingPost(post);
    setNewPlatform(post.platform);
    setNewCaption(post.caption || "");
    setNewHashtags(post.hashtags || "");
    const d = new Date(post.scheduled_at);
    setNewDate(d);
    setNewTime(format(d, "HH:mm"));
    setNewStatus(post.status);
    setComposerOpen(true);
  };

  const handleSave = async () => {
    if (!selectedCompany || !newDate) return;
    const [h, m] = newTime.split(":").map(Number);
    const scheduledAt = setMinutes(setHours(newDate, h), m).toISOString();

    if (editingPost) {
      const { error } = await supabase.from("scheduled_posts").update({
        platform: newPlatform, caption: newCaption, hashtags: newHashtags,
        scheduled_at: scheduledAt, status: newStatus,
      }).eq("id", editingPost.id);
      if (error) toast.error("Failed to update"); else toast.success("Post updated");
    } else {
      const { error } = await supabase.from("scheduled_posts").insert({
        company_id: selectedCompany.id, platform: newPlatform,
        caption: newCaption, hashtags: newHashtags,
        scheduled_at: scheduledAt, status: newStatus,
      });
      if (error) toast.error("Failed to create"); else toast.success("Post scheduled");
    }
    setComposerOpen(false);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("scheduled_posts").delete().eq("id", id);
    toast.success("Post deleted");
    fetchPosts();
  };

  const handleDuplicate = async (post: ScheduledPost) => {
    if (!selectedCompany) return;
    await supabase.from("scheduled_posts").insert({
      company_id: selectedCompany.id, platform: post.platform,
      caption: post.caption, hashtags: post.hashtags,
      scheduled_at: post.scheduled_at, status: "draft",
    });
    toast.success("Post duplicated");
    fetchPosts();
  };

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const filteredPosts = posts.filter((p) => platformFilter === "all" || p.platform === platformFilter);

  const getPostsForDay = (day: Date) => filteredPosts.filter((p) => isSameDay(new Date(p.scheduled_at), day));

  // Stats
  const now = new Date();
  const thisWeekPosts = posts.filter((p) => {
    const d = new Date(p.scheduled_at);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    return d >= weekStart && d <= weekEnd;
  });
  const thisMonthPosts = posts.filter((p) => isSameMonth(new Date(p.scheduled_at), now));
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => { counts[p.platform] = (counts[p.platform] || 0) + 1; });
    return counts;
  }, [posts]);
  const maxPlatformCount = Math.max(1, ...Object.values(platformCounts));
  const upcoming24h = posts.filter((p) => {
    const d = new Date(p.scheduled_at);
    return d > now && d.getTime() - now.getTime() < 86400000 && p.status === "scheduled";
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Scheduler</h1>
          {selectedCompany && <p className="text-sm text-muted-foreground">{selectedCompany.name}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-md border border-input p-0.5">
            {(["month", "week", "list"] as ViewMode[]).map((v) => (
              <Button key={v} size="sm" variant={viewMode === v ? "default" : "ghost"} onClick={() => setViewMode(v)} className="capitalize">
                {v === "list" ? <List className="mr-1 h-3.5 w-3.5" /> : <CalendarIcon className="mr-1 h-3.5 w-3.5" />}
                {v}
              </Button>
            ))}
          </div>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {PLATFORMS.map((p) => <SelectItem key={p.dbKey} value={p.dbKey}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => openNewPost()}><Plus className="mr-1.5 h-4 w-4" /> New Post</Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Month navigation */}
          {viewMode !== "list" && (
            <div className="mb-4 flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="h-5 w-5" /></Button>
              <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="h-5 w-5" /></Button>
            </div>
          )}

          {/* Month View */}
          {viewMode === "month" && (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="grid grid-cols-7 border-b border-border">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((day) => {
                  const dayPosts = getPostsForDay(day);
                  const inMonth = isSameMonth(day, currentMonth);
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "min-h-[100px] border-b border-r border-border p-1.5 cursor-pointer hover:bg-accent/30 transition-colors",
                        !inMonth && "opacity-40",
                        isToday(day) && "bg-primary/5"
                      )}
                      onClick={() => openNewPost(day)}
                    >
                      <p className={cn("text-xs font-medium mb-1", isToday(day) ? "text-primary font-bold" : "text-foreground")}>
                        {format(day, "d")}
                      </p>
                      <div className="space-y-0.5">
                        {dayPosts.slice(0, 3).map((post) => (
                          <Popover key={post.id}>
                            <PopoverTrigger asChild>
                              <div
                                className="flex items-center gap-1 rounded px-1 py-0.5 text-[10px] cursor-pointer hover:opacity-80 truncate"
                                style={{ backgroundColor: `${PLATFORM_COLORS[post.platform] || "#666"}20`, color: PLATFORM_COLORS[post.platform] || "#666" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: PLATFORM_COLORS[post.platform] }} />
                                <span className="truncate">{post.caption?.slice(0, 20) || getPlatform(post.platform)?.name}</span>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-3" align="start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[post.platform] }} />
                                  <span className="font-medium text-sm">{getPlatform(post.platform)?.name}</span>
                                  <Badge className={cn("ml-auto text-[10px]", STATUS_COLORS[post.status])}>{post.status}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{post.caption || "No caption"}</p>
                                <p className="text-[10px] text-muted-foreground"><Clock className="inline mr-1 h-3 w-3" />{format(new Date(post.scheduled_at), "MMM d, h:mm a")}</p>
                                <div className="flex gap-1.5 pt-1">
                                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => openEditPost(post)}><Edit className="mr-1 h-3 w-3" />Edit</Button>
                                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleDuplicate(post)}><Copy className="mr-1 h-3 w-3" />Dup</Button>
                                  <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => handleDelete(post.id)}><Trash2 className="h-3 w-3" /></Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        ))}
                        {dayPosts.length > 3 && <p className="text-[10px] text-muted-foreground pl-1">+{dayPosts.length - 3} more</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Week View */}
          {viewMode === "week" && (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              {(() => {
                const weekStart = startOfWeek(currentMonth, { weekStartsOn: 1 });
                const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, { weekStartsOn: 1 }) });
                const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8am-10pm
                return (
                  <>
                    <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
                      <div className="p-2 text-xs text-muted-foreground" />
                      {weekDays.map((d) => (
                        <div key={d.toISOString()} className={cn("p-2 text-center border-l border-border", isToday(d) && "bg-primary/5")}>
                          <p className="text-xs text-muted-foreground">{format(d, "EEE")}</p>
                          <p className={cn("text-sm font-medium", isToday(d) && "text-primary")}>{format(d, "d")}</p>
                        </div>
                      ))}
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                      {hours.map((hour) => (
                        <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
                          <div className="p-1 text-right text-[10px] text-muted-foreground pr-2">{hour > 12 ? `${hour - 12}PM` : hour === 12 ? "12PM" : `${hour}AM`}</div>
                          {weekDays.map((d) => {
                            const dayPosts = filteredPosts.filter((p) => {
                              const pd = new Date(p.scheduled_at);
                              return isSameDay(pd, d) && pd.getHours() === hour;
                            });
                            return (
                              <div key={d.toISOString()} className="min-h-[40px] border-l border-border p-0.5 cursor-pointer hover:bg-accent/20" onClick={() => openNewPost(setHours(d, hour))}>
                                {dayPosts.map((post) => (
                                  <div
                                    key={post.id}
                                    className="rounded px-1 py-0.5 text-[10px] text-white truncate cursor-pointer mb-0.5"
                                    style={{ backgroundColor: PLATFORM_COLORS[post.platform] || "#666" }}
                                    onClick={(e) => { e.stopPropagation(); openEditPost(post); }}
                                  >
                                    {post.caption?.slice(0, 15) || getPlatform(post.platform)?.name}
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="rounded-lg border border-border bg-card">
              {filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <CalendarIcon className="mb-3 h-12 w-12 opacity-40" />
                  <p className="font-medium">No scheduled posts</p>
                  <p className="text-sm">Create your first post to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredPosts.map((post) => {
                    const platform = getPlatform(post.platform);
                    return (
                      <div key={post.id} className="flex items-center gap-4 p-4 hover:bg-accent/20 transition-colors">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${PLATFORM_COLORS[post.platform]}15` }}>
                          {platform && <platform.icon className="h-5 w-5" style={{ color: PLATFORM_COLORS[post.platform] }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{post.caption || "No caption"}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(post.scheduled_at), "MMM d, yyyy 'at' h:mm a")}</p>
                        </div>
                        <Badge className={cn("text-xs", STATUS_COLORS[post.status])}>{post.status}</Badge>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditPost(post)}><Edit className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDuplicate(post)}><Copy className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(post.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8"><Send className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-[260px] shrink-0 space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold">Overview</h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">This Week</span>
              <span className="font-medium">{thisWeekPosts.length} posts</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-medium">{thisMonthPosts.length} posts</span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold">By Platform</h3>
            {PLATFORMS.slice(0, 6).map((p) => (
              <div key={p.dbKey} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{p.name}</span>
                  <span>{platformCounts[p.dbKey] || 0}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${((platformCounts[p.dbKey] || 0) / maxPlatformCount) * 100}%`, backgroundColor: p.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><Clock className="h-4 w-4" /> Upcoming 24h</h3>
            {upcoming24h.length === 0 ? (
              <p className="text-xs text-muted-foreground">No posts in the next 24 hours</p>
            ) : (
              upcoming24h.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center gap-2 cursor-pointer" onClick={() => openEditPost(post)}>
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: PLATFORM_COLORS[post.platform] }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs truncate">{post.caption?.slice(0, 30) || getPlatform(post.platform)?.name}</p>
                    <p className="text-[10px] text-muted-foreground">{format(new Date(post.scheduled_at), "h:mm a")}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Schedule Post Composer */}
      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Scheduled Post" : "Schedule New Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Platform */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Platform</label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {PLATFORMS.map((p) => (
                  <Button
                    key={p.dbKey} size="sm" variant={newPlatform === p.dbKey ? "default" : "outline"}
                    onClick={() => setNewPlatform(p.dbKey)}
                    style={newPlatform === p.dbKey ? { backgroundColor: p.color, borderColor: p.color } : {}}
                  >
                    <p.icon className="mr-1 h-3.5 w-3.5" /> {p.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Caption</label>
              <Textarea className="mt-1.5" rows={3} placeholder="Write your post caption..." value={newCaption} onChange={(e) => setNewCaption(e.target.value)} />
              <p className="mt-1 text-xs text-muted-foreground">{newCaption.length} / {getPlatform(newPlatform)?.charLimit || 2200}</p>
            </div>

            {/* Hashtags */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Hashtags</label>
              <Input className="mt-1.5" placeholder="#marketing #social" value={newHashtags} onChange={(e) => setNewHashtags(e.target.value)} />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="mt-1.5 w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDate ? format(newDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={newDate} onSelect={setNewDate} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Time</label>
                <Input type="time" className="mt-1.5" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              </div>
            </div>

            {/* Best time suggestion */}
            {BEST_TIMES[newPlatform] && (
              <div className="rounded-md bg-primary/5 p-2.5 text-xs">
                <span className="font-medium text-primary">💡 Best time to post on {getPlatform(newPlatform)?.name}:</span>{" "}
                <span className="text-muted-foreground">{BEST_TIMES[newPlatform]}</span>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={handleSave}>
                {editingPost ? "Update Post" : "Schedule Post"}
              </Button>
              <Button variant="outline" onClick={() => setComposerOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulerPage;
