"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessClient({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string>("");

  const hasSession = useMemo(() => Boolean(sessionId && sessionId.trim()), [sessionId]);

  async function handleOpenFullVersion() {
    setError("");

    if (!hasSession) {
      setError("Missing session id. Please return to Stripe and try again.");
      return;
    }

    try {
      setActivating(true);

      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Could not verify payment. Please try again.");
        setActivating(false);
        return;
      }

      // If /api/activate sets the unlock cookie correctly, this will land on full version.
      router.push("/planner");
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
      setActivating(false);
    }
  }

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
      <div className="text-sm text-white/60">Success</div>

      <h1 className="mt-3 text-5xl font-extrabold tracking-tight">
        Payment received.
      </h1>

      {/* REMOVED: "One moment..." line */}

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          onClick={handleOpenFullVersion}
          disabled={activating}
          className="rounded-full bg-amber-500 px-8 py-4 font-semibold text-black disabled:opacity-60"
        >
          {activating ? "Unlocking..." : "Open full version"}
        </button>

        <button
          onClick={() => router.push("/")}
          className="rounded-full border border-white/15 bg-white/5 px-8 py-4 font-semibold text-white"
        >
          Back home
        </button>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-400">
          {error}
        </p>
      )}

      {!hasSession && (
        <p className="mt-6 text-sm text-white/50">
          Tip: this page must include <code>?session_id=...</code> from Stripe.
        </p>
      )}
    </div>
  );
}
