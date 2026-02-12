"use client";

import { useEffect, useMemo, useState } from "react";

import { STRIPE_PAYMENT_LINK } from "@/lib/links";

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

  interviewQuestions: string[];

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

function generatePlan(inputs: {
  showName: string;
  niche: string;
  whoFor: string;
  problem: string;
  outcome: string;
}): EpisodeBrief[] {
  const showName = safeText(inputs.showName) || "Your show";
  const niche = safeText(inputs.niche) || "your niche";
  const whoFor = safeText(inputs.whoFor) || "your audience";
  const problem = safeText(inputs.problem) || "a painful problem";
  const outcome = safeText(inputs.outcome) || "a clear outcome";

  const weekThemes = [
    "The real problem behind the problem",
    "What most people get wrong",
    "The hidden constraint nobody talks about",
    "The framework you use to get results",
    "How to diagnose quickly",
    "The first 30 days plan",
    "Common objections and how to handle them",
    "Case study teardown",
    "Tools + systems that make it repeatable",
    "How to measure progress",
    "Advanced moves + edge cases",
    "The full roadmap recap and next steps",
  ];

  const baseInspo = (weekTitle: string): InspirationItem[] => [
    {
      id: makeId("yt"),
      platform: "YouTube",
      title: `High-retention opening you can model for: "${weekTitle}"`,
      url: "https://www.youtube.com/",
    },
    {
      id: makeId("tt"),
      platform: "TikTok",
      title: `Pattern-interrupt hook style that fits ${niche}`,
      url: "https://www.tiktok.com/",
    },
    {
      id: makeId("ig"),
      platform: "Instagram",
      title: "Clean talking-head reel format with bold captions + one takeaway",
      url: "https://www.instagram.com/",
    },
  ];

  return Array.from({ length: 12 }).map((_, idx) => {
    const week = idx + 1;
    const theme = weekThemes[idx] || `Week ${week} topic`;
    const title = `${theme} for ${whoFor}`;

    return {
      week,
      title,

      audienceTrigger: `Your audience (${whoFor}) is stuck in "${problem}" and doesn't realize the bigger risk is what they're *not* addressing yet.`,
      positioningAngle: `Instead of generic tips, frame the decision-making that reliably creates "${outcome}" in ${niche}.`,
      hostCredibilityMoment: `Insert a 20–30 second credibility moment: what you've seen in the field (clients, production, founders, firms), what you changed, and the result.`,

      guestArchetype: `Guest archetype: a practitioner who has lived this and has scars + lessons (not a generic "expert").`,
      whyThisGuestStrengthensAuthority: `You look like the strategic guide: you define the problem, the guest validates it with lived experience, and you close with your framework.`,

      distribution: {
        verticalHook: `"If you're dealing with ${problem}, stop doing *this* first."`,
        linkedinAngle: `The uncomfortable truth about ${problem} (and why most advice fails).`,
        newsletterAngle: `One mindset shift that gets you closer to ${outcome} this week.`,
      },

      strategicOutcome: `Trust + repositioning + objection removal. After this episode, the audience should believe "${outcome}" is realistic with the right structure.`,

      interviewQuestions: [
        `When did you first realize "${problem}" was the real bottleneck?`,
        `What did you try first that *didn't* work — and why?`,
        `What was the first change that actually moved the needle?`,
        `What's the hidden constraint most people miss?`,
        `What's a simple next step someone can take in the next 7 days toward "${outcome}"?`,
      ],

      inspiration: baseInspo(title),
    };
  });
}

function getStorageKey(showName: string) {
  const base = safeText(showName) || "default";
  return `bkm_planner_saved_${base.toLowerCase().slice(0, 60)}`;
}

export default function PlannerClient({ isPaid }: { isPaid: boolean }) {
  const maxUnlockedWeek = useMemo(() => (isPaid ? 12 : 3), [isPaid]);

  const [showName, setShowName] = useState("");
  const [niche, setNiche] = useState("");
  const [whoFor, setWhoFor] = useState("");
  const [problem, setProblem] = useState("");
  const [outcome, setOutcome] = useState("");

  const [plan, setPlan] = useState<EpisodeBrief[] | null>(null);
  const [activeWeek, setActiveWeek] = useState<number>(1);

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
  }, [showName, isPaid]);

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

  const visibleWeeks = useMemo(() => Array.from({ length: 12 }).map((_, i) => i + 1), []);

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
      .map((ep) =>
        [
          `Week ${ep.week}: ${ep.title}`,
          ``,
          `Audience trigger: ${ep.audienceTrigger}`,
          `Positioning angle: ${ep.positioningAngle}`,
          `Host credibility moment: ${ep.hostCredibilityMoment}`,
          ``,
          `Guest archetype: ${ep.guestArchetype}`,
          `Why this guest strengthens authority: ${ep.whyThisGuestStrengthensAuthority}`,
          ``,
          `Distribution play:`,
          `- Vertical hook: ${ep.distribution.verticalHook}`,
          `- LinkedIn angle: ${ep.distribution.linkedinAngle}`,
          `- Newsletter angle: ${ep.distribution.newsletterAngle}`,
          ``,
          `Strategic outcome: ${ep.strategicOutcome}`,
          ``,
          `Interview questions:`,
          ...ep.interviewQuestions.map((q) => `- ${q}`),
          ``,
          `Trending / inspirational videos:`,
          ...ep.inspiration.map((v) => `- [${v.platform}] ${v.title} — ${v.url}`),
          ``,
          `---`,
          ``,
        ].join("\n")
      )
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
      const ep = next[idx];
      if (!ep) return prev;

      const fresh: InspirationItem[] = [
        {
          id: makeId("yt"),
          platform: "YouTube",
          title: `High-retention opener you can model for: "${ep.title}"`,
          url: "https://www.youtube.com/",
        },
        {
          id: makeId("tt"),
          platform: "TikTok",
          title: `Pattern interrupt hook that fits ${safeText(niche) || "your niche"}`,
          url: "https://www.tiktok.com/",
        },
        {
          id: makeId("ig"),
          platform: "Instagram",
          title: "Talking-head reel with bold captions + 1 punchline takeaway",
          url: "https://www.instagram.com/",
        },
      ];

      next[idx] = { ...ep, inspiration: fresh };
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
          Answer a few quick questions and generate a 12-week plan as{" "}
          <span className="font-semibold text-white">Authority Episode Briefs</span> (trigger, positioning, credibility moment,
          guest archetype, distribution plays, interview questions, plus inspiration you can save to each episode).
        </p>

        {!isPaid && (
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            Demo preview shows <span className="font-semibold">Weeks 1–3</span>. Unlock to view/export Weeks 4–12.
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
            const activeTab = w === activeWeek;
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
                  activeTab && !locked ? "bg-white text-black hover:bg-white" : "",
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
              Then click <span className="font-semibold text-white">Generate</span> to get your{" "}
              {isPaid ? "full 12-week plan" : "first 3 weeks (demo)"} as Authority Episode Briefs.
            </div>
            <div className="mt-4 text-white/60">
              You'll get structure, positioning angles, guest archetypes, distribution plays, interview questions, and inspiration you can save per episode.
            </div>
          </div>
        )}

        {plan && active && active.week <= maxUnlockedWeek && (
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
                  <div className="font-semibold text-white">Guest suggestion (archetype)</div>
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
                <div className="text-lg font-bold">Interview questions</div>
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

                {!isPaid && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                    Demo includes Weeks 1–3. Want Weeks 4–12 + export?{" "}
                    
                      className="font-semibold text-white underline decoration-white/20 underline-offset-4"
                      href={STRIPE_PAYMENT_LINK}
                    >
                      Unlock here
                    </a>
                    .
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Locked week view */}
        {!isPaid && plan && activeWeek > 3 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 text-white/70">
            <div className="text-lg font-semibold text-white">Week {activeWeek} is part of the full version.</div>
            <div className="mt-2">Unlock Weeks 4–12 to view, copy, and export the full plan.</div>
            
              href={STRIPE_PAYMENT_LINK}
              className="mt-4 inline-flex rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
            >
              Unlock the full 12 weeks ($29)
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
```

Then push with:
```
git add app/planner/PlannerClient.tsx && git commit -m "Fix: show correct week count in empty state based on paid status" && git push