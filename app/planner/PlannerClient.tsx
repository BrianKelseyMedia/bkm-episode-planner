"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { STRIPE_PAYMENT_LINK } from "@/lib/stripe";

// NOTE: This file does NOT implement true payment verification.
// It only:
// - runs demo by default (Weeks 1–3)
// - supports "paid mode" if ?paid=1 is present (for preview/testing)
// - routes ALL buy/unlock links to Stripe (not to ?paid=1)

type Inputs = {
  showName: string;
  niche: string;
  whoFor: string;
  problem: string;
  outcome: string;
};

type Episode = {
  week: number;
  title: string;
  audienceTrigger: string;
  positioningAngle: string;
  hostCredibilityMoment: string;
  guestArchetype: string;
  distributionPlay: string;
  strategicOutcome: string;
  interviewQuestions: string[];
};

function buildEpisodes(inputs: Inputs): Episode[] {
  const base = {
    whoFor: inputs.whoFor?.trim() || inputs.niche?.trim() || "your audience",
    problem: inputs.problem?.trim() || "a frustrating, expensive problem",
    outcome: inputs.outcome?.trim() || "a clear, repeatable win",
  };

  const make = (week: number, title: string): Episode => ({
    week,
    title,
    audienceTrigger: `Your audience (${base.whoFor}) is dealing with ${base.problem} and doesn’t realize the real lever is changing one key habit/belief.`,
    positioningAngle: `Make the case that the “common advice” in ${inputs.niche} is incomplete, and your framework is the cleaner path to ${base.outcome}.`,
    hostCredibilityMoment:
      "Insert a specific moment: a client story, a production insight, or a mistake you’ve seen repeatedly — and what you do differently now.",
    guestArchetype:
      "Guest archetype (not generic): a practitioner who lived this problem and can validate the repositioning from experience.",
    distributionPlay:
      "Vertical hook + LinkedIn angle + newsletter angle. Hook: the misconception. LinkedIn: contrarian insight. Newsletter: step-by-step mini playbook.",
    strategicOutcome:
      "Objection removal + authority proof (the audience should think: ‘this person sees the real game’).",
    interviewQuestions: [
      "What are people doing that feels ‘right’ but is actually keeping them stuck?",
      "What’s the hidden constraint most folks don’t see until it’s too late?",
      "What’s the one shift that creates momentum fastest?",
      "What’s the ‘producer lens’ way to think about this problem?",
      "What would you do if you had to fix this in 30 days?",
    ],
  });

  const show = inputs.showName?.trim() || "Your Show";

  // Simple default plan (12). You can swap this for your AI output later.
  const titles = [
    `The real reason ${base.whoFor} don’t get ${base.outcome} (and what to do instead)`,
    `The 3 mistakes that keep ${base.whoFor} stuck with ${base.problem}`,
    `The simple framework to get ${base.outcome} without overwhelm`,
    `What the top 1% do differently in ${inputs.niche}`,
    `How to create a repeatable weekly engine (without burning out)`,
    `The mindset shift that changes everything for ${base.whoFor}`,
    `How to diagnose the real problem behind ${base.problem}`,
    `Your “authority move” playbook for the next 30 days`,
    `What to stop doing immediately (and why it’s costing you)`,
    `The checklist you can use every week to stay consistent`,
    `The guest archetypes that make you look like the expert`,
    `How to turn ${show} into a lead engine (without being salesy)`,
  ];

  return titles.map((t, i) => make(i + 1, t));
}

export default function PlannerClient() {
  const sp = useSearchParams();
  const paid = sp.get("paid") === "1"; // demo/preview only

  const [inputs, setInputs] = useState<Inputs>({
    showName: "",
    niche: "",
    whoFor: "",
    problem: "",
    outcome: "",
  });

  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const visibleWeeks = paid ? 12 : 3;

  const planTitle = useMemo(() => {
    const a = inputs.showName?.trim();
    const b = inputs.niche?.trim();
    if (!a && !b) return "Your plan";
    if (a && b) return `${a} • ${b}`;
    return a || b || "Your plan";
  }, [inputs.showName, inputs.niche]);

  const glowBg = (
    <div className="pointer-events-none fixed inset-0 opacity-60">
      <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute top-40 left-16 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute top-72 right-10 h-[420px] w-[420px] rounded-full bg-white/5 blur-3xl" />
    </div>
  );

  return (
    <div className="relative">
      {glowBg}

      {/* Top bar */}
      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-3">
          <Image
            src="/bkm-logo.png"
            alt="Brian Kelsey Media"
            width={34}
            height={34}
            className="rounded-md"
            priority
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold">Brian Kelsey Media</div>
            <div className="text-xs text-white/60">Episode Planner</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Home
          </Link>

          {!paid && (
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400"
            >
              Unlock full version ($29)
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pb-10 pt-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Episode Planner
          </div>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Welcome to your
            <br />
            episode planner.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            Answer a few quick questions and this generates a 12-week plan as{" "}
            <span className="font-semibold text-white">Authority Episode Briefs</span>{" "}
            (strategy, positioning, guest archetypes, distribution plays, plus inspiration you can
            save to each episode).
          </p>

          {!paid && (
            <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-white/80">
              Demo preview shows <span className="font-semibold text-white">Weeks 1–3</span>. Unlock
              to export the full 12 weeks.
            </div>
          )}
        </div>

        <div className="relative">
          <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_120px_rgba(255,170,0,0.15)]">
            <div className="relative aspect-video w-full">
              <Image
                src="/bkm-landing.png"
                alt="Brian Kelsey Media"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Form + Actions */}
      <section className="relative mx-auto w-full max-w-6xl px-6 pb-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="Show name"
              value={inputs.showName}
              onChange={(v) => setInputs((s) => ({ ...s, showName: v }))}
              placeholder="e.g., Dogster"
            />
            <Field
              label="Niche / audience category"
              value={inputs.niche}
              onChange={(v) => setInputs((s) => ({ ...s, niche: v }))}
              placeholder="e.g., dog training, dentists, founders"
            />
            <Field
              label="Who is this show for?"
              value={inputs.whoFor}
              onChange={(v) => setInputs((s) => ({ ...s, whoFor: v }))}
              placeholder="e.g., busy dog owners who want calm, repeatable routines"
              full
            />
            <Field
              label="What problem do you solve?"
              value={inputs.problem}
              onChange={(v) => setInputs((s) => ({ ...s, problem: v }))}
              placeholder="e.g., dogs that pull, bark, or ignore commands"
            />
            <Field
              label="What outcome do you promise?"
              value={inputs.outcome}
              onChange={(v) => setInputs((s) => ({ ...s, outcome: v }))}
              placeholder="e.g., a calm dog + predictable routine in 30 days"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const built = buildEpisodes(inputs);
                setEpisodes(built);
                setActiveWeek(1);
              }}
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
            >
              {paid ? "Generate my 3-month plan" : "Generate my demo 3-month plan"}
            </button>

            {episodes && (
              <button
                onClick={() => {
                  // Copy only what user can access in demo; all in paid mode.
                  const allowed = episodes.slice(0, visibleWeeks);
                  const text = allowed
                    .map((e) => {
                      return [
                        `Week ${e.week}: ${e.title}`,
                        ``,
                        `Audience trigger: ${e.audienceTrigger}`,
                        `Positioning angle: ${e.positioningAngle}`,
                        `Host credibility moment: ${e.hostCredibilityMoment}`,
                        `Guest archetype: ${e.guestArchetype}`,
                        `Distribution play: ${e.distributionPlay}`,
                        `Strategic outcome: ${e.strategicOutcome}`,
                        `Interview questions:`,
                        ...e.interviewQuestions.map((q) => `- ${q}`),
                        ``,
                      ].join("\n");
                    })
                    .join("\n");

                  navigator.clipboard.writeText(text);
                }}
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Copy plan
              </button>
            )}

            {!paid && (
              <a
                href={STRIPE_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Unlock full 12 weeks ($29)
              </a>
            )}
          </div>

          {!episodes && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
              <div className="text-white font-semibold">How to use this</div>
              <ul className="mt-2 space-y-2">
                <li>• Enter a few details about the show (audience + outcome).</li>
                <li>• Generate your plan and skim Weeks 1–3.</li>
                <li>• Use the interview questions to outline your episode fast.</li>
                <li>• Unlock to get all 12 weeks + save inspiration videos per episode.</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Plan */}
      {episodes && (
        <section className="relative mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="text-sm text-white/60">Your plan</div>
            <div className="mt-2 text-3xl font-extrabold tracking-tight">
              {planTitle}
            </div>

            {/* Week tabs */}
            <div className="mt-6 flex flex-wrap gap-2">
              {episodes.map((e) => {
                const locked = !paid && e.week > 3;
                return (
                  <button
                    key={e.week}
                    onClick={() => {
                      if (!locked) setActiveWeek(e.week);
                    }}
                    className={[
                      "rounded-full px-4 py-2 text-sm font-semibold transition",
                      locked
                        ? "bg-white/5 text-white/25 cursor-not-allowed"
                        : e.week === activeWeek
                        ? "bg-white text-black"
                        : "bg-white/10 text-white hover:bg-white/15",
                    ].join(" ")}
                    title={locked ? "Locked in demo" : `Week ${e.week}`}
                  >
                    Week {e.week}
                  </button>
                );
              })}
            </div>

            {/* Inline upsell under week 3 only (demo) */}
            {!paid && activeWeek === 3 && (
              <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-white/80 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-white">Demo shows Weeks 1–3.</span>{" "}
                  Unlock the full 12 weeks + save inspiration videos to each episode.
                </div>
                <a
                  href={STRIPE_PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-black hover:bg-amber-400"
                >
                  Unlock the full 12 weeks
                </a>
              </div>
            )}

            {/* Episode card */}
            <div className="mt-6">
              {(() => {
                const episode = episodes.find((e) => e.week === activeWeek);
                if (!episode) return null;

                const locked = !paid && episode.week > 3;
                if (locked) {
                  // Don’t show the old “Week 4 locked” big screen anymore.
                  // Just keep user on week 3, but if they click later tabs, it won’t switch.
                  return null;
                }

                return (
                  <div className="rounded-3xl border border-white/10 bg-black/30 p-8">
                    <div className="text-sm text-white/60">Week {episode.week}</div>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
                      {episode.title}
                    </h2>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <Block title="Audience trigger" text={episode.audienceTrigger} />
                      <Block title="Positioning angle" text={episode.positioningAngle} />
                      <Block title="Host credibility moment" text={episode.hostCredibilityMoment} />
                      <Block title="Guest archetype" text={episode.guestArchetype} />
                      <Block title="Distribution play" text={episode.distributionPlay} />
                      <Block title="Strategic outcome" text={episode.strategicOutcome} />
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="font-semibold text-white">Suggested interview questions</div>
                      <ul className="mt-3 space-y-2 text-sm text-white/75">
                        {episode.interviewQuestions.map((q, idx) => (
                          <li key={idx}>• {q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      <footer className="relative mx-auto w-full max-w-6xl px-6 pb-10 text-xs text-white/50">
        © {new Date().getFullYear()} Brian Kelsey Media
      </footer>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  full?: boolean;
}) {
  return (
    <label className={full ? "md:col-span-2" : ""}>
      <div className="mb-2 text-sm text-white/70">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/25 outline-none focus:border-amber-500/40"
      />
    </label>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-white/75">{text}</div>
    </div>
  );
}
