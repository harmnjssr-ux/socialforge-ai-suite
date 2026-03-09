import { useState } from "react";
import { ImageIcon, Film, Mic, User } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import ImageTab from "@/components/ai-studio/ImageTab";
import VideoTab from "@/components/ai-studio/VideoTab";
import AudioTab from "@/components/ai-studio/AudioTab";
import AvatarTab from "@/components/ai-studio/AvatarTab";

const TABS = [
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "videos", label: "Videos", icon: Film },
  { id: "audio", label: "Audio", icon: Mic },
  { id: "avatars", label: "Avatars", icon: User },
] as const;

type TabId = (typeof TABS)[number]["id"];

const AIStudioPage = () => {
  const { selectedCompany } = useCompany();
  const [activeTab, setActiveTab] = useState<TabId>("images");

  return (
    <div className="flex h-full flex-col animate-fade-in">
      {/* Header */}
      <div className="shrink-0 pb-6">
        <h1 className="text-[28px] font-display font-bold text-foreground">AI Studio</h1>
        {selectedCompany && (
          <p className="text-sm text-muted-foreground mt-1">{selectedCompany.name}</p>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="shrink-0 flex gap-1 rounded-xl bg-secondary/50 p-1 w-fit mb-6 border border-[hsl(0_0%_100%/0.06)]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-display font-medium transition-all duration-200 ${
                isActive
                  ? "text-foreground relative"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 transition-transform duration-150 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-[2px] gradient-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0">
        {activeTab === "images" && <ImageTab />}
        {activeTab === "videos" && <VideoTab />}
        {activeTab === "audio" && <AudioTab />}
        {activeTab === "avatars" && <AvatarTab />}
      </div>
    </div>
  );
};

export default AIStudioPage;
