// app/page.tsx
import Image from "next/image";
import Link from "next/link";

const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/fZu9AS9lG2Pt6IQdQLdAk0f";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* subtle glow */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-40 left-16 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-72 right-10 h-[420px] w-[420px] rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Header */}
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
            <div className="text-xs text-white/60">Premium video strategy + production</div>
          </div>
        </div>

        <Link
          href="/planner"
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Try the demo
        </Link>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pb-16 pt-12 lg:grid-cols-2 lg:items-center">
        {/* Left copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Brian Kelsey Media • Episode Planning System
          </div>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl">
            12-Week Episode
            <br />
            Planner{" "}
            <span className="block text-white/55">
              for authority driven
              <br />
              shows.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            Build a consistent content plan that feels intentional, premium, and on-brand. Designed
            for professionals who want their show to drive trust, demand, and business.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/planner"
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
            >
              Try the demo
            </Link>

            {/* ✅ Paid button now goes to Stripe (NO paid=1 bypass) */}
            <a
              href={STRIPE_CHECKOUT_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Buy the Full Version ($29)
            </a>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">What you get in 12 weeks:</div>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>• A repeatable structure (not random topics)</li>
              <li>• Authority Episode Briefs: trigger → positioning → credibility moment</li>
              <li>• Guest archetypes + distribution plays baked in</li>
              <li>• Inspiration/trending videos you can save to each episode</li>
            </ul>
          </div>
        </div>

        {/* Right hero image */}
        <div className="relative">
          <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_120px_rgba(255,170,0,0.15)]">
            <div className="relative aspect-video w-full">
              <Image
                src="/bkm-landing.png"
                alt="Brian Kelsey Media — Episode Planner"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="relative mx-auto w-full max-w-6xl px-6 pb-10 text-xs text-white/50">
        © {new Date().getFullYear()} Brian Kelsey Media
      </footer>
    </main>
  );
}
