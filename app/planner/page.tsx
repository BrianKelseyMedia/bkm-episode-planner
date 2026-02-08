// app/planner/page.tsx
import { Suspense } from "react";
import PlannerClient from "./PlannerClient";

export default function PlannerPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
              Loading planner…
            </div>
          </div>
        }
      >
        <PlannerClient />
      </Suspense>
    </main>
  );
}
