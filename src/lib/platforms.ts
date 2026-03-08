import { Instagram, Facebook, Youtube, Twitter, Linkedin, Camera, Ghost, Pin } from "lucide-react";

export interface PlatformInfo {
  key: string;
  name: string;
  dbKey: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<any>;
  charLimit: number;
}

export const PLATFORMS: PlatformInfo[] = [
  { key: "instagram", name: "Instagram", dbKey: "instagram", color: "#E4405F", bgColor: "bg-[#E4405F]/10", icon: Instagram, charLimit: 2200 },
  { key: "facebook", name: "Facebook", dbKey: "facebook", color: "#1877F2", bgColor: "bg-[#1877F2]/10", icon: Facebook, charLimit: 63206 },
  { key: "youtube", name: "YouTube", dbKey: "youtube", color: "#FF0000", bgColor: "bg-[#FF0000]/10", icon: Youtube, charLimit: 5000 },
  { key: "tiktok", name: "TikTok", dbKey: "tiktok", color: "#000000", bgColor: "bg-[#000]/10", icon: Camera, charLimit: 2200 },
  { key: "linkedin", name: "LinkedIn", dbKey: "linkedin", color: "#0A66C2", bgColor: "bg-[#0A66C2]/10", icon: Linkedin, charLimit: 3000 },
  { key: "twitter", name: "X (Twitter)", dbKey: "twitter", color: "#000000", bgColor: "bg-[#000]/10", icon: Twitter, charLimit: 280 },
  { key: "pinterest", name: "Pinterest", dbKey: "pinterest", color: "#E60023", bgColor: "bg-[#E60023]/10", icon: Pin, charLimit: 500 },
  { key: "snapchat", name: "Snapchat", dbKey: "snapchat", color: "#FFFC00", bgColor: "bg-[#FFFC00]/10", icon: Ghost, charLimit: 250 },
];

export const getPlatform = (key: string) => PLATFORMS.find((p) => p.dbKey === key || p.key === key);
