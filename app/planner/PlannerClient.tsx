"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const PRICE = 29;
const CHECKOUT_URL = "https://buy.stripe.com/fZu9AS9lG2Pt6IQdQLdAk0f";

type Pillar = "Channel Grower" | "Lead Generator" | "Community Builder";

type WeekPlan = {
  week: number;
  pillar: Pillar;
  title: string;
  bullets: string[];
};

function pillarForWeek(week: number): Pillar {
  const mod = (week - 1) % 3;
  if (mod === 0) return "Channel Grower";
  if (mod === 1) return "Lead Generator";
  return "Community Builder";
}

function buildPlan(audience: string, problem: string, reason: string): WeekPlan[] {
  const audienceLabel = audience.trim() || "your audience";
  const problemLabel = problem.trim() || "a clear problem";
  const reasonLabel = reason.trim() || "a clear reason to tune in";

  const baseBullets = (pillar: Pillar) => {
    if (pillar === "Channel Grower") {
      return [
        `Define the core question people search about ${problemLabel}.`,
        "Open with a blunt truth that earns attention in 10 seconds.",
        "Explain it in plain language (no jargon).",
        "Share one quick story/example that makes it real.",
        "End with 3 actionable takeaways someone can use today.",
      ];
    }
    if (pillar === "Lead Generator") {
      return [
        `Teach a simple framework for solving ${problemLabel}.`,
        "Use a clear before/after example to make it tangible.",
        "Show the common mistake and how to avoid it.",
        "Give a 3-step checklist viewers can follow immediately.",
        "Close with one next step that naturally continues the journey.",
      ];
    }
    return [
      `Tell a short story about someone in ${audienceLabel} dealing with ${problemLabel}.`,
      "Share a lesson learned and the mindset shift.",
      "Bring in a credible perspective (experience, principle, or example).",
      "Offer 2–3 practical habits that build trust over time.",
      "Close with a simple reflection question for the audience.",
    ];
  };

  const plan: WeekPlan[] = [];
  for (let week = 1; week <= 12; week++) {
    const pillar = pillarForWeek(week);
    plan.push({
      week,
      pillar,
      title: `Week ${week}: ${pillar} episode for ${audienceLabel}`,
      bullets: [`Anchor: ${reasonLabel}.`, ...baseBullets(pillar)],
    });
  }

  return plan;
}

export default function PlannerClient() {
  const searchParams = useSearchParams();
  const isPaid = searchParams.get("paid") === "1";

  const [audience, setAudience] = useState("");
  const [problem, setProblem] = useState("");
  const [reason, setReason] = useState("");
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (isPaid) setGenerated(true);
  }, [isPaid]);

  const plan = useMemo(() => buildPlan(audience, problem, reason), [audience, problem, reason]);

  const suggestedTitle = useMemo(() => {
    const a = audience.trim() || "Professionals";
    const p = problem.trim() || "a real problem";
    return `A show for ${a} solving ${p}`;
  }, [audience, problem]);

  const suggestedSummary = useMemo(() => {
    const a = audience.trim() || "professionals";
    const r = reason.trim() || "clear, practical guidance";
    return `A show for ${a} that delivers ${r} in a premium, repeatable weekly format.`;
  }, [audience, reason]);

  const visibleWeeks = isPaid ? 12 : 3;
  const visible = plan.slice(0, visibleWeeks);
  const locked = plan.slice(visibleWeeks);

  const copyPlan = async () => {
    const lines: string[] = [];
    lines.push("12-Week Authority Episode Plan");
    lines.push(`Audience: ${audience || "-"}`);
    lines.push(`Problem: ${problem || "-"}`);
    lines.push(`Why tune in: ${reason || "-"}`);
    lines.push("");

    for (const w of plan) {
      lines.push(`${w.title} (${w.pillar})`);
      for (const b of w.bullets) lines.push(`- ${b}`);
      lines.push("");
    }

    await navigator.clipboard.writeText(lines.join("\n"));
    alert("Copied full 12-week plan to clipboard.");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.10),transparent_60%)]" />

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
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h1 className="text-2xl font-bold">Your 12-Week Quarter Planner</h1>
            <p className="mt-2 text-sm text-zinc-300">
              Answer three prompts. Generate a clean quarterly plan (Weeks 1–12). Demo shows Weeks 1–3.
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
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-xs text-zinc-400">Suggested show framing</div>
              <div className="mt-2 text-xl font-bold text-white">
                {generated ? suggestedTitle : "Your Show (Working Title)"}
              </div>
              <p className="mt-2 text-sm text-zinc-300">
                {generated ? suggestedSummary : "Generate a plan to see your framing appear here."}
              </p>

              <div className="mt-4 flex items-center gap-3">
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
            </div>

            {generated && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-400">Week 1</div>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                    {visible[0]?.pillar}
                  </span>
                </div>

                <h2 className="mt-2 text-xl font-bold">{visible[0]?.title}</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                  {visible[0]?.bullets.map((b, idx) => (
                    <li key={idx}>• {b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {generated && (
          <div className="mt-10">
            <div className="space-y-4">
              {visible.map((w) => (
                <div key={w.week} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-400">Week {w.week}</div>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                      {w.pillar}
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-bold">{w.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                    {w.bullets.map((b, idx) => (
                      <li key={idx}>• {b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-14 border-t border-white/10 pt-8 text-xs text-zinc-500">
          © {new Date().getFullYear()} Brian Kelsey Media. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
