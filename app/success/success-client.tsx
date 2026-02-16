"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessClient({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const sp = useSearchParams();

  // If the server prop is blank (due to caching/static), fall back to reading from the browser URL
  const effectiveSessionId = useMemo(() => {
    return sessionId || sp.get("session_id") || sp.get("sessionId") || "";
  }, [sessionId, sp]);

  const [status, setStatus] = useState<"idle" | "working" | "error" | "ok">("idle");
  const [error, setError] = useState("");

  async function handleOpenFull() {
    if (!effectiveSessionId) {
      setStatus("error");
      setError("Missing session id. Please return to Stripe and try again.");
      return;
    }

    setStatus("working");
    setError("");

    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: effectiveSessionId }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Activation failed (${res.status})`);
      }

      setStatus("ok");
      router.push("/planner");
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Activation failed. Please try again.");
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
      <div className="text-sm text-white/60">Success</div>
      <h1 className="mt-4 text-5xl font-extrabold">Payment received.</h1>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleOpenFull}
          disabled={status === "working"}
          className="rounded-full bg-amber-500 px-8 py-3 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60"
        >
          {status === "working" ? "Activating..." : "Open full version"}
        </button>

        <button
          onClick={() => router.push("/")}
          className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
        >
          Back home
        </button>
      </div>

      {status === "error" && (
        <div className="mt-6 text-sm text-red-400">{error}</div>
      )}

      {!effectiveSessionId && (
        <div className="mt-6 text-xs text-white/50">
          Tip: this page must include <span className="font-mono">?session_id=...</span> from Stripe.
        </div>
      )}
    </div>
  );
}
