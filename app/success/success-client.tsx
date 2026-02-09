// app/success/success-client.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessClient({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<"idle" | "activating" | "done" | "error">("idle");

  useEffect(() => {
    async function activate() {
      if (!sessionId) return;

      setStatus("activating");
      try {
        const res = await fetch("/api/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (!res.ok) throw new Error("Activation failed");
        setStatus("done");
      } catch {
        setStatus("error");
      }
    }

    activate();
  }, [sessionId]);

  const buttonLabel =
    status === "activating" ? "Activating..." : "Open full version";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
      <div className="text-sm text-white/60">Success</div>
      <h1 className="mt-3 text-5xl font-extrabold tracking-tight">Payment received.</h1>

      <p className="mt-4 text-white/70">
        {status === "done"
          ? "You can now open the full planner experience."
          : status === "activating"
          ? "Finishing setup..."
          : status === "error"
          ? "We couldn’t verify your purchase automatically. Please refresh, or contact support."
          : "One moment…"}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="/planner"
          className="rounded-full bg-amber-500 px-8 py-3 text-sm font-bold text-black hover:bg-amber-400"
        >
          {buttonLabel}
        </Link>

        <Link
          href="/"
          className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
