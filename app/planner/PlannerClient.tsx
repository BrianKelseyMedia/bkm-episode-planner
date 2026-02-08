"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getInspirationForEpisode, InspirationItem } from "@/lib/inspiration";

type Episode = {
  week: number;
  title: string;
  audienceTrigger: string;
  positioningAngle: string;
  hostCredMoment: string;
  guestArchetype: string;
  whyGuestStrengthensAuthority: string;
  distribution: {
    verticalHook: string;
    linkedinAngle: string;
    newsletterAngle: string;
  };
  strategicOutcome: string;
  interviewQuestions: string[];
  savedInspiration: InspirationItem[];
};

type Plan = {
  showName: string;
  niche: string;
  whoFor: string;
  problem: string;
  outcome: string;
  episodes: Episode[];
};

const DEMO_WEEKS = 3;

function clampText(s: string, max = 110) {
  const t = (s || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

function buildEpisode(params: {
  week: number;
  showName: string;
  niche: string;
  whoFor: string;
  problem: string;
  outcome: string;
}): Episode {
  const { week, niche, whoFor, problem, outcome } = params;

  const titles = [
    `The “hidden reason” ${whoFor || "your audience"} stays stuck`,
    `Stop doing the obvious fix. Do this instead.`,
    `The 3 mistakes that keep ${whoFor || "people"} from ${outcome || "getting results"}`,
    `The simple framework for solving ${problem || "the main problem"}`,
    `What nobody tells you about ${niche || "this space"}`,
    `How to get results faster without burning out`,
    `The belief shift that changes everything`,
    `The checklist that prevents expensive mistakes`,
    `How to make your process repeatable (so it scales)`,
    `What to do when things don’t work (and how to recover fast)`,
    `Behind the scenes: real examples + fixes`,
    `Your 90-day reset plan (start here next)`,
  ];

  const safeTitle = titles[(week - 1) % titles.length];

  const audienceTrigger =
    `Your audience is dealing with ${problem || "a frustrating bottleneck"} and doesn’t realize ` +
    `the real risk is what they’re doing “by default”.`;

  const positioningAngle =
    `Instead of generic tips, take a producer lens: ` +
    `show the decision-making and the “why” behind the right move.`;

  const hostCredMoment =
    `Insert one specific moment where you’ve seen this play out in the real world ` +
    `(client work, production experience, or a personal story).`;

  const guestArchetype =
    `A credible operator who has lived the problem: a founder/leader/practitioner ` +
    `who fixed it and can explain the tradeoffs.`;

  const whyGuestStrengthensAuthority =
    `This guest reinforces your point of view, validates your framework, ` +
    `and makes you look like the person who “sees the real pattern.”`;

  const distribution = {
    verticalHook: `“If you’re doing X, you’re accidentally causing Y. Here’s the fix.”`,
    linkedinAngle: `A short story: what smart people get wrong about this + the reframe.`,
    newsletterAngle: `A 5-minute breakdown: the problem, the blind spot, and the new default.`,
  };

  const strategicOutcome =
    `Objection removal + trust. After this episode, the viewer should think: ` +
    `“This person gets it, and their approach feels different.”`;

  const interviewQuestions = [
    `When did you first realize the “obvious” solution wasn’t working?`,
    `What was the hidden constraint nobody was naming?`,
    `What are the top 3 mistakes you see people make here?`,
    `What did you change first that made the biggest difference?`,
    `If someone only did one thing this week, what should it be?`,
  ];

  return {
    week,
    title: safeTitle,
    audienceTrigger,
    positioningAngle,
    hostCredMoment,
    guestArchetype,
    whyGuestStrengthensAuthority,
    distribution,
    strategicOutcome,
    interviewQuestions,
    savedInspiration: [],
  };
}

function buildPlan(input: {
  showName: string;
  niche: string;
  whoFor: string;
  problem: string;
  outcome: string;
}): Plan {
  const episodes = Array.from({ length: 12 }, (_, i) =>
    buildEpisode({
      week: i + 1,
      showName: input.showName,
      niche: input.niche,
      whoFor: input.whoFor,
      problem: input.problem,
      outcome: input.outcome,
    })
  );

  return { ...input, episodes };
}

function planToText(plan: Plan, isPaid: boolean): string {
  const maxWeeks = isPaid ? 12 : DEMO_WEEKS;
  const weeks = plan.episodes.slice(0, maxWeeks);

  const header =
    `12-Week Episode Planner\n` +
    `Show: ${plan.showName || "(untitled)"}\n` +
    `Niche: ${plan.niche || "(not set)"}\n\n`;

  const blocks = weeks
    .map((ep) => {
      const insp = ep.savedInspiration?.length
        ? `\nTrending / Inspiration saved:\n` +
          ep.savedInspiration
            .map((x) => `- [${x.platform}] ${x.title} — ${x.reason}`)
            .join("\n")
        : "";

      return (
        `Week ${ep.week}: ${ep.title}\n` +
        `Audience trigger: ${ep.audienceTrigger}\n` +
        `Positioning angle: ${ep.positioningAngle}\n` +
        `Host credibility moment: ${ep.hostCredMoment}\n` +
        `Guest archetype: ${ep.guestArchetype}\n` +
        `Why this guest strengthens authority: ${ep.whyGuestStrengthensAuthority}\n` +
        `Distribution play:\n` +
        `- Vertical hook: ${ep.distribution.verticalHook}\n` +
        `- LinkedIn angle: ${ep.distribution.linkedinAngle}\n` +
        `- Newsletter angle: ${ep.distribution.newsletterAngle}\n` +
        `Strategic outcome: ${ep.strategicOutcome}\n` +
        `Interview questions:\n` +
        ep.interviewQuestions.map((q) => `- ${q}`).join("\n") +
        insp +
        `\n`
      );
    })
    .join("\n");

  const footer = isPaid
    ? ""
    : `\n—\nDemo preview includes Weeks 1–${DEMO_WEEKS}. Unlock the full 12 weeks to export everything.\n`;

  return header + blocks + footer;
}

export default function PlannerClient() {
  const searchParams = useSearchParams();
  const isPaid = searchParams?.get("paid") === "1";

  // IMPORTANT: no localStorage, no cookie, no default test values
  const [showName, setShowName] = useState("");
  const [niche, setNiche] = useState("");
  const [whoFor, setWhoFor] = useState("");
  const [problem, setProblem] = useState("");
  const [outcome, setOutcome] = useState("");

  const [plan, setPlan] = useState<Plan | null>(null);

  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const selectedEpisode = useMemo(() => {
    if (!plan) return null;
    return plan.episodes.find((e) => e.week === selectedWeek) ?? null;
  }, [plan, selectedWeek]);

  const demoLimitWeek = DEMO_WEEKS;

  const canAccessWeek = (week: number) => isPaid || week <= demoLimitWeek;

  const generate = () => {
    const nextPlan = buildPlan({
      showName: showName.trim(),
      niche: niche.trim(),
      whoFor: whoFor.trim(),
      problem: problem.trim(),
      outcome: outcome.trim(),
    });
    setPlan(nextPlan);
    setSelectedWeek(1);
  };

  const copyPlan = async () => {
    if (!plan) return;
    const text = planToText(plan, isPaid);
    await navigator.clipboard.writeText(text);
  };

  const unlockHref = "/planner?paid=1";

  const addSavedInspiration = (week: number, item: InspirationItem) => {
    if (!plan) return;
    const next = structuredClone(plan) as Plan;
    const ep = next.episodes.find((e) => e.week === week);
    if (!ep) return;

    const exists = ep.savedInspiration.some((x) => x.id === item.id);
    if (!exists) ep.savedInspiration.push(item);

    setPlan(next);
  };

  const removeSavedInspiration = (week: number, id: string) => {
    if (!plan) return;
    const next = structuredClone(plan) as Plan;
    const ep = next.episodes.find((e) => e.week === week);
    if (!ep) return;
    ep.savedInspiration = ep.savedInspiration.filter((x) => x.id !== id);
    setPlan(next);
  };

  const heroPad = isPaid ? "py-10" : "py-14";
  const sectionGap = isPaid ? "mt-8" : "mt-10";

  return (
    <div className={`mx-auto max-w-6xl px-6 ${heroPad}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/bkm-logo.png"
            alt="Brian Kelsey Media"
            width={44}
            height={44}
            className="rounded"
          />
          <div>
            <div className="text-sm font-semibold">Brian Kelsey Media</div>
            <div className="text-xs text-white/60">
              Premium video strategy + production
            </div>
          </div>
        </div>

        {!isPaid && (
          <a
            href={unlockHref}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold hover:bg-white/10"
          >
            Try the demo
          </a>
        )}
      </div>

      {/* Top welcome */}
      <div className={`${sectionGap} grid grid-cols-1 gap-10 lg:grid-cols-2`}>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            Episode Planner
          </div>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
            Welcome to your episode planner.
          </h1>

          <p className="mt-5 max-w-xl text-base text-white/70 md:text-lg">
            Answer a few quick questions and this generates a 12-week plan as{" "}
            <span className="font-semibold text-white/90">
              Authority Episode Briefs
            </span>{" "}
            (strategy, positioning, guest archetypes, distribution plays, plus
            inspiration you can save to each episode).
          </p>

          {!isPaid && (
            <div className="mt-8 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5 text-sm text-white/75">
              Demo preview shows <span className="font-semibold">Weeks 1–3</span>.
              Unlock to export the full 12 weeks.
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
          {/* This is the missing image fix */}
          <Image
            src="/bkm-hero.png"
            alt="Brian Kelsey"
            width={900}
            height={900}
            className="h-[360px] w-full rounded-2xl object-cover"
            priority
          />
        </div>
      </div>

      {/* Form card */}
      <div className={`${sectionGap} rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8`}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm text-white/70">Show name</label>
            <input
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/25"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Niche / audience category</label>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/25"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-white/70">Who is this show for?</label>
            <input
              value={whoFor}
              onChange={(e) => setWhoFor(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/25"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">What problem do you solve?</label>
            <input
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/25"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">What outcome do you promise?</label>
            <input
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/25"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={generate}
            className="rounded-2xl bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
          >
            {isPaid ? "Generate my 12-week plan" : "Generate my 3-month plan (demo)"}
          </button>

          <button
            onClick={copyPlan}
            disabled={!plan}
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-40"
          >
            {isPaid ? "Copy full plan" : "Copy demo plan"}
          </button>

          {!isPaid && (
            <a
              href={unlockHref}
              className="ml-auto rounded-2xl bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
            >
              Unlock all 12 weeks ($29)
            </a>
          )}
        </div>

        {!plan && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-black/30 p-8 text-white/70">
            <div className="text-lg font-semibold text-white/85">
              Here’s what you’ll get:
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="font-semibold text-white/90">Weekly clarity</div>
                <div className="mt-2 text-sm text-white/70">
                  Each week becomes an Episode Brief (not just a topic list).
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="font-semibold text-white/90">Authority angles</div>
                <div className="mt-2 text-sm text-white/70">
                  Positioning, credibility moments, and objection removal built in.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="font-semibold text-white/90">Distribution plays</div>
                <div className="mt-2 text-sm text-white/70">
                  A vertical hook + LinkedIn + newsletter angle per episode.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plan output */}
      {plan && (
        <div className={`${sectionGap} rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm text-white/60">Your plan</div>
              <div className="text-xl font-extrabold">
                {plan.showName || "Untitled show"}{" "}
                <span className="text-white/50">• {plan.niche || "Niche"}</span>
              </div>
            </div>

            {!isPaid && (
              <a
                href={unlockHref}
                className="rounded-2xl bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
              >
                Unlock all 12 weeks ($29)
              </a>
            )}
          </div>

          {/* Week selector */}
          <div className="mt-6 flex flex-wrap gap-2">
            {plan.episodes.map((ep) => {
              const locked = !canAccessWeek(ep.week);
              return (
                <button
                  key={ep.week}
                  onClick={() => {
                    if (!locked) setSelectedWeek(ep.week);
                  }}
                  className={[
                    "rounded-full px-4 py-2 text-xs font-semibold",
                    selectedWeek === ep.week
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/70 hover:bg-white/10",
                    locked ? "opacity-40 cursor-not-allowed hover:bg-white/5" : "",
                  ].join(" ")}
                  title={locked ? "Locked in demo" : "Open"}
                >
                  Week {ep.week}
                </button>
              );
            })}
          </div>

          {/* Demo unlock line (no giant locked blocks) */}
          {!isPaid && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
              Demo shows Weeks 1–3.{" "}
              <a
                href={unlockHref}
                className="ml-2 inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400"
              >
                Unlock the full 12 weeks
              </a>
            </div>
          )}

          {/* Episode detail */}
          {selectedEpisode && canAccessWeek(selectedEpisode.week) && (
            <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <div className="text-sm text-white/60">
                  Week {selectedEpisode.week}
                </div>
                <div className="mt-2 text-2xl font-extrabold">
                  {selectedEpisode.title}
                </div>

                <div className="mt-5 space-y-4 text-sm text-white/75">
                  <div>
                    <div className="text-white/90 font-semibold">Audience trigger</div>
                    <div className="mt-1">{selectedEpisode.audienceTrigger}</div>
                  </div>
                  <div>
                    <div className="text-white/90 font-semibold">Positioning angle</div>
                    <div className="mt-1">{selectedEpisode.positioningAngle}</div>
                  </div>
                  <div>
                    <div className="text-white/90 font-semibold">Host credibility moment</div>
                    <div className="mt-1">{selectedEpisode.hostCredMoment}</div>
                  </div>
                  <div>
                    <div className="text-white/90 font-semibold">Guest archetype</div>
                    <div className="mt-1">{selectedEpisode.guestArchetype}</div>
                    <div className="mt-2 text-white/70">
                      <span className="font-semibold text-white/85">
                        Why this guest strengthens your authority:
                      </span>{" "}
                      {selectedEpisode.whyGuestStrengthensAuthority}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/90 font-semibold">Interview questions</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-white/70">
                      {selectedEpisode.interviewQuestions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-white/90 font-semibold">Distribution play</div>
                    <div className="mt-2 grid gap-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="text-xs font-semibold text-white/85">
                          YouTube / vertical hook
                        </div>
                        <div className="mt-1 text-white/70">
                          {selectedEpisode.distribution.verticalHook}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="text-xs font-semibold text-white/85">
                          LinkedIn angle
                        </div>
                        <div className="mt-1 text-white/70">
                          {selectedEpisode.distribution.linkedinAngle}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="text-xs font-semibold text-white/85">
                          Newsletter angle
                        </div>
                        <div className="mt-1 text-white/70">
                          {selectedEpisode.distribution.newsletterAngle}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-white/90 font-semibold">Strategic outcome</div>
                    <div className="mt-1">{selectedEpisode.strategicOutcome}</div>
                  </div>
                </div>
              </div>

              {/* Inspiration / trending */}
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-white/60">
                      Trending / inspirational videos in your niche
                    </div>
                    <div className="text-lg font-extrabold">
                      Fast ideas you can save to this episode
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {getInspirationForEpisode({
                    niche: plan.niche,
                    episodeTitle: selectedEpisode.title,
                  }).map((item) => {
                    const alreadySaved = selectedEpisode.savedInspiration.some(
                      (x) => x.id === item.id
                    );

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-9 w-9 rounded-xl border border-white/10 bg-black/40 p-2">
                            <img
                              src={item.thumbnail}
                              alt={item.platform}
                              className="h-full w-full opacity-80"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-white/60">
                              {item.platform}
                            </div>
                            <div className="mt-1 font-semibold">
                              {clampText(item.title, 70)}
                            </div>
                            <div className="mt-1 text-sm text-white/70">
                              {item.reason}
                            </div>
                          </div>

                          <button
                            onClick={() => addSavedInspiration(selectedEpisode.week, item)}
                            disabled={alreadySaved}
                            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold hover:bg-white/10 disabled:opacity-40"
                          >
                            {alreadySaved ? "Saved" : "Save to this episode"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedEpisode.savedInspiration.length > 0 && (
                  <div className="mt-6">
                    <div className="text-sm font-semibold text-white/85">
                      Saved to this episode
                    </div>
                    <div className="mt-3 space-y-2">
                      {selectedEpisode.savedInspiration.map((x) => (
                        <div
                          key={x.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                        >
                          <div className="min-w-0">
                            <div className="text-xs text-white/60">{x.platform}</div>
                            <div className="truncate text-sm font-semibold">
                              {x.title}
                            </div>
                          </div>
                          <button
                            onClick={() => removeSavedInspiration(selectedEpisode.week, x.id)}
                            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold hover:bg-white/10"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
