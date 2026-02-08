"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  generateInspirations,
  InspirationItem,
  InspirationPlatform,
} from "@/lib/inspiration";

const CHECKOUT_URL = "https://buy.stripe.com/fZu9AS9lG2Pt6IQdQLdAk0f";

type EpisodeBrief = {
  week: number;
  title: string;

  audienceTrigger: string;
  positioningAngle: string;
  hostCredibilityMoment: string;

  guestArchetype: string;
  whyThisGuestStrengthensAuthority: string;

  distribution: {
    verticalHook: string;
    linkedinAngle: string;
    newsletterAngle: string;
  };

  strategicOutcome: string;

  inspirationsSaved: InspirationItem[];
};

type MonthStrategy = {
  month: number;
  name: string;
  perceptionShift: string;
  beliefToReplace: string;
  brandMessageToInstall: string;
};

function platformLabel(p: InspirationPlatform) {
  if (p === "youtube") return "YouTube";
  if (p === "tiktok") return "TikTok";
  return "Instagram";
}

function PlatformLogo({ platform }: { platform: InspirationPlatform }) {
  // Simple inline “logo badges” so it’s not a wall of identical thumbnails.
  const common =
    "inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] w-14 h-14";
  if (platform === "youtube") {
    return (
      <div className={common} aria-label="YouTube">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          className="opacity-90"
        >
          <path
            d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.5 12 4.5 12 4.5s-5.7 0-7.5.6A3 3 0 0 0 2.4 7.2 31.6 31.6 0 0 0 2 12a31.6 31.6 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.6 7.5.6 7.5.6s5.7 0 7.5-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 22 12a31.6 31.6 0 0 0-.4-4.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M10 15.2V8.8L15.5 12 10 15.2Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }
  if (platform === "tiktok") {
    return (
      <div className={common} aria-label="TikTok">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          className="opacity-90"
        >
          <path
            d="M14 4v10.2a4 4 0 1 1-3-3.9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M14 4c1.2 3.3 3.4 4.8 6 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className={common} aria-label="Instagram">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        className="opacity-90"
      >
        <rect
          x="6"
          y="6"
          width="12"
          height="12"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M10.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M16.2 8.2h.01"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function clampText(s: string, max = 240) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function loadSavedState(): {
  niche: string;
  showName: string;
  episodes: EpisodeBrief[];
} | null {
  try {
    const raw = localStorage.getItem("bkm_episode_planner_state_v2");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state: {
  niche: string;
  showName: string;
  episodes: EpisodeBrief[];
}) {
  try {
    localStorage.setItem("bkm_episode_planner_state_v2", JSON.stringify(state));
  } catch {
    // ignore
  }
}

function buildMonthStrategies(niche: string, showName: string): MonthStrategy[] {
  return [
    {
      month: 1,
      name: "Authority foundation",
      perceptionShift: `Move ${niche} from “content” to “trusted advisor guidance.”`,
      beliefToReplace: `Replace “I should post more” with “I should build a repeatable POV.”`,
      brandMessageToInstall: `${showName} is a weekly lens that simplifies decisions and upgrades judgment.`,
    },
    {
      month: 2,
      name: "Objection removal + differentiation",
      perceptionShift: `Position you as the calm operator who has seen the patterns.`,
      beliefToReplace: `Replace “all options are equal” with “there’s a smart sequence to this.”`,
      brandMessageToInstall: `Your take is different because it’s built from real work, not theory.`,
    },
    {
      month: 3,
      name: "Demand + momentum",
      perceptionShift: `Make the show feel like the “weekly briefing” people don’t want to miss.`,
      beliefToReplace: `Replace “I’ll figure it out later” with “I need a plan now.”`,
      brandMessageToInstall: `You’re the guide who helps people choose, act, and win.`,
    },
  ];
}

function buildEpisodes(niche: string, showName: string): EpisodeBrief[] {
  // A simple deterministic set so it feels consistent and premium.
  // You can later swap this generator for something more advanced.
  const baseTitles = [
    "The hidden mistake most people make",
    "The 3-part system that saves time",
    "The checklist you can use immediately",
    "What to stop doing this week",
    "The decision framework that prevents regrets",
    "How to raise the standard without burning out",
    "The biggest risk nobody is pricing in",
    "What high performers do differently",
    "How to simplify without losing quality",
    "The playbook for consistent results",
    "The exact sequence that removes friction",
    "The “authority move” that changes outcomes",
  ];

  return baseTitles.map((t, i) => {
    const week = i + 1;
    const title = `${t} in ${niche}`;

    const positioningAngle =
      week % 3 === 1
        ? `The producer/operator lens: what actually works in the real world (and why the “tips” version fails).`
        : week % 3 === 2
        ? `The “sequence” angle: the order matters more than the tactics.`
        : `The “standard” angle: raise quality, reduce noise, and make your audience trust you faster.`;

    const audienceTrigger =
      week % 3 === 1
        ? `Your audience is stuck doing what “looks right” but feels exhausting and produces tiny gains.`
        : week % 3 === 2
        ? `Your audience knows what to do in theory, but they’re missing the order that makes it work.`
        : `Your audience is overwhelmed by options and wants a confident, premium path forward.`;

    const hostCredibilityMoment =
      `Share a specific moment from your work where you saw this pattern up close (client, studio, production, or operator experience). Then name the lesson in one sentence.`;

    const guestArchetype =
      week % 4 === 0
        ? `A managing partner / founder who rebuilt after a high-stakes reset`
        : week % 4 === 1
        ? `A COO / operator who installed a system that scaled`
        : week % 4 === 2
        ? `An investor / buyer who sees deals die for this reason`
        : `A senior marketer who has shipped weekly content without quality loss`;

    const whyGuestStrengthensAuthority =
      `This guest makes you look like the connector + the strategist: you’re the person who can extract the playbook, not just host a chat.`;

    const distribution = {
      verticalHook:
        `Hook: “If you’re doing ${niche} and it still feels chaotic… it’s because you’re missing THIS.”`,
      linkedinAngle:
        `Write a short post that reframes a common assumption in ${niche} and gives a 3-bullet “better way.”`,
      newsletterAngle:
        `Subject: “The part everyone skips in ${niche} (and why it costs them time).”`,
    };

    const strategicOutcome =
      week <= 4
        ? `Trust + clarity (make your audience feel “finally, someone gets it”).`
        : week <= 8
        ? `Repositioning + objection removal (your way feels safer, smarter, premium).`
        : `Authority proof + demand (people start thinking “we should talk”).`;

    return {
      week,
      title,
      audienceTrigger,
      positioningAngle,
      hostCredibilityMoment,
      guestArchetype,
      whyThisGuestStrengthensAuthority: whyGuestStrengthensAuthority,
      distribution,
      strategicOutcome,
      inspirationsSaved: [],
    };
  });
}

function formatPlanForCopy(args: {
  paid: boolean;
  showName: string;
  niche: string;
  monthStrategies: MonthStrategy[];
  episodes: EpisodeBrief[];
  maxWeeks: number;
}) {
  const { paid, showName, niche, monthStrategies, episodes, maxWeeks } = args;

  const header = [
    `${showName} — 12-Week Episode Planner`,
    `Niche: ${niche}`,
    paid ? "" : "NOTE: Demo export (Weeks 1–3 only)",
    "",
    "SHOW POSITIONING SNAPSHOT",
    `• Show promise: A premium, repeatable weekly briefing for ${niche}.`,
    `• NOT for: People looking for quick hacks without consistency.`,
    `• Competes with: Random “tips” content.`,
    `• Creates a new category: Authority Episode Briefs (strategy + distribution baked in).`,
    "",
    "MONTH STRATEGY",
    ...monthStrategies.map((m) => {
      return [
        `Month ${m.month}: ${m.name}`,
        `• Perception shift: ${m.perceptionShift}`,
        `• Belief to replace: ${m.beliefToReplace}`,
        `• Message to install: ${m.brandMessageToInstall}`,
        "",
      ].join("\n");
    }),
  ].join("\n");

  const weekLines: string[] = [];
  for (const ep of episodes.slice(0, maxWeeks)) {
    weekLines.push(
      [
        `WEEK ${ep.week}: ${ep.title}`,
        `Audience trigger: ${ep.audienceTrigger}`,
        `Positioning angle: ${ep.positioningAngle}`,
        `Host credibility moment: ${ep.hostCredibilityMoment}`,
        `Guest archetype: ${ep.guestArchetype}`,
        `Why this guest strengthens authority: ${ep.whyThisGuestStrengthensAuthority}`,
        `Distribution play:`,
        `  • Vertical hook: ${ep.distribution.verticalHook}`,
        `  • LinkedIn angle: ${ep.distribution.linkedinAngle}`,
        `  • Newsletter angle: ${ep.distribution.newsletterAngle}`,
        `Strategic outcome: ${ep.strategicOutcome}`,
        ep.inspirationsSaved.length
          ? `Trending / inspirational videos saved:\n${ep.inspirationsSaved
              .map(
                (x) =>
                  `  • [${platformLabel(x.platform)}] ${x.title} — ${x.creator} (${x.url})`
              )
              .join("\n")}`
          : `Trending / inspirational videos saved: (none yet)`,
        "",
      ].join("\n")
    );
  }

  if (!paid) {
    weekLines.push(
      [
        "— — —",
        "Unlock Weeks 4–12:",
        "planner.briankelseymedia.com/planner?paid=1",
      ].join("\n")
    );
  }

  return `${header}\n\nWEEKLY AUTHORITY EPISODE BRIEFS\n\n${weekLines.join("\n")}`.trim();
}

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function PlannerClient({ paid }: { paid: boolean }) {
  const isDemo = !paid;
  const maxWeeksVisible = isDemo ? 3 : 12;

  const [showName, setShowName] = useState("Your Show");
  const [niche, setNiche] = useState("your niche");
  const [episodes, setEpisodes] = useState<EpisodeBrief[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const monthStrategies = useMemo(
    () => buildMonthStrategies(niche, showName),
    [niche, showName]
  );

  // Load state
  useEffect(() => {
    const saved = loadSavedState();
    if (saved?.episodes?.length) {
      setShowName(saved.showName || "Your Show");
      setNiche(saved.niche || "your niche");
      setEpisodes(saved.episodes);
      setHasGenerated(true);
    } else {
      // Default seed for first view
      setEpisodes(buildEpisodes("your niche", "Your Show"));
      setHasGenerated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state
  useEffect(() => {
    if (!episodes.length) return;
    saveState({ showName, niche, episodes });
  }, [showName, niche, episodes]);

  function generatePlan() {
    const next = buildEpisodes(niche.trim() || "your niche", showName.trim() || "Your Show");
    setEpisodes(next);
    setHasGenerated(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function copyPlan() {
    const text = formatPlanForCopy({
      paid,
      showName,
      niche,
      monthStrategies,
      episodes,
      maxWeeks: maxWeeksVisible,
    });

    try {
      await navigator.clipboard.writeText(text);
      alert(isDemo ? "Copied demo plan (Weeks 1–3)." : "Copied full plan (12 weeks).");
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert(isDemo ? "Copied demo plan (Weeks 1–3)." : "Copied full plan (12 weeks).");
    }
  }

  function addInspirationToEpisode(week: number, item: InspirationItem) {
    setEpisodes((prev) =>
      prev.map((ep) => {
        if (ep.week !== week) return ep;
        const already = ep.inspirationsSaved.some((x) => x.id === item.id);
        if (already) return ep;
        return { ...ep, inspirationsSaved: [item, ...ep.inspirationsSaved].slice(0, 12) };
      })
    );
  }

  function removeInspirationFromEpisode(week: number, id: string) {
    setEpisodes((prev) =>
      prev.map((ep) => {
        if (ep.week !== week) return ep;
        return {
          ...ep,
          inspirationsSaved: ep.inspirationsSaved.filter((x) => x.id !== id),
        };
      })
    );
  }

  const containerPad = paid ? "py-10" : "py-14";
  const cardPad = paid ? "p-6" : "p-7";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.10),transparent_60%)]" />

      {/* Top bar */}
      <header className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/bkm-logo.png"
              alt="Brian Kelsey Media"
              width={260}
              height={80}
              className="h-11 w-auto"
              priority
            />
            <span className="hidden sm:block text-sm font-medium text-zinc-300">
              Premium video strategy + production
            </span>
          </div>

          <div className="flex items-center gap-3">
            {paid ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Full version
              </div>
            ) : (
              <>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Back home
                </Link>
                <Link
                  href={CHECKOUT_URL}
                  className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition"
                >
                  Unlock all 12 weeks ($29)
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className={classNames("relative mx-auto max-w-6xl px-6", containerPad)}>
        {/* Planner welcome header */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Episode Planner
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Welcome to your episode planner.
            </h1>

            <p className="mt-4 text-zinc-300 max-w-2xl">
              This generates a 12-week plan as{" "}
              <span className="text-white font-semibold">Authority Episode Briefs</span>{" "}
              (strategy, positioning, guest archetypes, and distribution plays baked in).
            </p>

            {!paid && (
              <div className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-100">
                Demo mode shows Weeks 1–3. Unlock to export and use Weeks 4–12.
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-3">
              <Image
                src="/bkm-hero.png"
                alt="Brian Kelsey"
                width={900}
                height={1100}
                className="w-full h-auto rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className={classNames("mt-10 rounded-3xl border border-white/10 bg-white/[0.03]", cardPad)}>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs text-zinc-400">Show name</label>
              <input
                value={showName}
                onChange={(e) => setShowName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
                placeholder="e.g., Talk Show Me Tuesday"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Niche / audience</label>
              <input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
                placeholder="e.g., financial advisors, real estate teams, founders..."
              />
            </div>
            <div className="flex items-end gap-3">
              <button
                onClick={generatePlan}
                className="w-full rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition"
              >
                Generate my 12-week plan
              </button>
              <button
                onClick={copyPlan}
                className={classNames(
                  "w-full rounded-xl border px-5 py-3 text-sm font-semibold transition",
                  paid
                    ? "border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.10]"
                    : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                )}
              >
                Copy plan
              </button>
            </div>
          </div>

          {/* Premium move: in paid mode, no “demo switch” vibe */}
          {!paid && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-300">
                Want the full, paid experience? Use the same link you’ll send customers:
                <div className="mt-1 text-xs text-zinc-400">
                  planner.briankelseymedia.com/planner?paid=1
                </div>
              </div>
              <Link
                href={CHECKOUT_URL}
                className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition"
              >
                Unlock all 12 weeks ($29)
              </Link>
            </div>
          )}
        </div>

        {/* Show positioning snapshot */}
        {hasGenerated && (
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs text-zinc-400">Show positioning snapshot</div>
              <h2 className="mt-2 text-xl font-semibold">Make the show feel premium.</h2>
              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                <div>
                  <div className="text-white font-semibold">Show promise</div>
                  <div>
                    A repeatable weekly briefing for {niche}, designed to drive trust,
                    demand, and business.
                  </div>
                </div>
                <div>
                  <div className="text-white font-semibold">Who it is NOT for</div>
                  <div>People looking for random tips without consistency.</div>
                </div>
                <div>
                  <div className="text-white font-semibold">Competes with</div>
                  <div>Generic “how-to” content that blends in.</div>
                </div>
                <div>
                  <div className="text-white font-semibold">Creates a new category</div>
                  <div>Authority Episode Briefs (strategy + distribution baked in).</div>
                </div>
              </div>
            </div>

            {/* Month strategy */}
            <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs text-zinc-400">Month strategy</div>
              <h2 className="mt-2 text-xl font-semibold">Plan like a producer.</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {monthStrategies.map((m) => (
                  <div
                    key={m.month}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="text-xs text-zinc-400">Month {m.month}</div>
                    <div className="mt-1 text-white font-semibold">{m.name}</div>
                    <div className="mt-3 text-sm text-zinc-300 space-y-2">
                      <div>
                        <span className="text-white/90 font-semibold">Perception shift: </span>
                        {m.perceptionShift}
                      </div>
                      <div>
                        <span className="text-white/90 font-semibold">Belief to replace: </span>
                        {m.beliefToReplace}
                      </div>
                      <div>
                        <span className="text-white/90 font-semibold">Message to install: </span>
                        {m.brandMessageToInstall}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Episodes */}
        {hasGenerated && (
          <div className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold">Your 12-week plan</h2>
              <div className="text-sm text-zinc-400">
                {paid ? "Full version" : "Demo: Weeks 1–3 unlocked"}
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {episodes.map((ep) => {
                const locked = isDemo && ep.week > maxWeeksVisible;
                const inspirations = generateInspirations({
                  niche,
                  episodeTitle: ep.title,
                  positioningAngle: ep.positioningAngle,
                });

                return (
                  <div
                    key={ep.week}
                    className={classNames(
                      "relative overflow-hidden rounded-3xl border bg-white/[0.03]",
                      locked ? "border-white/10" : "border-white/10"
                    )}
                  >
                    {/* Locked overlay */}
                    {locked && (
                      <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm">
                        <div className="flex h-full items-center justify-center px-6">
                          <div className="max-w-lg text-center">
                            <div className="text-xl font-bold">Week {ep.week} is locked in the demo.</div>
                            <p className="mt-2 text-zinc-300">
                              Unlock Weeks 4–12 to export, copy, and use the full plan.
                            </p>
                            <div className="mt-5 flex items-center justify-center gap-3">
                              <Link
                                href={CHECKOUT_URL}
                                className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition"
                              >
                                Unlock all 12 weeks ($29)
                              </Link>
                              <Link
                                href="/planner?paid=1"
                                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                              >
                                Preview paid mode
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={classNames("p-6", locked && "opacity-30")}>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="text-xs text-zinc-400">Week {ep.week}</div>
                          <div className="mt-1 text-xl font-semibold">{ep.title}</div>
                        </div>
                        <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300">
                          Authority Episode Brief
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                          <div className="text-sm font-semibold text-white">Audience trigger</div>
                          <div className="mt-2 text-sm text-zinc-300">{ep.audienceTrigger}</div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                          <div className="text-sm font-semibold text-white">Positioning angle</div>
                          <div className="mt-2 text-sm text-zinc-300">{ep.positioningAngle}</div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                          <div className="text-sm font-semibold text-white">Host credibility moment</div>
                          <div className="mt-2 text-sm text-zinc-300">{ep.hostCredibilityMoment}</div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                          <div className="text-sm font-semibold text-white">Strategic outcome</div>
                          <div className="mt-2 text-sm text-zinc-300">{ep.strategicOutcome}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                          <div className="text-sm font-semibold text-white">Guest suggestion (archetype)</div>
                          <div className="mt-2 text-sm text-zinc-300">{ep.guestArchetype}</div>
                          <div className="mt-3 text-xs text-zinc-400">
                            <span className="text-white/90 font-semibold">
                              Why this guest strengthens your authority:
                            </span>{" "}
                            {ep.whyThisGuestStrengthensAuthority}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                          <div className="text-sm font-semibold text-white">Distribution play</div>
                          <div className="mt-3 space-y-2 text-sm text-zinc-300">
                            <div>
                              <span className="text-white/90 font-semibold">Vertical hook:</span>{" "}
                              {ep.distribution.verticalHook}
                            </div>
                            <div>
                              <span className="text-white/90 font-semibold">LinkedIn angle:</span>{" "}
                              {ep.distribution.linkedinAngle}
                            </div>
                            <div>
                              <span className="text-white/90 font-semibold">Newsletter angle:</span>{" "}
                              {ep.distribution.newsletterAngle}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Trending / inspirational videos */}
                      <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                          <div>
                            <div className="text-xs text-zinc-400">
                              Trending / inspirational videos in your niche
                            </div>
                            <div className="text-lg font-semibold">
                              Save references you can model (hooks, pacing, formats).
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                          {inspirations.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                            >
                              <div className="flex items-start gap-3">
                                <PlatformLogo platform={item.platform} />
                                <div className="min-w-0">
                                  <div className="text-xs text-zinc-400">
                                    {platformLabel(item.platform)}
                                  </div>
                                  <div className="mt-1 text-sm font-semibold text-white">
                                    {clampText(item.title, 72)}
                                  </div>
                                  <div className="mt-1 text-xs text-zinc-400">
                                    {clampText(item.creator, 46)}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 text-xs text-zinc-300">
                                <span className="text-white/90 font-semibold">Why it works: </span>
                                {item.whyItWorks}
                              </div>

                              <div className="mt-4 flex items-center gap-2">
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white hover:bg-white/[0.08] transition"
                                >
                                  Search
                                </a>

                                <button
                                  onClick={() => addInspirationToEpisode(ep.week, item)}
                                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-black hover:bg-amber-400 transition"
                                >
                                  Save to this episode
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Saved inspirations list */}
                        <div className="mt-5">
                          <div className="text-xs text-zinc-400">
                            Saved to this episode ({ep.inspirationsSaved.length})
                          </div>

                          {ep.inspirationsSaved.length === 0 ? (
                            <div className="mt-2 text-sm text-zinc-300">
                              Nothing saved yet. Use “Save to this episode” above.
                            </div>
                          ) : (
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                              {ep.inspirationsSaved.map((s) => (
                                <div
                                  key={s.id}
                                  className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 p-4"
                                >
                                  <div className="min-w-0">
                                    <div className="text-xs text-zinc-400">
                                      {platformLabel(s.platform)}
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-white">
                                      {clampText(s.title, 90)}
                                    </div>
                                    <div className="mt-1 text-xs text-zinc-400">
                                      {clampText(s.creator, 60)}
                                    </div>
                                    <a
                                      href={s.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="mt-2 inline-block text-xs text-amber-300 hover:text-amber-200 underline underline-offset-2"
                                    >
                                      Open search
                                    </a>
                                  </div>
                                  <button
                                    onClick={() => removeInspirationFromEpisode(ep.week, s.id)}
                                    className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white hover:bg-white/[0.08] transition"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom mini-actions */}
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-zinc-500">
                          Tip: Your “credibility moment” is where you sound like the producer,
                          not the commentator.
                        </div>

                        <button
                          onClick={copyPlan}
                          className={classNames(
                            "rounded-xl border px-4 py-2 text-xs font-semibold transition",
                            paid
                              ? "border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.10]"
                              : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                          )}
                        >
                          Copy plan
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!paid && (
              <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <div className="text-xl font-bold">Ready to unlock Weeks 4–12?</div>
                <p className="mt-2 text-zinc-300">
                  Full export. Full plan. No demo messaging. Tight, paid-product feel.
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <Link
                    href={CHECKOUT_URL}
                    className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition"
                  >
                    Unlock all 12 weeks ($29)
                  </Link>
                  <Link
                    href="/planner?paid=1"
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    Preview paid mode
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        <footer className="mt-16 border-t border-white/10 pt-8 text-xs text-zinc-500">
          © {new Date().getFullYear()} Brian Kelsey Media. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
