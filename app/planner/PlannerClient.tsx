"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getInspirationPack, type InspirationItem } from "@/lib/inspiration";

type EpisodeWeek = {
  week: number;
  title: string;
  audienceTrigger: string;
  positioningAngle: string;
  hostCredibilityMoment: string;
  guestArchetype: string;
  distributionPlay: {
    verticalHook: string;
    linkedinAngle: string;
    newsletterAngle: string;
  };
  strategicOutcome: string;
  inspiration: InspirationItem[];
  savedInspiration: InspirationItem[];
};

const BUY_URL = "https://planner.briankelseymedia.com/planner?paid=1"; // swap this later to your real checkout URL

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function buildWeeks(showName: string, niche: string): EpisodeWeek[] {
  const baseTopics = [
    "The belief your audience has that’s costing them money",
    "The hidden risk nobody talks about (until it’s too late)",
    "What most people do wrong in the first 30 days",
    "The simple framework that makes decisions easier",
    "The mistake that looks smart on paper",
    "How to create momentum when you’re starting from zero",
    "The truth behind the ‘quick win’ myth",
    "The one metric that actually matters",
    "How to handle objections without sounding salesy",
    "The behind-the-scenes process that creates results",
    "The ‘hard conversation’ your audience is avoiding",
    "Your audience’s next-level play (the upgrade path)",
  ];

  return Array.from({ length: 12 }).map((_, i) => {
    const week = i + 1;
    const topic = baseTopics[i] ?? `Week ${week} topic`;
    const inspiration = getInspirationPack(niche, topic);

    return {
      week,
      title: `${topic}`,
      audienceTrigger: `Your ${niche} audience is stuck because they’re assuming the “obvious” move is the safe move — and that’s exactly where they lose time/money.`,
      positioningAngle: `Take the contrarian producer angle: “Here’s what actually works in the real world (and why the common advice fails).”`,
      hostCredibilityMoment: `Insert a quick Brian moment: a story from a real shoot / client conversation / what you’ve seen across founders and professionals — one specific example that proves you’ve been in the arena.`,
      guestArchetype: `A ${niche} operator who lived through this (not a generic expert) — someone who has scars + receipts.`,
      distributionPlay: {
        verticalHook: `“If you’re in ${niche}, stop doing this one thing…”`,
        linkedinAngle: `A short “myth vs reality” post: what people believe, why it’s tempting, and what actually works.`,
        newsletterAngle: `A quick 5-minute breakdown: the mistake, the fix, and a simple checklist.`,
      },
      strategicOutcome: `Trust + repositioning (you become the person who sees around corners).`,
      inspiration,
      savedInspiration: [],
    };
  });
}

function weekToText(w: EpisodeWeek) {
  return [
    `Week ${w.week}: ${w.title}`,
    ``,
    `1) Audience trigger`,
    `- ${w.audienceTrigger}`,
    ``,
    `2) Positioning angle`,
    `- ${w.positioningAngle}`,
    ``,
    `3) Host credibility moment`,
    `- ${w.hostCredibilityMoment}`,
    ``,
    `4) Guest suggestion (archetype)`,
    `- ${w.guestArchetype}`,
    ``,
    `5) Distribution play`,
    `- Vertical hook: ${w.distributionPlay.verticalHook}`,
    `- LinkedIn angle: ${w.distributionPlay.linkedinAngle}`,
    `- Newsletter angle: ${w.distributionPlay.newsletterAngle}`,
    ``,
    `6) Strategic outcome`,
    `- ${w.strategicOutcome}`,
    ``,
    `Trending / inspirational videos in your niche (saved)`,
    ...(w.savedInspiration.length
      ? w.savedInspiration.map((x) => `- ${x.title} (${x.platform}) — ${x.url}`)
      : [`- (none saved yet)`]),
  ].join("\n");
}

export default function PlannerClient() {
  const searchParams = useSearchParams();
  const paid = searchParams?.get("paid") === "1";

  const visibleWeeksCount = paid ? 12 : 3;

  const [showName, setShowName] = useState("");
  const [niche, setNiche] = useState("");
  const [weeks, setWeeks] = useState<EpisodeWeek[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<"idle" | "ok">("idle");

  const visibleWeeks = useMemo(() => {
    if (!weeks) return [];
    return weeks.slice(0, visibleWeeksCount);
  }, [weeks, visibleWeeksCount]);

  const handleGenerate = async () => {
    setCopied("idle");
    setIsGenerating(true);

    // tiny delay to make it feel intentional
    await new Promise((r) => setTimeout(r, 250));

    const built = buildWeeks(showName.trim() || "Your show", niche.trim() || "your niche");
    setWeeks(built);
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    if (!weeks) return;

    const toCopy = (paid ? weeks : weeks.slice(0, 3))
      .map((w) => weekToText(w))
      .join("\n\n" + "-".repeat(40) + "\n\n");

    await navigator.clipboard.writeText(toCopy);
    setCopied("ok");
    setTimeout(() => setCopied("idle"), 1500);
  };

  const saveInspirationToWeek = (weekNumber: number, item: InspirationItem) => {
    setWeeks((prev) => {
      if (!prev) return prev;
      return prev.map((w) => {
        if (w.week !== weekNumber) return w;
        const already = w.savedInspiration.some((x) => x.url === item.url);
        if (already) return w;
        return { ...w, savedInspiration: [...w.savedInspiration, item] };
      });
    });
  };

  return (
    <div className={cx("mx-auto max-w-6xl px-6", paid ? "py-10" : "py-14")}>
      {/* Header */}
      <div className={cx("grid gap-10", paid ? "md:grid-cols-2" : "md:grid-cols-2")}>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Episode Planner
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
            Welcome to your episode planner.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
            This generates a 12-week plan as <span className="font-semibold text-white">Authority Episode Briefs</span>{" "}
            (strategy, positioning, guest archetypes, distribution plays, plus inspiration you can save to each episode).
          </p>

          {/* Demo note (removed entirely in paid mode) */}
          {!paid && (
            <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-white/85">
              Demo preview shows <span className="font-semibold text-white">Weeks 1–3</span>.
              <span className="text-white/70"> Unlock to export the full 12 weeks.</span>
            </div>
          )}
        </div>

        <div className="md:justify-self-end">
          {/* Replace with your existing assets paths if different */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3">
            <img
              src="/brian.jpg"
              alt="Brian Kelsey"
              className="h-[360px] w-[420px] rounded-2xl object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <img src="/logo.png" alt="Brian Kelsey Media" className="h-10 w-10 rounded-lg object-contain" />
            <div className="text-sm text-white/70">
              <div className="font-semibold text-white">Brian Kelsey Media</div>
              <div>Premium video strategy + production</div>
            </div>
          </div>
        </div>
      </div>

      {/* Input + actions */}
      <div className={cx("mt-10 rounded-3xl border border-white/10 bg-white/5 p-6", paid ? "md:p-7" : "md:p-8")}>
        <div className="grid gap-4 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <label className="text-sm text-white/70">Show name</label>
            <input
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              placeholder="e.g., The Dental Growth Playbook"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/30"
            />
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-white/70">Niche / audience</label>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., dentists, founders, realtors"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/30"
            />
          </div>

          <div className="md:col-span-3 flex gap-3 md:justify-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={cx(
                "rounded-2xl px-5 py-3 font-semibold",
                "bg-amber-500 text-black",
                "disabled:opacity-60"
              )}
            >
              {paid ? "Generate my 12-week plan" : "Generate my 3-month plan (demo)"}
            </button>

            <button
              onClick={handleCopy}
              disabled={!weeks}
              className={cx(
                "rounded-2xl px-5 py-3 font-semibold",
                "border border-white/15 bg-white/5 text-white",
                !weeks && "opacity-40"
              )}
            >
              {copied === "ok" ? "Copied" : "Copy plan"}
            </button>
          </div>
        </div>

        {/* “Empty space” filler when no plan yet */}
        {!weeks && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm font-semibold text-white">What you’ll get</div>
              <div className="mt-2 text-sm text-white/70">
                A real producer-style episode plan that feels intentional and premium — not random topics.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm font-semibold text-white">Built for authority</div>
              <div className="mt-2 text-sm text-white/70">
                Each week includes a positioning angle + a credibility moment so your show builds trust fast.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm font-semibold text-white">Distribution baked in</div>
              <div className="mt-2 text-sm text-white/70">
                Every episode comes with a vertical hook, a LinkedIn angle, and a newsletter angle.
              </div>
            </div>
          </div>
        )}

        {/* Paid CTA removed entirely in paid mode */}
        {!paid && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
            <div className="text-sm text-white/70">
              Want the full version? Unlock all 12 weeks + save inspiration videos to each episode.
            </div>
            <a href={BUY_URL} className="rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-black">
              Unlock all 12 weeks ($29)
            </a>
          </div>
        )}
      </div>

      {/* Weeks */}
      {weeks && (
        <div className="mt-10 space-y-6">
          {visibleWeeks.map((w) => (
            <div key={w.week} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-white/60">Week {w.week}</div>
                  <div className="mt-1 text-2xl font-semibold">{w.title}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold">Audience trigger</div>
                  <div className="mt-2 text-sm text-white/70">{w.audienceTrigger}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold">Positioning angle</div>
                  <div className="mt-2 text-sm text-white/70">{w.positioningAngle}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold">Host credibility moment</div>
                  <div className="mt-2 text-sm text-white/70">{w.hostCredibilityMoment}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold">Guest archetype</div>
                  <div className="mt-2 text-sm text-white/70">{w.guestArchetype}</div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold">Distribution play</div>
                <div className="mt-2 grid gap-2 text-sm text-white/70 md:grid-cols-3">
                  <div>
                    <div className="text-white/60">Vertical hook</div>
                    <div>{w.distributionPlay.verticalHook}</div>
                  </div>
                  <div>
                    <div className="text-white/60">LinkedIn angle</div>
                    <div>{w.distributionPlay.linkedinAngle}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Newsletter angle</div>
                    <div>{w.distributionPlay.newsletterAngle}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold">Strategic outcome</div>
                <div className="mt-2 text-sm text-white/70">{w.strategicOutcome}</div>
              </div>

              {/* Trending / inspirational videos */}
              <div className="mt-6">
                <div className="text-sm font-semibold">Trending / inspirational videos in your niche</div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {w.inspiration.map((item) => (
                    <div key={item.url} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs text-white/60">{item.platform}</div>
                      <div className="mt-1 text-sm font-semibold">{item.title}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold"
                        >
                          Open
                        </a>
                        <button
                          onClick={() => saveInspirationToWeek(w.week, item)}
                          className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-black"
                        >
                          Save to this episode
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {w.savedInspiration.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-sm font-semibold">Saved to Week {w.week}</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
                      {w.savedInspiration.map((s) => (
                        <li key={s.url}>
                          {s.title}{" "}
                          <span className="text-white/50">({s.platform})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Demo unlock line directly under week 3 */}
              {!paid && w.week === 3 && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                  <div className="text-sm text-white/75">
                    Want Weeks 4–12 + the full export? Unlock the full planner below.
                  </div>
                  <div className="mt-3">
                    <a href={BUY_URL} className="inline-flex rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-black">
                      Unlock all 12 weeks ($29)
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
