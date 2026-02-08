import { Suspense } from "react";
import PlannerClient from "./PlannerClient";

export default function PlannerPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const paidParam = searchParams?.paid;
  const paid =
    paidParam === "1" ||
    (Array.isArray(paidParam) && paidParam.includes("1"));

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Loading planner...
        </div>
      }
    >
      <PlannerClient paid={paid} />
    </Suspense>
  );
}
