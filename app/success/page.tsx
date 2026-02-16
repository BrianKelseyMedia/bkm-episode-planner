// app/success/page.tsx
export const dynamic = "force-dynamic";

import SuccessClient from "./success-client";

export default function SuccessPage({
  searchParams,
}: {
  searchParams?: { session_id?: string; sessionId?: string };
}) {
  // support both spellings just in case
  const sessionId = searchParams?.session_id || searchParams?.sessionId || "";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <SuccessClient sessionId={sessionId} />
      </div>
    </main>
  );
}
