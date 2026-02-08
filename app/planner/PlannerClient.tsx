"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getInspirationalVideosForEpisode,
  InspirationVideo,
} from "@/lib/inspiration";

const CHECKOUT_URL = "https://buy.stripe.com/fZu9AS9lG2Pt6IQdQLdAk0f";

// Demo rules
const DEMO_WEEKS_VISIBLE = 3;

// localStorage keys
const LS_PAID = "bkm_planner_paid";
const LS_SAVED = "bkm_planner_saved_inspo_v1";

type MonthStrategy = {
  monthTitle: string;
  authorityFoundation: string;
  perceptionShift: string;
  beliefToReplace: string;
  messageToInstall: string;
};

type EpisodeBrief = {
  week: number;
  episodeTitle: string;

  // “Authority Episode Brief” fields
  audienceTrigger: string;
  positioningAngle: string;
  hostCredibilityMoment: string;
  guestArchetype: string;
  whyGuestBuildsAuthority: string;
  distributionVerticalHook: string;
  distributionLinkedInAngle: string;
  distributionNewsletterAngle: string;
  strategicOutcome: string;
};

type SavedInspo = {
  week: number;
  items: InspirationVideo[];
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

function buildMonthStrategies(niche: string, audience: string): MonthStrategy[] {
  const n = niche?.trim() || "your niche";
  const a = audience?.trim() || "your audience";

  return [
    {
      monthTitle: "Month 1: Authority foundation",
      authorityFoundation: `Establish the “why you” in ${n}.`,
      perceptionShift: `Move ${a} from “browsing” to “taking you seriously.”`,
      beliefToReplace: `Replace “I can figure this out alone” with “I need a repeatable system.”`,
      messageToInstall: `“Tools change. Strategy and positioning win.”`,
    },
    {
      monthTitle: "Month 2: Differentiation + objections",
      authorityFoundation: `Make your POV unavoidable.`,
      perceptionShift: `Turn common objections into clarity.`,
      beliefToReplace: `Replace “everyone says the same thing” with “your take is different.”`,
      messageToInstall: `“Your framework reduces risk and saves time.”`,
    },
    {
      monthTitle: "Month 3: Proof + momentum",
      authorityFoundation: `Stack proof, stories, and outcomes.`,
      perceptionShift: `Move from “interesting” to “trusted advisor.”`,
      beliefToReplace: `Replace “I’m not ready” with “I’m ready to act.”`,
      messageToInstall: `“This is the playbook I’d use with a client.”`,
    },
  ];
}

function generate12Weeks(params: {
  niche: string;
  audience: string;
  showPromise: string;
  hostCredibility: string;
}): EpisodeBrief[] {
  const niche = params.niche?.trim() || "your niche";
  const audience = params.audience?.trim() || "smart professionals";
  const promise =
    params.showPromise?.trim() ||
    `A premium, repeatable show that helps ${audience} win in ${niche}.`;
  const cred =
    params.hostCredibility?.trim() ||
    "Share a quick story from your real-world experience to prove you’ve seen this up close.";

  // Simple angle progression: Foundation → Differentiation → Proof
  const titles = [
    `The real reason ${audience} stay stuck (and how to break it)`,
    `The 3 mistakes everyone makes in ${niche} content`,
    `A simple weekly system for consistent authority`,
    `What “premium” actually means in your content (not just nicer visuals)`,
    `How to pick topics that attract the right people (not everyone)`,
    `The authority episode framework: hook → insight → proof → next step`,
    `Guest strategy: the archetypes that make YOU look like the expert`,
    `Objection removal: answering the “yeah but…” before it shows up`,
    `How to turn one episode into 10 assets without feeling spammy`,
    `Behind the scenes: how pros plan, record, and publish with calm`,
    `The positioning refresh: make your category smaller (and stronger)`,
    `Your next 90 days: the plan to keep momentum and turn attention into trust`,
  ];

  return titles.map((t, i) => {
    const week = i + 1;

    return {
      week,
      episodeTitle: t,

      audienceTrigger: `Your audience is dealing with a real-world pressure right now in ${niche}, and they’re missing the *actual* lever that changes outcomes.`,
      positioningAngle: `Your POV: ${promise}`,
      hostCredibilityMoment:
        week <= 4
          ? `Credibility moment: ${cred}`
          : week <= 8
          ? `Credibility moment: Share a client/example where a small strategic shift produced a big result.`
          : `Credibility moment: Share a behind-the-scenes producer insight most people don’t consider.`,

      guestArchetype:
        week <= 4
          ? `Guest archetype: Operator who implemented a system (not a “thought leader”).`
          : week <= 8
          ? `Guest archetype: Decision-maker who has hired/paid for this outcome.`
          : `Guest archetype: Insider who has seen deals/projects fail for this exact reason.`,

      whyGuestBuildsAuthority:
        `Why this guest makes you look strong: you’re the translator. You frame the lesson, extract the pattern, and connect it to your framework.`,

      distributionVerticalHook: `Vertical hook: “If you’re doing ${niche}, stop doing THIS…”`,
      distributionLinkedInAngle: `LinkedIn angle: a short story + the “one lever” takeaway + a simple question.`,
      distributionNewsletterAngle: `Newsletter angle: “Here’s the one thing I’d fix this week if I were you.”`,
      strategicOutcome:
        week <= 4
          ? `Strategic outcome: establish trust + set your category.`
          : week <= 8
          ? `Strategic outcome: remove objections + differentiate your POV.`
          : `Strategic outcome: proof stacking + authority momentum.`,
    };
  });
}

function formatPlanText(args: {
  paid: boolean;
  monthStrategies: MonthStrategy[];
  weeks: EpisodeBrief[];
  savedByWeek: Record<number, InspirationVideo[]>;
}) {
  const { paid, monthStrategies, weeks, savedByWeek } = args;

  const lines: string[] = [];

  lines.push(`12-Week Episode Planner`);
  lines.push(``);

  lines.push(`MONTH STRATEGY`);
  lines.push(``);

  monthStrategies.forEach((m) => {
    lines.push(`${m.monthTitle}`);
    lines.push(`- Authority foundation: ${m.authorityFoundation}`);
    lines.push(`- Perception shift: ${m.perceptionShift}`);
    lines.push(`- Belief to replace: ${m.beliefToReplace}`);
    lines.push(`- Message to install: ${m.messageToInstall}`);
    lines.push(``);
  });

  lines.push(`WEEKLY AUTHORITY EPISODE BRIEFS`);
  lines.push(``);

  weeks.forEach((w) => {
    lines.push(`Week ${w.week}: ${w.episodeTitle}`);
    lines.push(`1) Audience trigger: ${w.audienceTrigger}`);
    lines.push(`2) Positioning angle: ${w.positioningAngle}`);
    lines.push(`3) Host credibility moment: ${w.hostCredibilityMoment}`);
    lines.push(`4) Guest suggestion (archetype): ${w.guestArchetype}`);
    lines.push(`   Why this guest builds your authority: ${w.whyGuestBuildsAuthority}`);
    lines.push(`5) Distribution play:`);
    lines.push(`   - Vertical hook: ${w.distributionVerticalHook}`);
    lines.push(`   - LinkedIn angle: ${w.distributionLinkedInAngle}`);
    lines.push(`   - Newsletter angle: ${w.distributionNewsletterAngle}`);
    lines.push(`6) Strategic outcome: ${w.strategicOutcome}`);

    const saved = savedByWeek[w.week] || [];
    if (saved.length) {
      lines.push(`7) Saved inspiration (from trending videos):`);
      saved.forEach((v) => lines.push(`   - ${v.title} (${v.source}) — ${v.url}`));
    }

    lines.push(``);
  });

  if (!paid) {
    lines.push(`---`);
    lines.push(`This is a demo copy (weeks shown only).`);
  }

  return lines.join("\n");
}

function InspirationSection(props: {
  paid: boolean;
  niche: string;
  episodeTitle: string;
  week: number;
  savedByWeek: Record<number, InspirationVideo[]>;
  onSave: (week: number, video: InspirationVideo) => void;
  onRemove: (week: number, videoUrl: string) => void;
}) {
  const { paid, niche, episodeTitle, week, savedByWeek, onSave, onRemove } = props;

  const videos = useMemo(
    () => getInspirationalVideosForEpisode(niche, episodeTitle),
    [niche, episodeTitle]
  );

  const saved = savedByWeek[week] || [];
  const savedUrls = new Set(saved.map((s) => s.url));

  return (
    <div className={cx(paid ? "mt-3" : "mt-4", "rounded-xl border border-white/10 bg-white/5 p-4")}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white/90">
          Trending & inspirational videos in your niche
        </div>

        <div className="text-xs text-white/50">
          {saved.length ? `${saved.length} saved` : "Save a few for later"}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {videos.map((video, i) => {
          const isSaved = savedUrls.has(video.url);

          return (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-white/10 bg-black/30"
            >
              <a href={video.url} target="_blank" rel="noreferrer" className="block">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </a>

              <div className="p-2">
                <div className="line-clamp-2 text-xs font-medium text-white">
                  {video.title}
                </div>
                <div className="mt-1 text-[11px] text-white/50">{video.source}</div>

                <div className="mt-2 flex items-center gap-2">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/80 hover:bg-white/10 transition"
                  >
                    Open
                  </a>

                  {/* Save button exists for both demo + paid, but we only store in demo too (that’s fine). */}
                  {!isSaved ? (
                    <button
                      type="button"
                      onClick={() => onSave(week, video)}
                      className="rounded-md bg-amber-500 px-2 py-1 text-[11px] font-semibold text-black hover:bg-amber-400 transition"
                    >
                      Save to this episode
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRemove(week, video.url)}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/80 hover:bg-white/10 transition"
                    >
                      Remove
                    </button>
                  )}

                  {!paid && (
                    <span className="ml-auto text-[10px] text-white/40">
                      demo ok
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Saved list */}
      {saved.length > 0 && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="mb-2 text-xs font-semibold text-white/80">
            Saved for Week {week}
          </div>
          <ul className="space-y-1">
            {saved.map((v) => (
              <li key={v.url} className="flex items-start justify-between gap-3">
                <a
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-white/80 hover:text-white underline decoration-white/20"
                >
                  {v.title} <span className="text-white/40">({v.source})</span>
                </a>
                <button
                  type="button"
                  onClick={() => onRemove(week, v.url)}
                  className="text-[11px] text-white/50 hover:text-white"
                >
                  remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function PlannerClient() {
  const searchParams = useSearchParams();

  // paid=1 in URL turns on paid mode immediately.
  const paidFromUrl = searchParams?.get("paid") === "1";

  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    niche: "",
    audience: "",
    showPromise: "",
    hostCredibility: "",
  });

  const monthStrategies = useMemo(
    () => buildMonthStrategies(form.niche, form.audience),
    [form.niche, form.audience]
  );

  const allWeeks = useMemo(() => generate12Weeks(form), [form]);

  // Demo gating: only show first few weeks
  const visibleWeeks = useMemo(() => {
    if (paid) return allWeeks;
    return allWeeks.slice(0, DEMO_WEEKS_VISIBLE);
  }, [paid, allWeeks]);

  // Saved inspiration (per week)
  const [savedByWeek, setSavedByWeek] = useState<Record<number, InspirationVideo[]>>(
    {}
  );

  // Boot: decide paid, load saved
  useEffect(() => {
    const lsPaid = typeof window !== "undefined" ? window.localStorage.getItem(LS_PAID) : null;
    const isPaid = paidFromUrl || lsPaid === "1";

    setPaid(isPaid);

    // If URL says paid=1, store it so it stays “paid” on refresh.
    if (paidFromUrl) {
      window.localStorage.setItem(LS_PAID, "1");
    }

    // Load saved inspiration
    const raw = window.localStorage.getItem(LS_SAVED);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SavedInspo[];
        const map: Record<number, InspirationVideo[]> = {};
        parsed.forEach((row) => {
          map[row.week] = row.items || [];
        });
        setSavedByWeek(map);
      } catch {
        // ignore
      }
    }
  }, [paidFromUrl]);

  // Persist saved inspiration
  useEffect(() => {
    if (typeof window === "undefined") return;
    const rows: SavedInspo[] = Object.entries(savedByWeek).map(([week, items]) => ({
      week: Number(week),
      items,
    }));
    window.localStorage.setItem(LS_SAVED, JSON.stringify(rows));
  }, [savedByWeek]);

  function handleSave(week: number, video: InspirationVideo) {
    setSavedByWeek((prev) => {
      const existing = prev[week] || [];
      if (existing.some((x) => x.url === video.url)) return prev;
      return { ...prev, [week]: [...existing, video] };
    });
  }

  function handleRemove(week: number, videoUrl: string) {
    setSavedByWeek((prev) => {
      const existing = prev[week] || [];
      const next = existing.filter((x) => x.url !== videoUrl);
      return { ...prev, [week]: next };
    });
  }

  async function handleCopyPlan() {
    const text = formatPlanText({
      paid,
      monthStrategies,
      // IMPORTANT FIX: in demo mode, copy only what they can see
      weeks: paid ? allWeeks : visibleWeeks,
      savedByWeek,
    });

    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const shellPadding = paid ? "py-10" : "py-14";
  const cardGap = paid ? "gap-6" : "gap-10";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.10),transparent_60%)]" />

      {/* Header */}
      <header className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold">
              Brian Kelsey Media <span className="text-white/40">· Planner</span>
            </div>
            {paid && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                Pro
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyPlan}
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              {copied ? "Copied" : paid ? "Copy full plan" : "Copy plan (demo)"}
            </button>

            {!paid && (
              <a
                href={CHECKOUT_URL}
                className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition"
              >
                Unlock all 12 weeks ($29)
              </a>
            )}
          </div>
        </div>
      </header>

      <main className={cx("relative mx-auto max-w-6xl px-6", shellPadding)}>
        <div className={cx("grid", cardGap)}>
          {/* In paid mode: remove demo messaging entirely */}
          {!paid && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold text-white">
                Demo mode: Week 1–{DEMO_WEEKS_VISIBLE} preview
              </div>
              <div className="mt-2 text-sm text-zinc-300">
                Fill in your niche + audience and we’ll generate “Authority Episode Briefs.”
                Copying the plan will only copy the visible demo weeks.
              </div>
            </div>
          )}

          {/* Inputs */}
          <div className={cx("rounded-2xl border border-white/10 bg-white/[0.04] p-6", paid && "p-5")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <div className="mb-1 text-xs text-white/60">Niche</div>
                <input
                  value={form.niche}
                  onChange={(e) => setForm((p) => ({ ...p, niche: e.target.value }))}
                  placeholder="e.g., video podcasting for professionals"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/25"
                />
              </label>

              <label className="block">
                <div className="mb-1 text-xs text-white/60">Audience</div>
                <input
                  value={form.audience}
                  onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
                  placeholder="e.g., founders + business owners"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/25"
                />
              </label>

              <label className="block sm:col-span-2">
                <div className="mb-1 text-xs text-white/60">Show promise (positioning snapshot)</div>
                <input
                  value={form.showPromise}
                  onChange={(e) => setForm((p) => ({ ...p, showPromise: e.target.value }))}
                  placeholder="e.g., A premium, repeatable show that turns expertise into trust and demand."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/25"
                />
              </label>

              <label className="block sm:col-span-2">
                <div className="mb-1 text-xs text-white/60">
                  Host credibility moment (your default “insert here” line)
                </div>
                <input
                  value={form.hostCredibility}
                  onChange={(e) => setForm((p) => ({ ...p, hostCredibility: e.target.value }))}
                  placeholder="e.g., Share a quick story from your work with founders/firms/clients."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/25"
                />
              </label>
            </div>
          </div>

          {/* Month strategy */}
          <div className={cx("rounded-2xl border border-white/10 bg-white/[0.04] p-6", paid && "p-5")}>
            <div className="text-sm font-semibold text-white/90">Month strategy</div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {monthStrategies.map((m) => (
                <div
                  key={m.monthTitle}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="text-sm font-semibold">{m.monthTitle}</div>
                  <div className="mt-2 space-y-2 text-sm text-white/70">
                    <div>
                      <span className="text-white/85">Authority foundation:</span>{" "}
                      {m.authorityFoundation}
                    </div>
                    <div>
                      <span className="text-white/85">Perception shift:</span> {m.perceptionShift}
                    </div>
                    <div>
                      <span className="text-white/85">Belief to replace:</span> {m.beliefToReplace}
                    </div>
                    <div>
                      <span className="text-white/85">Message to install:</span> {m.messageToInstall}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weeks */}
          <div className="grid gap-4">
            {visibleWeeks.map((w) => (
              <div
                key={w.week}
                className={cx(
                  "rounded-2xl border border-white/10 bg-white/[0.04] p-6",
                  paid && "p-5"
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-white/50">Week {w.week}</div>
                    <div className="mt-1 text-lg font-semibold">{w.episodeTitle}</div>
                  </div>

                  {!paid && (
                    <div className="text-xs text-white/50">
                      Demo week
                    </div>
                  )}
                </div>

                <div className={cx("mt-4 grid gap-3", paid && "mt-3")}>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="text-sm font-semibold text-white/90">
                      Authority Episode Brief
                    </div>

                    <div className="mt-3 space-y-2 text-sm text-white/70">
                      <div>
                        <span className="text-white/85">1) Audience trigger:</span>{" "}
                        {w.audienceTrigger}
                      </div>
                      <div>
                        <span className="text-white/85">2) Positioning angle:</span>{" "}
                        {w.positioningAngle}
                      </div>
                      <div>
                        <span className="text-white/85">3) Host credibility moment:</span>{" "}
                        {w.hostCredibilityMoment}
                      </div>
                      <div>
                        <span className="text-white/85">4) Guest archetype:</span>{" "}
                        {w.guestArchetype}
                        <div className="mt-1 text-white/60">
                          <span className="text-white/80">Why this guest builds your authority:</span>{" "}
                          {w.whyGuestBuildsAuthority}
                        </div>
                      </div>

                      <div>
                        <span className="text-white/85">5) Distribution play:</span>
                        <ul className="mt-1 list-disc pl-5 text-white/60">
                          <li>
                            <span className="text-white/80">Vertical hook:</span>{" "}
                            {w.distributionVerticalHook}
                          </li>
                          <li>
                            <span className="text-white/80">LinkedIn angle:</span>{" "}
                            {w.distributionLinkedInAngle}
                          </li>
                          <li>
                            <span className="text-white/80">Newsletter angle:</span>{" "}
                            {w.distributionNewsletterAngle}
                          </li>
                        </ul>
                      </div>

                      <div>
                        <span className="text-white/85">6) Strategic outcome:</span>{" "}
                        {w.strategicOutcome}
                      </div>
                    </div>
                  </div>

                  {/* Trending/Inspiration + Save-to-episode */}
                  <InspirationSection
                    paid={paid}
                    niche={form.niche}
                    episodeTitle={w.episodeTitle}
                    week={w.week}
                    savedByWeek={savedByWeek}
                    onSave={handleSave}
                    onRemove={handleRemove}
                  />
                </div>

                {!paid && w.week === DEMO_WEEKS_VISIBLE && (
                  <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="text-sm font-semibold text-white/90">
                      Want the full 12-week plan?
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                      Unlock all weeks + copy the full plan.
                    </div>
                    <div className="mt-3">
                      <a
                        href={CHECKOUT_URL}
                        className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition"
                      >
                        Unlock all 12 weeks ($29)
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <footer className={cx("border-t border-white/10 pt-8 text-xs text-zinc-500", paid && "pt-6")}>
            © {new Date().getFullYear()} Brian Kelsey Media. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}
