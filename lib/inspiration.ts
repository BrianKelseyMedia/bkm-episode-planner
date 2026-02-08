export type InspirationVideo = {
  title: string;
  thumbnail: string; // absolute URL or /public path
  url: string;
  source: string; // e.g. "YouTube", "TikTok", "Instagram"
};

/**
 * NOTE:
 * This is a "curated mock" generator (no API calls).
 * Later, you can swap this function to real search (YouTube API, SerpAPI, etc.)
 * without touching the UI.
 */
const FALLBACK: InspirationVideo[] = [
  {
    title: "How to structure a strong hook in the first 7 seconds",
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80&auto=format&fit=crop",
    url: "https://www.youtube.com/results?search_query=podcast+hook+first+seconds",
    source: "YouTube",
  },
  {
    title: "Simple A/B testing of titles (and why most people get it wrong)",
    thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80&auto=format&fit=crop",
    url: "https://www.youtube.com/results?search_query=better+podcast+titles+ab+testing",
    source: "YouTube",
  },
  {
    title: "High-retention editing patterns you can copy this week",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop",
    url: "https://www.youtube.com/results?search_query=retention+editing+patterns+reels",
    source: "YouTube",
  },
];

function safeSlug(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "+");
}

export function getInspirationalVideosForEpisode(
  niche: string,
  episodeTitle: string
): InspirationVideo[] {
  const qNiche = safeSlug(niche);
  const qTitle = safeSlug(episodeTitle);

  // Build “search links” that feel real even without APIs.
  const youtubeQuery = `https://www.youtube.com/results?search_query=${qNiche}+${qTitle}+podcast`;
  const tiktokQuery = `https://www.tiktok.com/search?q=${qNiche}%20${qTitle}`;
  const instagramQuery = `https://www.instagram.com/explore/tags/${(niche || "podcast")
    .toLowerCase()
    .replace(/\s+/g, "")}/`;

  const generated: InspirationVideo[] = [
    {
      title: `Trending takes on: ${episodeTitle}`,
      thumbnail:
        "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=1200&q=80&auto=format&fit=crop",
      url: youtubeQuery,
      source: "YouTube",
    },
    {
      title: `Short-form formats people are copying in ${niche || "your niche"}`,
      thumbnail:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80&auto=format&fit=crop",
      url: tiktokQuery,
      source: "TikTok",
    },
    {
      title: `Visual style + thumbnails that work right now`,
      thumbnail:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80&auto=format&fit=crop",
      url: instagramQuery,
      source: "Instagram",
    },
  ];

  // If niche/title are empty, return a stable fallback.
  if (!niche?.trim() || !episodeTitle?.trim()) return FALLBACK;

  return generated;
}
