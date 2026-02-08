"use client";

import Link from "next/link";

export default function SuccessClient() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold">You're all set.</h1>

        <p className="mt-4 text-white/70">
          Your purchase was successful and your full 12-week planner is now
          unlocked.
        </p>

        <Link
          href="/planner?paid=1"
          className="inline-block mt-8 rounded-full bg-amber-500 px-8 py-3 text-sm font-bold text-black hover:bg-amber-400"
        >
          Go to your planner
        </Link>
      </div>
    </main>
  );
}
