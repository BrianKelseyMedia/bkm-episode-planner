import { Suspense } from "react";
import PlannerClient from "./PlannerClient";

export default function PlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-sm text-zinc-300">Loading…</p>
        </div>
      }
    >
      <PlannerClient />
    </Suspense>
  );
}
