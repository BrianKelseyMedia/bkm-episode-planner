"use client";

import { useEffect, useMemo, useState } from "react";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/fZu9AS9lG2Pt6IQdQLdAk0f";

type InspirationItem = {
  id: string;
  platform: "YouTube" | "TikTok" | "Instagram";
  title: string;
  channel?: string;
  url: string;
};

type EpisodeBrief = {
  week: number;
  title: string;

  // Core brief
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

  // “Rich stuff”
  interviewQuestions: string[];
  producerNotes: string[];
  shortClipIdeas: string[];

  inspiration: InspirationItem[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function makeId(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function safeText(s: string) {
  return (s || "").trim();
}

function titleCase(s: string) {
  const t = safeText(s);
  if (!t) return t;
  return t
    .split(" ")
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

function generateInspiration(theme: string): InspirationItem[] {
  return [
    {
      id: makeId("yt"),
      platform: "YouTube",
      title: `High-retention structure you can model for: “${theme}”`,
      channel: "Example",
      url: "https://www.youtube.com/",
    },
    {
      id: makeId("tt"),
      platform: "TikTok",
      title: `Pattern-interrupt hook style that fits this angle`,
      channel: "Example",
      url: "https://www.tiktok.com/",
    },
    {
      id: makeId("ig"),
      platform: "Instagram",
      title: `Clean talking-head reel format + caption pacing`,
      channel: "Example",
      url: "https://www.instagram.com/",
    },
  ];
}

function generatePlan(inputs: {
  showName: string;
  niche: string;
  whoFor: string;
  problem: string;
  outcome: string;
}): EpisodeBrief[] {
  const showName = titleCase(inputs.showName) || "Your Show";
  const niche = safeText(inputs.niche) || "your niche";
  const whoFor = safeText(inputs.whoFor) || "your audience";
  const problem = safeText(inputs.problem) || "the core problem";
  const outcome = safeText(inputs.outcome) || "the desired outcome";

  // Week themes that feel “Authority Episode Brief”-ish (not lorem nonsense)
  const weekThemes = [
    "The real reason people stay stuck",
    "The 3 mistakes that keep progress slow",
    "The hidden constraint nobody sees",
    "The framework that makes results repeatable",
    "How to diagnose the issue in 10 minutes",
    "Your first 30-day roadmap",
    "The objections holding people back (and how to remove them)",
    "A case study teardown",
    "Systems + routines that make it stick",
    "How to measure progress without overthinking",
    "Advanced moves + edge cases",
    "The complete roadmap recap + what to do next",
  ];

  return Array.from({ length: 12 }).map((_, idx) => {
    const week = idx + 1;
    const theme = weekThemes[idx];

    const title =
      week === 1
        ? `The real reason ${whoFor} can’t get ${outcome}`
        : week === 2
          ? `The 3 mistakes keeping ${whoFor} stuck in ${problem}`
          : week === 3
            ? `The hidden constraint behind ${problem} (and what fixes it)`
            : `${theme} for ${whoFor}`;

    const producerNotes = [
      `Open with a clear “this is what we’re fixing today” statement: ${problem} → ${outcome}.`,
      `Give one contrarian truth early (something they won’t hear in generic content).`,
      `End with a simple action step they can do in 7 days (make it measurable).`,
    ];

    const shortClipIdeas = [
      `Clip 1 (7–12s): “If you’re dealing with ${problem}, stop doing THIS first.”`,
      `Clip 2 (10–18s): “Most advice fails because it ignores the real constraint.”`,
      `Clip 3 (12–20s): “Here’s the fastest path to ${outcome} without overcomplicating it.”`,
    ];

    const interviewQuestions = [
      `What are people doing that feels “right” but keeps them stuck in ${problem}?`,
      `What’s the hidden constraint most people don’t see until it’s too late?`,
      `What’s the one shift that creates momentum fastest toward ${outcome}?`,
      `What’s your “producer lens” way to think about this problem?`,
      `If someone had to improve in 30 days, what would you have them do first?`,
    ];

    return {
      week,
      title,
      audienceTrigger: `Your audience (${whoFor}) is dealing with ${problem} and doesn’t realize the lever is usually one key habit, belief, or system.`,
      positioningAngle: `Make the case that “common advice” in ${niche} is incomplete. Your show provides the clearer path to ${outcome} with a repeatable framework.`,
      hostCredibilityMoment: `Share a specific moment you’ve seen repeatedly: a client story, a production insight, or a mistake that used to be normal… and what changed when you fixed it.`,
      guestArchetype: `A practitioner (not generic): someone who lived this problem or helps others solve it consistently (operator, specialist, or “in the trenches” expert).`,
      whyThisGuestStrengthensAuthority: `You frame the real problem and the strategy. The guest validates it with lived experience. You close by translating it into a simple plan.`,
      distribution: {
        verticalHook: `“If you’re stuck in ${problem}, it’s probably because of this one thing…”`,
        linkedinAngle: `The uncomfortable truth about ${problem} (and why most advice doesn’t work).`,
        newsletterAngle: `A simple, repeatable step that moves you closer to ${outcome} this week.`,
      },
      strategicOutcome: `Objection removal + authority proof. The audience should think: “This person sees the real game, and ${outcome} feels doable.”`,
      interviewQuestions,
      producerNotes,
      shortClipIdeas,
      inspiration: generateInspiration(theme),
    };
  });
}

function getStorageKey(showName: string) {
  const base = safeText(showName) || "default";
  return `bkm_planner_saved_${base.toLowerCase().slice(0, 60)}`;
}

export default function PlannerClient({ isPaid }: { isPaid: boolean }) {
  const maxUnlockedWeek = useMemo(() => (isPaid ? 12 : 3), [isPaid]);

  // Inputs
  const [showName, setShowName] = useState("");
  const [niche, setNiche] = useState("");
  const [whoFor, setWhoFor] = useState("");
  const [problem, setProblem] = useState("");
  const [outcome, setOutcome] = useState("");

  // Plan state
  const [plan, setPlan] = useState<EpisodeBrief[] | null>(null);
  const [activeWeek, setActiveWeek] = useState<number>(1);

  // HARD clamp demo mode (prevents any “oops I got to week 6”)
  useEffect(() => {
    if (!isPaid && activeWeek > 3) setActiveWeek(3);
  }, [isPaid, activeWeek]);

  // Load saved plan per show (optional)
  useEffect(() => {
    if (!safeText(showName)) return;

    const key = getStorageKey(showName);
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;

      const parsed = JSON.parse(raw) as EpisodeBrief[];
      if (Array.isArray(parsed) && parsed.length) {
        setPlan(parsed);
        setActiveWeek((w) => clamp(w, 1, isPaid ? 12 : 3));
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showName]);

  // Persist plan
  useEffect(() => {
    if (!plan) return;
    if (!safeText(showName)) return;

    const key = getStorageKey(showName);
    try {
      localStorage.setItem(key, JSON.stringify(plan));
    } catch {
      // ignore
    }
  }, [plan, showName]);

  const visibleWeeks = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const active = useMemo(() => {
    if (!plan) return null;
    const idx = clamp(activeWeek, 1, 12) - 1;
    return plan[idx] ?? null;
  }, [plan, activeWeek]);

  const isLockedWeek = (week: number) => !isPaid && week > 3;

  function handleGenerate() {
    const next = generatePlan({ showName, niche, whoFor, problem, outcome });
    setPlan(next);
    setActiveWeek(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCopy() {
    if (!plan) return;

    const unlocked = plan.slice(0, maxUnlockedWeek);
    const text = unlocked
      .map((ep) => {
        return [
          `Week ${ep.week}: ${ep.title}`,
          ``,
          `Audience trigger: ${ep.audienceTrigger}`,
          `Positioning angle: ${ep.positioningAngle}`,
          `Host credibility moment: ${ep.hostCredibilityMoment}`,
          `Guest archetype: ${ep.guestArchetype}`,
          `Why this guest strengthens your authority: ${ep.whyThisGuestStrengthensAuthority}`,
          ``,
          `Distribution play:`,
          `- Vertical hook: ${ep.distribution.verticalHook}`,
          `- LinkedIn angle: ${ep.distribution.linkedinAngle}`,
          `- Newsletter angle: ${ep.distribution.newsletterAngle}`,
          ``,
          `Strategic outcome: ${ep.strategicOutcome}`,
          ``,
          `Producer notes:`,
          ...ep.producerNotes.map((x) => `- ${x}`),
          ``,
          `Short clip ideas:`,
          ...ep.shortClipIdeas.map((x) => `- ${x}`),
          ``,
          `Interview questions:`,
          ...ep.interviewQuestions.map((q) => `- ${q}`),
          ``,
          `Trending / inspirational videos:`,
          ...ep.inspiration.map((v) => `- [${v.platform}] ${v.title} — ${v.url}`),
          ``,
          `---`,
          ``,
        ].join("\n");
      })
      .join("\n");

    navigator.clipboard.writeText(text);
    alert(isPaid ? "Copied full 12-week plan." : "Copied Weeks 1–3 (demo).");
  }

  function refreshIdeasForWeek(week: number) {
    if (!plan) return;
    setPlan((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const idx = week - 1;
      if (!next[idx]) return prev;

      const theme = `Week ${week}`;
      next[idx] = { ...next[idx], inspiration: generateInspiration(theme) };
      return next;
    });
  }

  function saveInspirationToEpisode(week: number, item: InspirationItem) {
    if (!plan) return;
    setPlan((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const idx = week - 1;
      const ep = next[idx];
      if (!ep) return prev;

      if (ep.inspiration.some((x) => x.url === item.url)) return prev;

      next[idx] = {
        ...ep,
        inspiration: [{ ...item, id: makeId("saved") }, ...ep.inspiration],
      };
      return next;
    });
  }

  function removeInspirationFromEpisode(week: number, id: string) {
    if (!plan) return;
    setPlan((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const idx = week - 1;
      const ep = next[idx];
      if (!ep) return prev;

      next[idx] = {
        ...ep,
        inspiration: ep.inspiration.filter((x) => x.id !== id),
      };
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Episode Planner
        </div>

        <h1 className="mt-4 text-5xl font-extrabold tracking-tight">Welcome to your episode planner.</h1>

        <p className="mt-4 max-w-3xl text-white/70">
          Answer a few quick questions and this generates a 12-week plan as{" "}
          <span className="font-semibold text-white">Authority Episode Briefs</span> (strategy, positioning, guest archetypes,
          distribution plays, interview questions, plus inspiration you can save to each episode).
        </p>

        {!isPaid && (
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            Demo preview shows <span className="font-semibold">Weeks 1–3</span>. Unlock to export the full 12 weeks.
          </div>
        )}
      </div>

      {/* Inputs */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-white/70">Show name</label>
            <input
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              placeholder=" "
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Niche / audience category</label>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder=" "
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-white/70">Who is this show for?</label>
            <input
              value={whoFor}
              onChange={(e) => setWhoFor(e.target.value)}
              placeholder=" "
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">What problem do you solve?</label>
            <input
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder=" "
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">What outcome do you promise?</label>
            <input
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder=" "
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/20"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerate}
            className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
          >
            {isPaid ? "Generate my 12-week plan" : "Generate my 3-month plan (demo)"}
          </button>

          <button
            onClick={handleCopy}
            disabled={!plan}
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy plan
          </button>

          {!isPaid && (
            <a
              href={STRIPE_PAYMENT_LINK}
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Unlock the full 12 weeks ($29)
            </a>
          )}
        </div>
      </div>

      {/* Output */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-white/70">
            Unlocked: <span className="font-semibold text-white">Weeks 1–{maxUnlockedWeek}</span>
          </div>

          {!isPaid && plan && (
            <a
              href={STRIPE_PAYMENT_LINK}
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-black hover:bg-amber-400"
            >
              Unlock the full 12 weeks
            </a>
          )}
        </div>

        {/* Week tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {visibleWeeks.map((w) => {
            const locked = isLockedWeek(w);
            const isActive = w === activeWeek;

            return (
              <button
                key={w}
                onClick={() => {
                  if (locked) return;
                  setActiveWeek(w);
                }}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  locked
                    ? "cursor-not-allowed border border-white/10 bg-black/20 text-white/35"
                    : "border border-white/15 bg-white/5 text-white hover:bg-white/10",
                  isActive && !locked ? "bg-white text-black hover:bg-white" : "",
                ].join(" ")}
                title={locked ? "Locked in demo" : `Week ${w}`}
              >
                Week {w}
              </button>
            );
          })}
        </div>

        {!plan && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 text-white/70">
            <div className="text-lg font-semibold text-white">Add your show details above.</div>
            <div className="mt-2">
              Then click <span className="font-semibold text-white">Generate</span> to get your first 3 weeks (demo) as Authority Episode Briefs.
            </div>
            <div className="mt-4 text-white/60">
              You’ll get structure, positioning angles, guest archetypes, distribution plays, interview questions, producer notes, clip ideas, and inspiration.
            </div>
          </div>
        )}

        {plan && active && (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: core brief */}
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <div className="text-sm text-white/60">Week {active.week}</div>
              <h2 className="mt-2 text-2xl font-extrabold">{active.title}</h2>

              <div className="mt-6 space-y-4 text-sm text-white/75">
                <div>
                  <div className="font-semibold text-white">Audience trigger</div>
                  <div className="mt-1">{active.audienceTrigger}</div>
                </div>

                <div>
                  <div className="font-semibold text-white">Positioning angle</div>
                  <div className="mt-1">{active.positioningAngle}</div>
                </div>

                <div>
                  <div className="font-semibold text-white">Host credibility moment</div>
                  <div className="mt-1">{active.hostCredibilityMoment}</div>
                </div>

                <div>
                  <div className="font-semibold text-white">Guest archetype</div>
                  <div className="mt-1">{active.guestArchetype}</div>
                </div>

                <div>
                  <div className="font-semibold text-white">Why this guest strengthens your authority</div>
                  <div className="mt-1">{active.whyThisGuestStrengthensAuthority}</div>
                </div>

                <div>
                  <div className="font-semibold text-white">Strategic outcome</div>
                  <div className="mt-1">{active.strategicOutcome}</div>
                </div>
              </div>

              {/* Producer notes + clip ideas (adds “rich stuff” back) */}
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-bold">Producer notes</div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/75">
                    {active.producerNotes.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-bold">Short clip ideas</div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/75">
                    {active.shortClipIdeas.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: distribution + questions + inspiration */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <div className="text-lg font-bold">Distribution play</div>
                <div className="mt-4 space-y-3 text-sm text-white/75">
                  <div>
                    <div className="font-semibold text-white">Vertical hook</div>
                    <div className="mt-1">{active.distribution.verticalHook}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">LinkedIn angle</div>
                    <div className="mt-1">{active.distribution.linkedinAngle}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Newsletter angle</div>
                    <div className="mt-1">{active.distribution.newsletterAngle}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <div className="text-lg font-bold">Suggested interview questions</div>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/75">
                  {active.interviewQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-bold">Trending / inspirational videos</div>

                  <button
                    onClick={() => refreshIdeasForWeek(active.week)}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Refresh ideas
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {active.inspiration.map((v) => (
                    <div
                      key={v.id}
                      className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="text-xs text-white/60">{v.platform}</div>
                        <div className="text-sm font-semibold">{v.title}</div>
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-xs text-white/60 underline decoration-white/20 underline-offset-4 hover:text-white"
                        >
                          Open link
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => saveInspirationToEpisode(active.week, v)}
                          className="rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400"
                        >
                          Save to this episode
                        </button>
                        <button
                          onClick={() => removeInspirationFromEpisode(active.week, v.id)}
                          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Demo CTA lives cleanly under Week 3 (not a big lock screen) */}
                {!isPaid && active.week === 3 && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                    Demo ends after Week 3. Unlock Weeks 4–12 + export here:{" "}
                    <a
                      className="font-semibold text-white underline decoration-white/20 underline-offset-4"
                      href={STRIPE_PAYMENT_LINK}
                    >
                      Unlock the full 12 weeks ($29)
                    </a>
                    .
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
