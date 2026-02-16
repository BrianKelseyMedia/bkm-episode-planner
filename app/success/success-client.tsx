"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessClient({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const resolvedSessionId = useMemo(() => {
    if (sessionId) return sessionId;

    // Fallback: read from URL directly
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("session_id") || params.get("sessionId") || "";
    }
    return "";
  }, [sessionId]);

  async function handleOpenFull() {
    setErrorMsg("");

    if (!resolvedSessionId) {
      setStatus("error");
      setErrorMsg("Missing session id. Please return to Stripe and try again.");
      return;
    }

    try {
      setStatus("loading");

      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: resolvedSessionId }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Activation failed (${res.status})`);
      }

      // Backup cookie (in case Set-Cookie doesn’t stick for any reason)
      document.cookie = `bkm_paid=1; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax; Secure`;

      setStatus("ok");

      // Hard navigate so the server definitely sees the cookie
      window.location.href = "/planner";
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong activating your purchase.");
    }
  }

  function handleBackHome() {
    router.push("/");
  }

  const showRedError = status === "error" && !!errorMsg;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
      <div className="text-sm text-white/60">Success</div>
      <h1 className="mt-3 text-5xl font-extrabold tracking-tight">Payment received.</h1>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleOpenFull}
          disabled={status === "loading"}
          className="rounded-full bg-amber-500 px-10 py-4 text-lg font-bold text-black hover:bg-amber-400 disabled:opacity-60"
        >
          {status === "loading" ? "Activating..." : "Open full version"}
        </button>

        <button
          onClick={handleBackHome}
          className="rounded-full border border-white/15 bg-white/5 px-10 py-4 text-lg font-semibold text-white hover:bg-white/10"
        >
          Back home
        </button>
      </div>

      {showRedError && (
        <div className="mt-6 text-sm text-red-400">
          {errorMsg}
          <div className="mt-2 text-white/50">
            Tip: your Stripe success URL must include <span className="font-mono">?session_id=&#123;CHECKOUT_SESSION_ID&#125;</span>
          </div>
        </div>
      )}
    </div>
  );
}
