// app/success/page.tsx
import SuccessClient from "./success-client";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams?.session_id;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <SuccessClient sessionId={sessionId || ""} />
      </div>
    </main>
  );
}
