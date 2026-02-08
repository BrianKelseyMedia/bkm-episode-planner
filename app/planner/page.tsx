"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const PRICE = 29;
const CHECKOUT_URL = "https://buy.stripe.com/fZu9AS9lG2Pt6IQdQLdAk0f"; // live Stripe Payment Link

type Pillar = "Channel Grower" | "Lead Generator" | "Community Builder";

type EpisodeBrief = {
  week: number;
  pillar: Pillar;
  title: string;

  // “Authority Episode Brief” fields
  audienceTrigger: string;
  positioningAngle: string;
  hostCredibilityMoment: string;
  guestProfile: {
    title: string;
    whyTheyElevateYou: string;
    prompts: string[];
  };
  talkingPoints: string[];
  distributionIdeas: {
    verticalHook: string;
    linkedinAngle: string;
    newsletterAngle: string;
  };
  outcome: string; // what this episode should accomplish (no CTA)
};

type MonthStrategy = {
  month: number;
  label: string;
  perceptionShift: string;
  beliefToReplace: string;
  messageToInstall: string;
};

function pillarForWeek(week: number): Pillar {
  const mod = (week - 1) % 3;
  if (mod === 0) return "Channel Grower";
  if (mod === 1) return "Lead Generator";
  return "Community Builder";
}

function safeLabel(value: string, fallback: string) {
  const v = value.trim();
  return v.length ? v : fallback;
}

function buildShowPositioning(audience: string, problem: string, reason: string) {
  const a = safeLabel(audience, "busy professionals");
  const p = safeLabel(problem, "a real, expensive problem");
  const r = safeLabel(reason, "clear, premium guidance");

  const showPromise = `A weekly show for ${a} that helps them solve ${p} with ${r} in a repeatable format.`;
  const notFor = `Not for people who want generic motivation or surface-level tips. This is for listeners who want clarity, decisions, and momentum.`;
  const categoryNow = `Competes with podcasts and YouTube channels that explain ${p}.`;
  const newCategory = `Creates a “Producer-built authority engine”: each episode is designed to earn trust, position the host, and compound credibility over 12 weeks.`;

  return { showPromise, notFor, categoryNow, newCategory };
}

function buildMonthStrategies(audience: string, problem: string) : MonthStrategy[] {
  const a = safeLabel(audience, "your audience");
  const p = safeLabel(problem, "the core problem");

  return [
    {
      month: 1,
      label: "Authority foundation",
      perceptionShift: `Move ${a} from “I’m overwhelmed” to “I have a clear path on ${p}.”`,
      beliefToReplace: `Replace “this is complicated and risky” with “this is understandable and manageable.”`,
      messageToInstall: `You don’t need more information. You need a simple, repeatable framework and confident execution.`,
    },
    {
      month: 2,
      label: "Credibility compounding",
      perceptionShift: `Move ${a} from “I’m researching” to “I trust this host’s judgment.”`,
      beliefToReplace: `Replace “everyone says the same thing” with “this host sees what others miss.”`,
      messageToInstall: `The best results come from the right sequence: diagnose → decide → act → review.`,
    },
    {
      month: 3,
      label: "Demand & positioning",
      perceptionShift: `Move ${a} from “I’m listening” to “I associate this host with outcomes.”`,
      beliefToReplace: `Replace “I’ll do this later” with “I’m ready to make a smart move now.”`,
      messageToInstall: `Small, consistent steps beat occasional big effort. This show makes consistency easy.`,
    },
  ];
}

function buildEpisodeBrief(
  week: number,
  audience: string,
  problem: string,
  reason: string
): EpisodeBrief {
  const a = safeLabel(audience, "your audience");
  const p = safeLabel(problem, "the core problem");
  const r = safeLabel(reason, "clear, premium guidance");

  const pillar = pillarForWeek(week);

  const baseTitle = `Week ${week}: ${pillar} episode for ${a}`;

  // Pillar-specific templates (structured but not “salesy”)
  if (pillar === "Channel Grower") {
    return {
      week,
      pillar,
      title: baseTitle,

      audienceTrigger: `Right now, people are searching for answers about ${p}. They’re overwhelmed and want a clean explanation they can trust.`,
      positioningAngle: `Most content about ${p} is either too vague or too technical. Your angle: “plain English + real-world decision-making.”`,
      hostCredibilityMoment: `Share a quick “producer’s POV” moment: how you’ve seen smart people get stuck on ${p} and what changed when they simplified the decision.`,
      guestProfile: {
        title: `A practitioner who sees outcomes (not theory)`,
        whyTheyElevateYou: `They help you look like the curator and interpreter — you frame the conversation and translate it into decisions.`,
        prompts: [
          `What do people misunderstand most about ${p}?`,
          `What’s the first decision you make when someone comes to you with this?`,
          `What’s one mistake that quietly costs people months?`,
        ],
      },
      talkingPoints: [
        `Define the core question people search about ${p}.`,
        "Open with a blunt truth that earns attention in 10 seconds.",
        "Explain it in plain language (no jargon).",
        "Share one quick story/example that makes it real.",
        "End with 3 actionable takeaways someone can use today.",
      ],
      distributionIdeas: {
        verticalHook: `“If you’re dealing with ${p}, stop doing this one thing…”`,
        linkedinAngle: `A short “clarity post”: the 3 decisions that actually matter for ${p} (and the noise to ignore).`,
        newsletterAngle: `“The simplest way to think about ${p}” + one quick framework + one example.`,
      },
      outcome: `Trust + clarity. Viewers should feel: “This host makes complex things simple and actionable.”`,
    };
  }

  if (pillar === "Lead Generator") {
    return {
      week,
      pillar,
      title: baseTitle,

      audienceTrigger: `People don’t want more tips — they want a plan. This episode gives a simple sequence to move forward on ${p}.`,
      positioningAngle: `Instead of “advice,” your angle is “a repeatable playbook.” You teach the steps and the order.`,
      hostCredibilityMoment: `Share a quick “behind the scenes” lesson: when you build content systems, consistency beats intensity — and the same is true for solving ${p}.`,
      guestProfile: {
        title: `An operator who built a system around ${p}`,
        whyTheyElevateYou: `They make your show feel like a real solution hub — and you look like the strategist who structures the answer.`,
        prompts: [
          `What’s the exact 3-step process you follow every time?`,
          `What’s the biggest friction point and how do you remove it?`,
          `What would you do in the first 7 days if you had to restart?`,
        ],
      },
      talkingPoints: [
        `Teach a simple framework for solving ${p}.`,
        "Use a clear before/after example to make it tangible.",
        "Show the common mistake and how to avoid it.",
        "Give a 3-step checklist viewers can follow immediately.",
        "Close with one next step that naturally continues the journey.",
      ],
      distributionIdeas: {
        verticalHook: `“Here’s the 3-step checklist I’d use for ${p}…”`,
        linkedinAngle: `A “framework post”: the exact sequence to go from stuck → moving on ${p}.`,
        newsletterAngle: `“The checklist” issue: a clean list people can save and use.`,
      },
      outcome: `Decision momentum. Viewers should feel: “I know exactly what to do next.”`,
    };
  }

  // Community Builder
  return {
    week,
    pillar,
    title: baseTitle,

    audienceTrigger: `This is where you build loyalty. People dealing with ${p} want to feel seen — and they want a steady voice they can rely on.`,
    positioningAngle: `Your angle: “experience + empathy + principles.” You’re not just teaching — you’re guiding.`,
    hostCredibilityMoment: `Tell a short personal observation: how trust is built over time through consistency, quality, and a clear point of view — the same way a strong show grows.`,
    guestProfile: {
      title: `A credible voice with a strong point of view`,
      whyTheyElevateYou: `They let you lead with perspective. You become the host who asks the right questions and frames the lesson.`,
      prompts: [
        `What’s the mindset shift that changes everything with ${p}?`,
        `What’s a story that illustrates the cost of staying stuck?`,
        `What’s one habit that compounds results over time?`,
      ],
    },
    talkingPoints: [
      `Tell a short story about someone in ${a} dealing with ${p}.`,
      "Share a lesson learned and the mindset shift.",
      "Bring in a credible perspective (experience, principle, or example).",
      "Offer 2–3 practical habits that build trust over time.",
      "Close with a simple reflection question for the audience.",
    ],
    distributionIdeas: {
      verticalHook: `“The mindset shift that makes ${p} feel lighter…”`,
      linkedinAngle: `A story-driven post: a moment where the right perspective changed the outcome.`,
      newsletterAngle: `A short story + the lesson + “try this one habit this week.”`,
    },
    outcome: `Loyalty + positioning. Viewers should feel: “This host gets it — and I want to keep coming back.”`,
  };
}

function buildPlan(audience: string, problem: string, reason: string): EpisodeBrief[] {
  const plan: EpisodeBrief[] = [];
  for (let week = 1; week <= 12; week++) {
    plan.push(buildEpisodeBrief(week, audience, problem, reason));
  }
  return plan;
}

function sectionTitle(brief: EpisodeBrief) {
  return `${brief.title}`;
}

export default function PlannerPage() {
  const searchParams = useSearchParams();
  const isPaid = searchParams.get("paid") === "1";

  const [audience, setAudience] = useState("");
  const [problem, setProblem] = useState("");
  const [reason, setReason] = useState("");
  const [generated, setGenerated] = useState(false);

  // Option A: arriving with paid=1 auto-shows the plan view (premium UX)
  useEffect(() => {
    if (isPaid) setGenerated(true);
  }, [isPaid]);

  const plan = useMemo(() => buildPlan(audience, problem, reason), [audience, problem, reason]);
  const monthStrategies = useMemo(() => buildMonthStrategies(audience, problem), [audience, problem]);
  const positioning = useMemo(
    () => buildShowPositioning(audience, problem, reason),
    [audience, problem, reason]
  );

  const suggestedTitle = useMemo(() => {
    const a = safeLabel(audience, "Professionals");
    const p = safeLabel(problem, "a real problem");
    return `A show for ${a} solving ${p}`;
  }, [audience, problem]);

  const suggestedSummary = useMemo(() => {
    const a = safeLabel(audience, "professionals");
    const r = safeLabel(reason, "clear, practical guidance");
    return `A show for ${a} that delivers ${r} in a premium, repeatable weekly format.`;
  }, [audience, reason]);

  const visibleWeeks = isPaid ? 12 : 3; // demo: 3 weeks, paid: 12 weeks
  const visible = plan.slice(0, visibleWeeks);
  const locked = plan.slice(visibleWeeks);

  const copyPlan = async () => {
    const lines: string[] = [];

    lines.push("12-Week Authority Episode Planner — Full Plan");
    lines.push(`Title: ${suggestedTitle}`);
    lines.push(`Audience: ${audience || "-"}`);
    lines.push(`Problem: ${problem || "-"}`);
    lines.push(`Why tune in: ${reason || "-"}`);
    lines.push("");

    lines.push("Show Positioning Snapshot");
    lines.push(`- Show promise: ${positioning.showPromise}`);
    lines.push(`- Not for: ${positioning.notFor}`);
    lines.push(`- Competes with: ${positioning.categoryNow}`);
    lines.push(`- New category: ${positioning.newCategory}`);
    lines.push("");

    lines.push("Monthly Strategy");
    for (const m of monthStrategies) {
      lines.push(`Month ${m.month}: ${m.label}`);
      lines.push(`- Perception shift: ${m.perceptionShift}`);
      lines.push(`- Belief to replace: ${m.beliefToReplace}`);
      lines.push(`- Message to install: ${m.messageToInstall}`);
      lines.push("");
    }

    lines.push("Weekly Episode Briefs");
    lines.push("");

    for (const w of plan) {
      lines.push(sectionTitle(w));
      lines.push(`Pillar: ${w.pillar}`);
      lines.push(`Audience trigger: ${w.audienceTrigger}`);
      lines.push(`Positioning angle: ${w.positioningAngle}`);
      lines.push(`Host credibility moment: ${w.hostCredibilityMoment}`);
      lines.push(`Ideal guest profile: ${w.guestProfile.title}`);
      lines.push(`Why they elevate you: ${w.guestProfile.whyTheyElevateYou}`);
      lines.push("Guest prompts:");
      for (const p of w.guestProfile.prompts) lines.push(`- ${p}`);
      lines.push("Talking points:");
      for (const t of w.talkingPoints) lines.push(`- ${t}`);
      lines.push("Distribution ideas:");
      lines.push(`- Vertical hook: ${w.distributionIdeas.verticalHook}`);
      lines.push(`- LinkedIn angle: ${w.distributionIdeas.linkedinAngle}`);
      lines.push(`- Newsletter angle: ${w.distributionIdeas.newsletterAngle}`);
      lines.push(`Outcome: ${w.outcome}`);
      lines.push("");
    }

    await navigator.clipboard.writeText(lines.join("\n"));
    alert("Copied the full plan (with briefs) to your clipboard.");
  };

  const Card = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] ${className}`}>{children}</div>
  );

  const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-200">
      {children}
    </span>
  );

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-xs font-semibold tracking-wide text-zinc-400">{children}</div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.10),transparent_60%)]" />

      {/* Header */}
      <header className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/bkm-logo.png"
                alt="Brian Kelsey Media"
                width={260}
                height={80}
                className="h-12 w-auto"
                priority
              />
              <span className="hidden sm:block text-base font-semibold tracking-wide text-zinc-200">
                Premium video strategy + production
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isPaid ? (
              <span className="inline-flex items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
                Unlocked
              </span>
            ) : (
              <Link
                href={CHECKOUT_URL}
                className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-amber-400 transition"
              >
                Buy the Full Version
              </Link>
            )}

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Back
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 py-10">
        {/* Top grid: Inputs + Show framing */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Inputs */}
          <Card className="p-6">
            <h1 className="text-2xl font-bold">Your 12-Week Quarter Planner</h1>
            <p className="mt-2 text-sm text-zinc-300">
              Answer three prompts. Generate a quarterly plan (Weeks 1–12). Demo preview shows Weeks 1–3.
            </p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <div className="text-sm font-semibold text-zinc-200">Who is your show for?</div>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Founders, advisors, realtors, lawyers..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-400/60"
                />
              </label>

              <label className="block">
                <div className="text-sm font-semibold text-zinc-200">What problem does it solve?</div>
                <input
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Hiring, wealth planning, divorce, leadership..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-400/60"
                />
              </label>

              <label className="block">
                <div className="text-sm font-semibold text-zinc-200">Why should they tune in?</div>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Clear answers, better decisions, fewer mistakes..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-400/60"
                />
              </label>

              <button
                onClick={() => setGenerated(true)}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black shadow-sm hover:bg-amber-400 transition"
              >
                Generate my 12-week plan
              </button>

              {!isPaid ? (
                <p className="text-xs text-zinc-500">
                  Demo preview shows Weeks 1–3. Full version unlocks Weeks 4–12 + copy/export.
                </p>
              ) : (
                <p className="text-xs text-zinc-500">
                  You’re unlocked. Fill this in (or leave blank) and click Generate to refresh your plan.
                </p>
              )}
            </div>
          </Card>

          {/* Right: Suggested framing + positioning snapshot */}
          <div className="space-y-5">
            <Card className="p-6">
              <SectionLabel>Suggested show framing</SectionLabel>
              <div className="mt-2 text-xl font-bold text-white">
                {generated ? suggestedTitle : "Your Show (Working Title)"}
              </div>
              <p className="mt-2 text-sm text-zinc-300">
                {generated ? suggestedSummary : "Generate a plan to see your framing appear here."}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={copyPlan}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Copy full plan
                </button>

                {!isPaid && (
                  <Link
                    href={CHECKOUT_URL}
                    className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition"
                  >
                    Unlock all 12 weeks (${PRICE})
                  </Link>
                )}
              </div>
            </Card>

            {generated && (
              <Card className="p-6">
                <SectionLabel>Show positioning snapshot</SectionLabel>

                <div className="mt-3 space-y-3 text-sm text-zinc-200">
                  <div>
                    <div className="text-xs font-semibold text-zinc-400">Show promise</div>
                    <div className="mt-1 text-zinc-200">{positioning.showPromise}</div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-zinc-400">Not for</div>
                    <div className="mt-1 text-zinc-200">{positioning.notFor}</div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-zinc-400">Competes with</div>
                    <div className="mt-1 text-zinc-200">{positioning.categoryNow}</div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-zinc-400">New category you create</div>
                    <div className="mt-1 text-zinc-200">{positioning.newCategory}</div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Monthly strategy */}
        {generated && (
          <div className="mt-10">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="text-sm font-semibold text-zinc-200">Quarter-level strategy</div>
                <div className="mt-1 text-xs text-zinc-400">A monthly north star so the weeks compound.</div>
              </div>
              <div className="text-xs text-zinc-500">Months 1–3</div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {monthStrategies.map((m) => (
                <Card key={m.month} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-400">Month {m.month}</div>
                    <Pill>{m.label}</Pill>
                  </div>

                  <div className="mt-3 space-y-3 text-sm text-zinc-200">
                    <div>
                      <div className="text-xs font-semibold text-zinc-400">Perception shift</div>
                      <div className="mt-1">{m.perceptionShift}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-400">Belief to replace</div>
                      <div className="mt-1">{m.beliefToReplace}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-400">Message to install</div>
                      <div className="mt-1">{m.messageToInstall}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Weekly plan */}
        {generated && (
          <div className="mt-10">
            {!isPaid ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Visible weeks */}
                <div className="space-y-4">
                  {visible.map((w) => (
                    <WeekCard key={w.week} brief={w} />
                  ))}
                </div>

                {/* Locked column */}
                <div className="space-y-4">
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
                    <div className="text-xs text-amber-200">Unlock Weeks 4–12</div>
                    <div className="mt-2 text-xl font-bold">Full Quarterly Plan</div>
                    <p className="mt-2 text-sm text-zinc-200">
                      Get the complete 12-week schedule with episode briefs, guest archetypes, distribution ideas, and outcomes.
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <Link
                        href={CHECKOUT_URL}
                        className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition"
                      >
                        Buy full access (${PRICE})
                      </Link>
                      <span className="text-xs text-zinc-300">One-time purchase</span>
                    </div>
                  </div>

                  {locked.map((w) => (
                    <div
                      key={w.week}
                      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.0),rgba(0,0,0,0.55))]" />
                      <div className="absolute inset-0 backdrop-blur-[2px]" />
                      <div className="relative">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-zinc-400">Week {w.week}</div>
                          <Pill>{w.pillar}</Pill>
                        </div>
                        <h3 className="mt-2 text-lg font-bold text-zinc-200">Locked</h3>
                        <p className="mt-2 text-sm text-zinc-400">Unlock the full plan to view Week {w.week}.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // ✅ Paid view: clean premium full plan (no “locked” column at all)
              <div className="space-y-4">
                <div className="rounded-2xl border border-amber-500/20 bg-white/[0.04] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-zinc-400">Full plan</div>
                      <div className="mt-1 text-xl font-bold">Your complete 12-week episode brief</div>
                      <div className="mt-1 text-sm text-zinc-300">
                        Weekly structure + positioning + guest archetypes + distribution angles + outcomes.
                      </div>
                    </div>
                    <button
                      onClick={copyPlan}
                      className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
                    >
                      Copy full plan
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {visible.map((w) => (
                    <WeekCard key={w.week} brief={w} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <footer className="mt-14 border-t border-white/10 pt-8 text-xs text-zinc-500">
          © {new Date().getFullYear()} Brian Kelsey Media. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

function WeekCard({ brief }: { brief: EpisodeBrief }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-zinc-400">Week {brief.week}</div>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-200">
          {brief.pillar}
        </span>
      </div>

      <h3 className="mt-2 text-lg font-bold">{brief.title}</h3>

      <div className="mt-4 space-y-4 text-sm text-zinc-200">
        <div>
          <div className="text-xs font-semibold text-zinc-400">Audience trigger</div>
          <div className="mt-1">{brief.audienceTrigger}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-400">Positioning angle</div>
          <div className="mt-1">{brief.positioningAngle}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-400">Host credibility moment</div>
          <div className="mt-1">{brief.hostCredibilityMoment}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-400">Ideal guest profile</div>
          <div className="mt-1 font-semibold text-white">{brief.guestProfile.title}</div>
          <div className="mt-2 text-zinc-200">
            <span className="text-xs font-semibold text-zinc-400">Why they elevate you: </span>
            {brief.guestProfile.whyTheyElevateYou}
          </div>
          <ul className="mt-2 space-y-2 text-zinc-300">
            {brief.guestProfile.prompts.map((p, idx) => (
              <li key={idx}>• {p}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-400">Talking points</div>
          <ul className="mt-2 space-y-2 text-zinc-300">
            {brief.talkingPoints.map((t, idx) => (
              <li key={idx}>• {t}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-400">Distribution ideas</div>
          <div className="mt-2 space-y-2 text-zinc-300">
            <div>
              <span className="text-xs font-semibold text-zinc-400">Vertical hook: </span>
              {brief.distributionIdeas.verticalHook}
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-400">LinkedIn angle: </span>
              {brief.distributionIdeas.linkedinAngle}
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-400">Newsletter angle: </span>
              {brief.distributionIdeas.newsletterAngle}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-400">Strategic outcome</div>
          <div className="mt-1 text-zinc-200">{brief.outcome}</div>
        </div>
      </div>
    </div>
  );
}
