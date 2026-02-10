"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessClient({
  sessionId,
}: {
  sessionId: string;
}) {
  const router = useRouter();

  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session id");
      return;
    }

    const run = async () => {
      try {
        setActivating(true);

        const res = await fetch("/api/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          throw new Error("Activation failed");
        }

        setActivated(true);
      } catch (e) {
        setError("Activation failed");
      } finally {
        setActivating(false);
      }
    };

    run();
  }, [sessionId]);

  return (
    <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
      <h1 className="text-3xl font-extrabold">
        Payment received.
      </h1>

      {!activated && !error && (
        <p className="mt-4 text-white/70">
          One moment…
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-400">
          {error}
        </p>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <button
          disabled={!activated}
          onClick={() => router.push("/planner")}
          className="rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black disabled:opacity-50"
        >
          Open full version
        </button>

        <button
          onClick={() => router.push("/")}
          className="rounded-full border border-white/20 px-6 py-3"
        >
          Back home
        </button>
      </div>
    </div>
  );
}
