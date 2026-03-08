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
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 pb-6">
        <h1 className="text-2xl font-bold text-foreground">AI Studio</h1>
        {selectedCompany && (
          <p className="text-sm text-muted-foreground mt-1">{selectedCompany.name}</p>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="shrink-0 flex gap-1 rounded-lg bg-secondary p-1 w-fit mb-6">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
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
