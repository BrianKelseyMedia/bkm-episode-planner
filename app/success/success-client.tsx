"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessClient() {
  const params = useSearchParams();
  const router = useRouter();

  const sessionId = params.get("session_id");

  const [activating, setActivating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session information.");
      setActivating(false);
      return;
    }

    const run = async () => {
      try {
        const res = await fetch("/api/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const json = await res.json();

        if (!res.ok || !json.ok) {
          throw new Error(json.error || "Activation failed");
        }

        setActivating(false);
      } catch (e: any) {
        setError(e.message || "Activation failed");
        setActivating(false);
      }
    };

    run();
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-xs text-pink-400 mb-4">
      LIVE MARKER – SUCCESS PAGE
    </div>
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-3xl font-extrabold">
          You’re all set.
        </h1>

        <p className="mt-4 text-white/70">
          Your full 12-week episode planner is now unlocked.
        </p>

        {activating && (
          <p className="mt-6 text-sm text-white/60">
            Finalizing your access…
          </p>
        )}

        {error && (
          <p className="mt-6 text-sm text-red-400">
            {error}
          </p>
        )}

        {!activating && !error && (
          <button
            onClick={() => router.push("/planner")}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3 text-sm font-bold text-black hover:bg-amber-400"
          >
            Open your episode planner
          </button>
        )}
      </div>
    </main>
  );
}
