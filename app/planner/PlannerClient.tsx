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

  const platformIdeas: InspirationItem[] = [
    {
      id: makeId("yt"),
      platform: "YouTube",
      title: "A strong hook + clear promise in the first 10 seconds",
      channel: "Example",
      url: "https://www.youtube.com/",
    },
    {
      id: makeId("tt"),
      platform: "TikTok",
      title: "Fast cuts + pattern interrupt that keeps retention high",
      channel: "Example",
      url: "https://www.tiktok.com/",
    },
    {
      id: makeId("ig"),
      platform: "Instagram",
      title: "Clean talking-head with captions + one punchy takeaway",
      channel: "Example",
      url: "https://www.instagram.com/",
    },
  ];

  return Array.from({ length: 12 }).map((_, idx) => {
    const week = idx + 1;
    const theme = weekThemes[idx] || `Week ${week} topic`;

    return {
      week,
      title: `${theme} for ${whoFor}`,
      audienceTrigger: `Your audience (${whoFor}) is stuck in "${problem}" and doesn’t realize the real risk is what they’re *not* addressing.`,
      positioningAngle: `Producer lens: instead of generic tips, show the decision-making that creates "${outcome}" in ${niche}.`,
      hostCredibilityMoment: `Share a quick story: a moment you saw "${problem}" show up, what you changed, and what happened next.`,
      guestArchetype: `A practitioner who has lived this: someone who overcame "${problem}" or helps others do it consistently.`,
      whyThisGuestStrengthensAuthority: `This guest makes *you* look like the strategic guide: you frame the problem, they validate it with lived experience, and you close with the framework.`,
      distribution: {
        verticalHook: `“If you’re dealing with ${problem}, stop doing *this* first.”`,
        linkedinAngle: `The uncomfortable truth about ${problem} (and why most advice fails).`,
        newsletterAngle: `One mindset shift that gets you closer to ${outcome} this week.`,
      },
      strategicOutcome: `Objection removal + trust building. After this episode, the audience should believe "${outcome}" is realistic with the right structure.`,
      interviewQuestions: [
        `When did you first realize "${problem}" was the real bottleneck?`,
        `What was the first change that actually moved the needle?`,
        `What do people try that *feels* right but fails?`,
        `What’s the hidden constraint most people miss?`,
        `If someone wants "${outcome}", what should they do in the next 7 days?`,
      ],
      inspiration: platformIdeas.map((x) => ({ ...x, id: makeId("insp") })),
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
    const key = getStorageKey(showName);
    if (!safeText(showName)) return;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as EpisodeBrief[];
      if (Array.isArray(parsed) && parsed.length) {
        setPlan(parsed);
        setActiveWeek((w) => clamp(w, 1, isPaid ? 12 : 3));
      }
    } catch {}
  }, [showName, isPaid]);

  useEffect(() => {
    if (!plan) return;
    if (!safeText(showName)) return;

    const key = getStorageKey(showName);
    try {
      localStorage.setItem(key, JSON.stringify(plan));
    } catch {}
  }, [plan, showName]);

  const visibleWeeks = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => i + 1);
  }, []);

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

      {/* ✅ LIVE CHECK */}
      <div className="text-xs text-white/40 mb-4">
        PlannerClient LIVE CHECK
      </div>

      {/* …everything else below is unchanged … */}

      {/* Header */}
      <div className="mb-8">
        ...
      </div>
    </div>
  );
}
