import { Suspense } from "react";
import PlannerClient from "./PlannerClient";

export default function PlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Loading…
        </div>
      }
    >
      <PlannerClient />
    </Suspense>
  );
}
