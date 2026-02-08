export type InspirationItem = {
  id: string;
  platform: "YouTube" | "TikTok" | "Instagram";
  title: string;
  creator?: string;
  reason: string;
  thumbnail: string; // local placeholder image or remote later
};

function makeId(seed: string) {
  return seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

/**
 * Simple “starter pack” inspiration results.
 * (No web calls; safe + fast; you can upgrade later to API searches.)
 */
export function getInspirationForEpisode(params: {
  niche: string;
  episodeTitle: string;
}): InspirationItem[] {
  const niche = (params.niche || "your niche").trim();
  const t = (params.episodeTitle || "this topic").trim();

  const base: Omit<InspirationItem, "id">[] = [
    {
      platform: "YouTube",
      title: `High-performing explainer: ${t}`,
      creator: "Format idea",
      reason: `Long-form clarity + strong structure for ${niche}.`,
      thumbnail: "/globe.svg",
    },
    {
      platform: "TikTok",
      title: `Fast hook + pattern interrupt for ${t}`,
      creator: "Hook idea",
      reason: `Short punchy opener you can remix into reels for ${niche}.`,
      thumbnail: "/window.svg",
    },
    {
      platform: "Instagram",
      title: `Carousel-style breakdown: ${t}`,
      creator: "Breakdown idea",
      reason: `Turns the episode into a saveable post for ${niche}.`,
      thumbnail: "/file.svg",
    },
  ];

  return base.map((x) => ({ ...x, id: makeId(`${x.platform}-${x.title}`) }));
}
