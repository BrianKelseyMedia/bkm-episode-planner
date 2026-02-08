"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * PlannerClient.tsx
 * - Demo mode ALWAYS shows Weeks 1–3 only.
 * - NO URL param (?paid=1) can unlock anything.
 * - All "Unlock" actions go to Stripe Checkout URL.
 * - Copy only copies visible weeks in demo (1–3).
 * - Inputs start EMPTY (no stored test values, no autofill from localStorage).
 */

const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/fZu9AS9lG2Pt6IQdQLdAk0f";

type EpisodeBrief = {
  week: number;
  title: string;
  audienceTrigger: string;
  positioningAngle: string;
  hostCredibilityMoment: string;
  guestArchetype: string;
  whyGuestStrengthensAuthority: string;
  interviewQuestions: string[];
  distributionPlay: {
    verticalHook: string;
    linkedinAngle: string;
    newsletterAngle: string;
  };
  strategicOutcome: string;
  trendingVideos?: { title: string; channel?: string; url: string }[];
};

function openStripe() {
  window.location.href = STRIPE_CHECKOUT_URL;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildPlan(args: {
  showName: string;
  niche: string;
  whoFor: string;
  problem: string;
  outcome: string;
  contrarianTake: string;
}): EpisodeBrief[] {
  const { niche, whoFor, problem, outcome, contrarianTake } = args;

  // Simple, high-signal template generator (no external deps)
  const themes = [
    "The hidden constraint",
    "The 3 mistakes",
    "The myth vs reality",
    "The simple framework",
    "The checklist",
    "The counterintuitive move",
    "The teardown",
    "The system, not the hack",
    "The objection remover",
    "The time-saver",
    "The trust builder",
    "The authority play",
  ];

  return Array.from({ length: 12 }).map((_, i) => {
    const week = i + 1;

    const title =
      week === 1
        ? `Start here: the real reason ${whoFor || "your audience"} struggles with ${problem || niche}`
        : `${themes[i]} in ${niche || "your niche"} (and how to get ${outcome || "the result"} faster)`;

    const audienceTrigger =
      week === 1
        ? `Your audience is trying to solve "${problem || "the obvious problem"}" but the real risk is "${contrarianTake || "the hidden constraint"}".`
        : `They think the answer is more effort, but the real leverage is one decision that changes the outcome.`;

    const positioningAngle =
      contrarianTake?.trim()
        ? `Take the opposite position of the obvious advice: "${contrarianTake}".`
        : `Pick a producer lens: you’re not teaching tips — you’re reframing what matters and why.`;

    const hostCredibilityMoment =
      `Share a quick "I’ve seen this play out" moment: what you noticed, what changed when you fixed it, and the measurable difference.`;

    const guestArchetype =
      week % 3 === 0
        ? `Operator archetype: the person who executes this weekly (COO / manager / lead)`
        : week % 3 === 1
          ? `Survivor archetype: someone who lived the consequence and rebuilt`
          : `Skeptic archetype: someone who used to disagree — and changed their mind`;

    const whyGuestStrengthensAuthority =
      `This guest makes you the guide. You’re the one connecting the dots, naming the framework, and steering to the real takeaway — not just “hosting.”`;

    const interviewQuestions = [
      `What was the first sign ${problem || "this"} was becoming a bigger issue than you expected?`,
      `What “obvious solution” didn’t work — and why?`,
      `What was the hidden constraint nobody talks about in ${niche || "this space"}?`,
      `What’s the one decision that made the biggest difference?`,
      `If you had to repeat this process monthly, what would your system be?`,
    ];

    const distributionPlay = {
      verticalHook: `“Most people think ${problem || "X"} is the problem. It’s not. It’s THIS.”`,
      linkedinAngle: `A quick story + lesson: the moment you realized the real constraint — and the simple framework you now use.`,
      newsletterAngle: `“3 things I’d do this week if I were starting over in ${niche || "this niche"}.”`,
    };

    const strategicOutcome =
      week <= 3
        ? `Trust: make the audience feel understood and safe following your lead.`
        : week <= 8
          ? `Repositioning: replace their old belief with your framework.`
          : `Objection removal + authority proof: show why your approach wins in the real world.`;

    return {
      week,
      title,
      audienceTrigger,
      positioningAngle,
      hostCredibilityMoment,
      guestArchetype,
      whyGuestStrengthensAuthority,
      interviewQuestions,
      distributionPlay,
      strategicOutcome,
      trendingVideos: [], // (optional) hook for your inspiration feature
    };
  });
}

function formatPlanText(showName: string, niche: string, plan: EpisodeBrief[]) {
  const header = `12-Week Episode Plan\nShow: ${showName || "(untitled)"}\nNiche/Audience: ${niche || "(unspecified)"}\n`;
  const blocks = plan
    .map((ep) => {
      return [
        `\nWeek ${ep.week}: ${ep.title}`,
        `Audience trigger: ${ep.audienceTrigger}`,
        `Positioning angle: ${ep.positioningAngle}`,
        `Host credibility moment: ${ep.hostCredibilityMoment}`,
        `Guest archetype: ${ep.guestArchetype}`,
        `Why this guest strengthens authority: ${ep.whyGuestStrengthensAuthority}`,
        `Interview questions:\n- ${ep.interviewQuestions.join("\n- ")}`,
        `Distribution play:`,
        `- Vertical hook: ${ep.distributionPlay.verticalHook}`,
        `- LinkedIn angle: ${ep.distributionPlay.linkedinAngle}`,
        `- Newsletter angle: ${ep.distributionPlay.newsletterAngle}`,
        `Strategic outcome: ${ep.strategicOutcome}`,
      ].join("\n");
    })
    .join("\n");

  return `${header}\n${blocks}\n`;
}

export default function PlannerClient() {
  // IMPORTANT: demo is ALWAYS demo. No query param can unlock.
  const isPaid = false;

  // Inputs must start empty — no persisted values.
  const [showName, setShowName] = useState<string>("");
  const [niche, setNiche] = useState<string>("");
  const [whoFor, setWhoFor] = useState<string>("");
  const [problem, setProblem] = useState<string>("");
  const [outcome, setOutcome] = useState<string>("");
  const [contrarianTake, setContrarianTake] = useState<string>("");

  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [plan, setPlan] = useState<EpisodeBrief[] | null>(null);

  const visibleWeeks = isPaid ? 12 : 3;

  const canGenerate = useMemo(() => {
    return Boolean(showName.trim()) && Boolean(niche.trim());
  }, [showName, niche]);

  useEffect(() => {
    // keep activeWeek valid if demo/paid changes later
    setActiveWeek((w) => clamp(w, 1, visibleWeeks));
  }, [visibleWeeks]);

  function onGenerate() {
    const generated = buildPlan({
      showName,
      niche,
      whoFor,
      problem,
      outcome,
      contrarianTake,
    });

    setPlan(generated);
    setActiveWeek(1);
  }

  async function onCopyPlan() {
    if (!plan) return;

    const slice = plan.slice(0, visibleWeeks);
    const text = formatPlanText(showName, niche, slice);

    try {
      await navigator.clipboard.writeText(text);
      // Optional: tiny UX ping without dependencies
      alert(isPaid ? "Copied full plan." : "Copied demo (Weeks 1–3).");
    } catch {
      alert("Copy failed. Try selecting and copying manually.");
    }
  }

  const activeEpisode = plan ? plan[activeWeek - 1] : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Top header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Episode Planner
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Welcome to your episode planner.
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Answer a few quick questions and this generates a 12-week plan as{" "}
            <span className="font-semibold text-white">Authority Episode Briefs</span>{" "}
            (strategy, positioning, guest archetypes, distribution plays, plus inspiration you can save to
            each episode).
          </p>

          {!isPaid && (
            <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-white/80">
              Demo preview shows <span className="font-semibold text-white">Weeks 1–3</span>. Unlock to export
              the full 12 weeks.
            </div>
          )}
        </div>
      </div>

      {/* Inputs */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm text-white/70">Show name</label>
            <input
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              placeholder=""
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/30 focus:border-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Niche / audience category</label>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder=""
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/30 focus:border-white/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-white/70">Who is this show for?</label>
            <input
              value={whoFor}
              onChange={(e) => setWhoFor(e.target.value)}
              placeholder=""
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/30 focus:border-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">What problem do you solve?</label>
            <input
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder=""
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/30 focus:border-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">What outcome do you promise?</label>
            <input
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder=""
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/30 focus:border-white/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-white/70">What’s your contrarian take? (optional)</label>
            <input
              value={contrarianTake}
              onChange={(e) => setContrarianTake(e.target.value)}
              placeholder=""
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/30 focus:border-white/20"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-white/50">
            {!isPaid ? "Demo generates Weeks 1–3." : "Paid mode unlocked."}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onGenerate}
              disabled={!canGenerate}
              className={`rounded-2xl px-5 py-3 font-semibold ${
                canGenerate
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {!isPaid ? "Generate my 3-month demo plan" : "Generate my 12-week plan"}
            </button>

            <button
              type="button"
              onClick={onCopyPlan}
              disabled={!plan}
              className={`rounded-2xl px-5 py-3 font-semibold ${
                plan ? "bg-white/10 text-white hover:bg-white/15" : "bg-white/5 text-white/30"
              }`}
            >
              Copy plan
            </button>
          </div>
        </div>
      </div>

      {/* Big empty space filler (your “cool lines”) */}
      {!plan && (
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-white/80">
          <h2 className="text-xl font-semibold text-white">How this works</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="text-sm text-white/60">1) Tell us the basics</div>
              <div className="mt-2 font-semibold">Who it’s for + what outcome you deliver.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="text-sm text-white/60">2) Get Authority Episode Briefs</div>
              <div className="mt-2 font-semibold">Triggers, angles, guest archetypes, and distribution plays.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="text-sm text-white/60">3) Turn each week into content</div>
              <div className="mt-2 font-semibold">Use the interview questions and hooks to record fast.</div>
            </div>
          </div>

          {!isPaid && (
            <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 md:flex-row md:items-center">
              <div>
                <div className="font-semibold text-white">Want the full version?</div>
                <div className="text-white/60">
                  Unlock all 12 weeks + save inspiration videos to each episode.
                </div>
              </div>
              <button
                type="button"
                onClick={openStripe}
                className="rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-black hover:bg-amber-400"
              >
                Unlock the full 12 weeks
              </button>
            </div>
          )}
        </div>
      )}

      {/* Plan */}
      {plan && (
        <div className="mt-10">
          {/* Tabs */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/60">Your plan</div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {showName || "(untitled)"} <span className="text-white/40">• {niche || "(niche)"}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const week = i + 1;
                const locked = !isPaid && week > 3;
                const active = week === activeWeek;

                return (
                  <button
                    key={week}
                    type="button"
                    onClick={() => {
                      if (locked) return;
                      setActiveWeek(week);
                    }}
                    className={[
                      "rounded-full px-4 py-2 text-sm font-semibold",
                      active ? "bg-white text-black" : "bg-white/10 text-white/80 hover:bg-white/15",
                      locked ? "opacity-40 cursor-not-allowed hover:bg-white/10" : "",
                    ].join(" ")}
                  >
                    Week {week}
                  </button>
                );
              })}
            </div>

            {/* Demo unlock row (ONLY in demo) */}
            {!isPaid && (
              <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-white/70">
                  Demo shows Weeks 1–3.
                </div>
                <button
                  type="button"
                  onClick={openStripe}
                  className="rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-black hover:bg-amber-400"
                >
                  Unlock the full 12 weeks
                </button>
              </div>
            )}
          </div>

          {/* Episode content */}
          {activeEpisode && (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="text-sm text-white/60">Week {activeEpisode.week}</div>
              <h3 className="mt-2 text-3xl font-semibold text-white">{activeEpisode.title}</h3>

              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-xs text-white/60">Audience trigger</div>
                  <div className="mt-2 text-white/85">{activeEpisode.audienceTrigger}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-xs text-white/60">Positioning angle</div>
                  <div className="mt-2 text-white/85">{activeEpisode.positioningAngle}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-xs text-white/60">Host credibility moment</div>
                  <div className="mt-2 text-white/85">{activeEpisode.hostCredibilityMoment}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-xs text-white/60">Guest archetype</div>
                  <div className="mt-2 text-white/85">{activeEpisode.guestArchetype}</div>
                  <div className="mt-3 text-xs text-white/60">Why this strengthens your authority</div>
                  <div className="mt-2 text-white/80">{activeEpisode.whyGuestStrengthensAuthority}</div>
                </div>

                <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-xs text-white/60">Interview questions</div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-white/85">
                    {activeEpisode.interviewQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-xs text-white/60">Distribution play</div>
                  <div className="mt-3 text-sm text-white/70">Vertical hook idea</div>
                  <div className="mt-1 text-white/85">{activeEpisode.distributionPlay.verticalHook}</div>

                  <div className="mt-4 text-sm text-white/70">LinkedIn post angle</div>
                  <div className="mt-1 text-white/85">{activeEpisode.distributionPlay.linkedinAngle}</div>

                  <div className="mt-4 text-sm text-white/70">Newsletter angle</div>
                  <div className="mt-1 text-white/85">{activeEpisode.distributionPlay.newsletterAngle}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-xs text-white/60">Strategic outcome</div>
                  <div className="mt-2 text-white/85">{activeEpisode.strategicOutcome}</div>
                </div>

                {/* Optional: Inspiration section placeholder (works with your lib/inspiration.ts later) */}
                <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-xs text-white/60">Trending / inspirational videos in your niche</div>
                      <div className="mt-1 text-white/70">
                        (Optional) Add links you like, so this episode has creative references.
                      </div>
                    </div>

                    {!isPaid && (
                      <button
                        type="button"
                        onClick={openStripe}
                        className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                      >
                        Unlock to save videos
                      </button>
                    )}
                  </div>

                  <div className="mt-4 text-sm text-white/60">
                    {isPaid
                      ? "In paid mode you can search + save inspiration videos to this episode."
                      : "Demo preview: saving inspiration videos is a paid feature."}
                  </div>
                </div>
              </div>

              {/* Under Week 3 in demo: gentle upgrade prompt (not the big “Week 4 locked” page) */}
              {!isPaid && activeEpisode.week === 3 && (
                <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-6">
                  <div className="text-white/80">
                    Want Weeks 4–12 plus the full export + inspiration saving?
                  </div>
                  <button
                    type="button"
                    onClick={openStripe}
                    className="mt-4 rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-black hover:bg-amber-400"
                  >
                    Unlock the full 12 weeks
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
