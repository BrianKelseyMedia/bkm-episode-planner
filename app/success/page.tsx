// app/success/page.tsx
export const dynamic = "force-dynamic";

import SuccessClient from "./success-client";

export default function SuccessPage({
  searchParams,
}: {
  searchParams?: { session_id?: string };
}) {
  const sessionId = searchParams?.session_id ?? "";

  return <SuccessClient sessionId={sessionId} />;
}
