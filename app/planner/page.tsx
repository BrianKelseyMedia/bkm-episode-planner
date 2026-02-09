// app/planner/page.tsx
import { cookies } from "next/headers";
import { Suspense } from "react";
import PlannerClient from "./PlannerClient";

export default async function PlannerPage() {
  // Support both Next variants (some versions require await)
  const cookieStore: any = await (cookies() as any);
  const paid = cookieStore.get("bkm_paid")?.value === "1";

  return (
    <main className="min-h-screen bg-black text-white">
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
              Loading planner...
            </div>
          </div>
        }
      >
        <PlannerClient isPaid={paid} />
      </Suspense>
    </main>
  );
}
