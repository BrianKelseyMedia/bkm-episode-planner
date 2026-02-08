"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getInspirationPack, type InspirationItem } from "@/lib/inspiration";

type FormatType = "Interview" | "Solo" | "Hybrid";
type ToneType = "Practical" | "Bold" | "Empathetic" | "Analytical";

type ShowInputs = {
  showName: string;
  niche: string;
  audience: string;
  problem: string;
  promise: string;
  format: FormatType;
  tone: ToneType;
  offer: string;
};

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

  // NEW goodies
  coldOpenHook: string;
  episodeStructure: string[];
  interviewQuestions: string[];
  titleIdeas: string[];
  brollIdeas: string[];

  inspiration: InspirationItem[];
  savedInspiration: InspirationItem[];
};

const BUY_URL = "https://planner.briankelseymedia.com/planner?paid=1"; // swap later to real checkout

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function clean(s: string) {
  return (s || "").trim();
}

function buildWeeks(inputs: ShowInputs): EpisodeWeek[] {
  const showName = clean(inputs.showName) || "Your show";
  const niche = clean(inputs.niche) || "your niche";
  const audience = clean(inputs.audience) || `${niche} professionals`;
  const problem = clean(inputs.problem) || `a frustrating problem in ${niche}`;
  const promise = clean(inputs.promise) || `a clear, repeatable outcome`;
  const format = inputs.format;
  const tone = inputs.tone;
  const offer = clean(inputs.offer);

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

  const toneLine =
    tone === "Practical"
      ? "practical, step-by-step"
      : tone === "Bold"
      ? "direct, contrarian, no fluff"
      : tone === "Empathetic"
      ? "human, supportive, reality-based"
      : "clear, analytical, evidence-driven";

  const formatLine =
    format === "Interview"
      ? "Designed as an interview episode with a strong guest archetype."
      : format === "Solo"
      ? "Designed as a solo episode with tight teaching + examples."
      : "Designed as a hybrid: quick solo framing + short guest segment.";

  return Array.from({ length: 12 }).map((_, i) => {
    const week = i + 1;
    const topic = baseTopics[i] ?? `Week ${week} topic`;
    const inspiration = getInspirationPack(niche, topic);

    // Interview questions: adapt slightly for format
    const questionsBase = [
      `What are people in ${audience} doing right now that makes "${problem}" worse?`,
      `What’s the first sign someone is heading toward the wrong outcome?`,
      `What’s the “common advice” here that you disagree with, and why?`,
      `What is the simplest framework you use to decide what to do next?`,
      `Can you share a real example where this went wrong, and what fixed it?`,
      `What would you do in the first 7 days if you were starting from zero today?`,
      `What’s the biggest objection you hear, and how do you reframe it?`,
      `If someone implements this, what should change in their life/business in 30 days?`,
    ];

    const soloTweaks =
      format === "Solo"
        ? questionsBase.map((q) => `Teaching prompt: ${q}`)
        : questionsBase;

    const guestArchetype =
      format === "Solo"
        ? `Optional: a ${niche} operator who made the mistake, fixed it, and can describe the “before/after.”`
        : `A ${niche} operator who lived through this (not a generic expert) — scars + receipts.`;

    const titleIdeas = [
      `${topic} (What ${audience} get wrong)`,
      `The real reason ${audience} struggle with ${problem}`,
      `A simple framework to get ${promise} (without wasting time)`,
    ];

    const coldOpenHook =
      tone === "Bold"
        ? `Hot take: if you’re in ${niche} and you’re doing X, you’re silently paying for it every week. Here’s the fix.`
        : tone === "Empathetic"
        ? `If you’ve felt stuck with ${problem}, you’re not broken. You’re missing a system. Let’s build it.`
        : tone === "Analytical"
        ? `Let’s break this down: why ${problem} happens, what data/behavior signals it early, and what changes it fast.`
        : `Here’s the one shift that helps ${audience} get ${promise} without the overwhelm.`;

    const episodeStructure: string[] =
      format === "Interview"
        ? [
            `Cold open (10–15s): ${coldOpenHook}`,
            `Set the stakes: define the problem + what it costs`,
            `Guest story: “the moment it clicked”`,
            `Framework: 3 key moves + common mistakes`,
            `Rapid-fire: 5 tactical do’s/don’ts`,
            `Wrap: 1 action for this week + next episode tease`,
          ]
        : format === "Solo"
        ? [
            `Cold open (10–15s): ${coldOpenHook}`,
            `Define the problem in one sentence`,
            `Teach the framework (3 parts)`,
            `Example + “what most people miss”`,
            `Quick checklist / recap`,
            `Wrap: 1 action for this week + next episode tease`,
          ]
        : [
            `Cold open (10–15s): ${coldOpenHook}`,
            `Solo setup: your take + why it matters now`,
            `Guest clip / example: proof + nuance`,
            `Framework: 3 moves + a pitfall`,
            `Distribution-ready recap (3 bullets)`,
            `Wrap: 1 action for this week + next episode tease`,
          ];

    const brollIdeas = [
      `On-screen checklist / 3-bullet framework graphic`,
      `Before/after example (even a simple text overlay “Before / After”)`,
      `One “myth vs reality” slide`,
      `A quick clip of you pointing at the key line (for Reels/Shorts)`,
    ];

    const distributionPlay = {
      verticalHook: `“If you’re in ${niche}, stop doing this one thing…”`,
      linkedinAngle: `Myth vs reality: what ${audience} believe about ${problem}, why it’s tempting, and what actually works.`,
      newsletterAngle: `A 5-minute breakdown: the mistake, the fix, and a simple checklist.`,
    };

    const audienceTrigger = `Your ${audience} are dealing with ${problem} — and most of them don’t realize the “obvious” move is exactly what keeps them stuck.`;

    const positioningAngle = `Producer’s angle (${toneLine}): “Here’s what actually works in the real world (and why the common advice fails).”`;

    const hostCredibilityMoment = `Insert a Brian moment: a real story from a shoot/client conversation that proves you’ve seen this play out. (One specific example, not a résumé.)`;

    const strategicOutcome = offer
      ? `Trust + objection removal (and a clean bridge to your offer: ${offer}).`
      : `Trust + repositioning (you become the person who sees around corners).`;

    return {
      week,
      title: topic,
      audienceTrigger,
      positioningAngle,
      hostCredibilityMoment,
      guestArchetype,
      distributionPlay,
      strategicOutcome,

      coldOpenHook,
      episodeStructure,
      interviewQuestions: soloTweaks,
      titleIdeas,
      brollIdeas,

      inspiration,
      savedInspiration: [],
    };
  });
}

function weekToText(w: EpisodeWeek) {
  return [
    `Week ${w.week}: ${w.title}`,
    ``,
    `Audience trigger`,
    `- ${w.audienceTrigger}`,
    ``,
    `Positioning angle`,
    `- ${w.positioningAngle}`,
    ``,
    `Host credibility moment`,
    `- ${w.hostCredibilityMoment}`,
    ``,
    `Guest suggestion (archetype)`,
    `- ${w.guestArchetype}`,
    ``,
    `Cold open hook`,
    `- ${w.coldOpenHook}`,
    ``,
    `Episode structure`,
    ...w.episodeStructure.map((x) => `- ${x}`),
    ``,
    `Suggested interview questions`,
    ...w.interviewQuestions.map((q) => `- ${q}`),
    ``,
    `Title ideas`,
    ...w.titleIdeas.map((t) => `- ${t}`),
    ``,
    `B-roll / visuals ideas`,
    ...w.brollIdeas.map((b) => `- ${b}`),
    ``,
    `Distribution play`,
    `- Vertical hook: ${w.distributionPlay.verticalHook}`,
    `- LinkedIn angle: ${w.distributionPlay.linkedinAngle}`,
    `- Newsletter angle: ${w.distributionPlay.newsletterAngle}`,
    ``,
    `Strategic outcome`,
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

  const [inputs, setInputs] = useState<ShowInputs>({
    showName: "",
    niche: "",
    audience: "",
    problem: "",
    promise: "",
    format: "Interview",
    tone: "Practical",
    offer: "",
  });

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
    await new Promise((r) => setTimeout(r, 250));
    setWeeks(buildWeeks(inputs));
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
      <div className={cx("grid gap-10 md:grid-cols-2")}>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Episode Planner
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
            Welcome to your episode planner.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
            Answer a few quick questions and this generates a 12-week plan as{" "}
            <span className="font-semibold text-white">Authority Episode Briefs</span>{" "}
            (strategy, positioning, guest archetypes, distribution plays, plus inspiration you can save to each episode).
          </p>

          {!paid && (
            <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-white/85">
              Demo preview shows <span className="font-semibold text-white">Weeks 1–3</span>.
              <span className="text-white/70"> Unlock to export the full 12 weeks.</span>
            </div>
          )}
        </div>

        <div className="md:justify-self-end">
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

      {/* Inputs */}
      <div className={cx("mt-10 rounded-3xl border border-white/10 bg-white/5 p-6", paid ? "md:p-7" : "md:p-8")}>
        <div className="grid gap-4 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <label className="text-sm text-white/70">Show name</label>
            <input
              value={inputs.showName}
              onChange={(e) => setInputs((p) => ({ ...p, showName: e.target.value }))}
              placeholder="e.g., Dogster"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/30"
            />
          </div>

          <div className="md:col-span-6">
            <label className="text-sm text-white/70">Niche / audience category</label>
            <input
              value={inputs.niche}
              onChange={(e) => setInputs((p) => ({ ...p, niche: e.target.value }))}
              placeholder="e.g., dog training, dentists, founders"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/30"
            />
          </div>

          <div className="md:col-span-12">
            <label className="text-sm text-white/70">Who is this show for?</label>
            <input
              value={inputs.audience}
              onChange={(e) => setInputs((p) => ({ ...p, audience: e.target.value }))}
              placeholder="e.g., busy dog owners who need quick, calm, repeatable training routines"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/30"
            />
          </div>

          <div className="md:col-span-6">
            <label className="text-sm text-white/70">What problem do you solve?</label>
            <input
              value={inputs.problem}
              onChange={(e) => setInputs((p) => ({ ...p, problem: e.target.value }))}
              placeholder="e.g., dogs that pull, bark, or ignore commands"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/30"
            />
          </div>

          <div className="md:col-span-6">
            <label className="text-sm text-white/70">What outcome do you promise?</label>
            <input
              value={inputs.promise}
              onChange={(e) => setInputs((p) => ({ ...p, promise: e.target.value }))}
              placeholder="e.g., a calm dog and a predictable routine in 30 days"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/30"
            />
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-white/70">Format</label>
            <select
              value={inputs.format}
              onChange={(e) => setInputs((p) => ({ ...p, format: e.target.value as FormatType }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            >
              <option>Interview</option>
              <option>Solo</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-white/70">Tone</label>
            <select
              value={inputs.tone}
              onChange={(e) => setInputs((p) => ({ ...p, tone: e.target.value as ToneType }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            >
              <option>Practical</option>
              <option>Bold</option>
              <option>Empathetic</option>
              <option>Analytical</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-white/70">Offer / CTA (optional)</label>
            <input
              value={inputs.offer}
              onChange={(e) => setInputs((p) => ({ ...p, offer: e.target.value }))}
              placeholder="e.g., free consult, course, newsletter"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/30"
            />
          </div>

          <div className="md:col-span-12 mt-2 flex flex-wrap gap-3 md:justify-end">
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

        {!weeks && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm font-semibold text-white">More tailored</div>
              <div className="mt-2 text-sm text-white/70">
                Add the problem + promise so episodes map to a real outcome, not random topics.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm font-semibold text-white">Producer extras</div>
              <div className="mt-2 text-sm text-white/70">
                Every week includes a cold open hook, episode beats, and interview questions.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm font-semibold text-white">Save inspiration</div>
              <div className="mt-2 text-sm text-white/70">
                Find trending videos and save them directly to the episode you’re planning.
              </div>
            </div>
          </div>
        )}

        {!paid && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
            <div className="text-sm text-white/70">
              Want the full version? Unlock all 12 weeks + export the whole plan.
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
              <div className="text-sm text-white/60">Week {w.week}</div>
              <div className="mt-1 text-2xl font-semibold">{w.title}</div>

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

              {/* NEW producer extras */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold">Cold open hook</div>
                  <div className="mt-2 text-sm text-white/70">{w.coldOpenHook}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold">Title ideas</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
                    {w.titleIdeas.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold">Episode structure</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
                  {w.episodeStructure.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold">Suggested interview questions</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
                  {w.interviewQuestions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold">B-roll / visuals ideas</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
                  {w.brollIdeas.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
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

              {/* Inspiration */}
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
                          {s.title} <span className="text-white/50">({s.platform})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Demo unlock line under week 3 */}
              {!paid && w.week === 3 && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                  <div className="text-sm text-white/75">
                    Want Weeks 4–12 + full export? Unlock the full planner below.
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
