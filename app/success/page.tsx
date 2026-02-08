import Image from "next/image";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-40 left-16 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-72 right-10 h-[420px] w-[420px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-3">
          <Image
            src="/bkm-logo.png"
            alt="Brian Kelsey Media"
            width={34}
            height={34}
            className="rounded-md"
            priority
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold">Brian Kelsey Media</div>
            <div className="text-xs text-white/60">Payment complete</div>
          </div>
        </div>

        <Link
          href="/planner"
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Go to planner
        </Link>
      </header>

      <section className="relative mx-auto w-full max-w-3xl px-6 pb-20 pt-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
          <div className="text-sm text-white/70">Success</div>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
            Payment received.
          </h1>

          <p className="mt-4 text-white/70">
            You can now open the full planner experience.
            <br />
            (Next step is locking this down properly with Stripe verification.)
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {/* Still uses paid=1 for now until you add real Stripe verification */}
            <Link
              href="/planner?paid=1"
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
            >
              Open full version
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Back home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
