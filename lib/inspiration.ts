export type InspirationItem = {
  platform: "YouTube" | "TikTok" | "Instagram";
  title: string;
  url: string;
};

function buildSearchUrl(platform: InspirationItem["platform"], niche: string, topic: string) {
  const q = encodeURIComponent(`${niche} ${topic}`);
  if (platform === "YouTube") return `https://www.youtube.com/results?search_query=${q}`;
  if (platform === "TikTok") return `https://www.tiktok.com/search?q=${q}`;
  return `https://www.instagram.com/explore/tags/${encodeURIComponent(niche.replace(/\s+/g, ""))}/`;
}

export function getInspirationPack(niche: string, topic: string): InspirationItem[] {
  const n = (niche || "your niche").trim();
  const t = (topic || "topic").trim();

  return [
    {
      platform: "YouTube",
      title: `Top performing YouTube videos: ${t}`,
      url: buildSearchUrl("YouTube", n, t),
    },
    {
      platform: "TikTok",
      title: `Trending TikToks to model: ${t}`,
      url: buildSearchUrl("TikTok", n, t),
    },
    {
      platform: "Instagram",
      title: `High-performing Reels ideas for: ${n}`,
      url: buildSearchUrl("Instagram", n, t),
    },
  ];
}
