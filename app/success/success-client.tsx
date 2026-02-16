"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessClient({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<"idle" | "activating" | "activated" | "error" | "no-session">("idle");
  const hasSession = Boolean(sessionId && sessionId.trim().length > 0);

  useEffect(() => {
    if (!hasSession) {
      setStatus("no-session");
      return;
    }

    let cancelled = false;

    async function activate() {
      try {
        if (!cancelled) setStatus("activating");

        const res = await fetch("/api/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          throw new Error(`Activate failed: ${res.status}`);
        }

        if (!cancelled) setStatus("activated");
      } catch (e) {
        if (!cancelled) setStatus("error");
      }
    }

    activate();

    return () => {
      cancelled = true;
    };
  }, [hasSession, sessionId]);

  const activating = status === "activating";
  const activated = status === "activated";

  return (
    <div className="rounded-[36px] border border-white/10 bg-white/5 p-10 text-center shadow-2xl">
      <div className="text-sm text-white/60">Success</div>

      <h1 className="mt-4 text-5xl font-extrabold tracking-tight">Payment received.</h1>

      <div className="mt-4 text-sm text-white/60">
        {status === "activating" && "Activating your full access..."}
        {status === "activated" && "You’re all set. Full access is active."}
        {status === "error" && "We received your payment, but activation didn’t complete automatically. Try opening the full version anyway."}
        {status === "no-session" && "We received your payment, but this page didn’t include a session ID. You can still continue to the planner."}
        {status === "idle" && "Preparing your access..."}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/planner"
          className={[
            "inline-flex items-center justify-center rounded-full px-10 py-4 text-sm font-bold transition",
            activating ? "cursor-not-allowed bg-amber-500/70 text-black/80" : "bg-amber-500 text-black hover:bg-amber-400",
          ].join(" ")}
          aria-disabled={activating}
          onClick={(e) => {
            if (activating) e.preventDefault();
          }}
        >
          {activating ? "Activating..." : "Open full version"}
        </Link>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-10 py-4 text-sm font-semibold text-white hover:bg-white/10"
        >
          Back home
        </Link>
      </div>

      {/* Optional: tiny debug line you can remove later */}
      {/* <div className="mt-6 text-xs text-white/40">session: {hasSession ? sessionId : "(none)"}</div> */}
    </div>
  );
}
