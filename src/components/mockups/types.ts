export interface MockupProps {
  imageUrl: string | null;
  caption: string;
  username: string;
  hashtags: string;
}

export interface MockupConfig {
  key: string;
  name: string;
  dimensions: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export const MOCKUP_CONFIGS: MockupConfig[] = [
  { key: "instagram-feed", name: "Instagram Feed", dimensions: "1080 × 1080px", width: 1080, height: 1080, aspectRatio: "1/1" },
  { key: "instagram-story", name: "Instagram Story", dimensions: "1080 × 1920px", width: 1080, height: 1920, aspectRatio: "9/16" },
  { key: "instagram-reel", name: "Instagram Reel", dimensions: "1080 × 1920px", width: 1080, height: 1920, aspectRatio: "9/16" },
  { key: "facebook", name: "Facebook Post", dimensions: "1200 × 630px", width: 1200, height: 630, aspectRatio: "1.91/1" },
  { key: "youtube", name: "YouTube Thumbnail", dimensions: "1280 × 720px", width: 1280, height: 720, aspectRatio: "16/9" },
  { key: "tiktok", name: "TikTok Post", dimensions: "1080 × 1920px", width: 1080, height: 1920, aspectRatio: "9/16" },
  { key: "linkedin", name: "LinkedIn Post", dimensions: "1200 × 627px", width: 1200, height: 627, aspectRatio: "1.91/1" },
  { key: "twitter", name: "X (Twitter) Post", dimensions: "1200 × 675px", width: 1200, height: 675, aspectRatio: "16/9" },
];
