export type InspirationPlatform = "youtube" | "tiktok" | "instagram";

export type InspirationItem = {
  id: string;
  platform: InspirationPlatform;
  title: string;
  creator: string;
  whyItWorks: string;
  url: string; // can be a platform search URL, or a specific link
};

export function makeInspirationQuery(niche: string, episodeTitle: string) {
  const q = `${niche} ${episodeTitle} tips`;
  return encodeURIComponent(q);
}

export function generateInspirations(args: {
  niche: string;
  episodeTitle: string;
  positioningAngle: string;
}): InspirationItem[] {
  const { niche, episodeTitle, positioningAngle } = args;
  const q = makeInspirationQuery(niche, episodeTitle);

  // These are “search URLs” by default (works everywhere, no scraping).
  const youtubeSearch = `https://www.youtube.com/results?search_query=${q}`;
  const tiktokSearch = `https://www.tiktok.com/search?q=${q}`;
  const instagramSearch = `https://www.instagram.com/explore/search/keyword/?q=${q}`;

  const seed = `${niche}|${episodeTitle}|${positioningAngle}`.length;

  const variants = [
    {
      platform: "youtube" as const,
      title: `3-minute breakdown: ${episodeTitle}`,
      creator: "Creator in your niche",
      whyItWorks:
        "Clear promise in the first 5 seconds, tight structure, and one punchy takeaway.",
      url: youtubeSearch,
    },
    {
      platform: "tiktok" as const,
      title: `Hot take hook: “Most people get this wrong…”`,
      creator: "Operator / practitioner",
      whyItWorks:
        "Starts with tension, uses fast examples, ends with a single behavior change.",
      url: tiktokSearch,
    },
    {
      platform: "instagram" as const,
      title: `Carousel-to-reel hybrid: the checklist version`,
      creator: "Authority account",
      whyItWorks:
        "Turns the episode into an easy-to-save format, perfect for repurposing.",
      url: instagramSearch,
    },
  ];

  // Tiny deterministic shuffle so episodes don’t all look identical
  const rotate = seed % variants.length;
  return [...variants.slice(rotate), ...variants.slice(0, rotate)].map((v) => ({
    ...v,
    id: `${v.platform}-${seed}-${Math.abs(seed * 97)}`,
  }));
}
