import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/bkm-landing.png"
              alt="Brian Kelsey Media"
              className="h-8h-[420px] w-full rounded-2xl object-cover"
            />
            <div className="text-sm text-white/70">
              Premium video strategy + production
            </div>
          </div>

          {/* match this with the hero button */}
          <Link
            href="/planner"
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold hover:bg-white/10"
          >
            Try the demo
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              Brian Kelsey Media • Episode Planning System
            </div>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              12-Week Episode Planner{" "}
              <span className="block text-white/55">
                for authority driven shows.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/70">
              Build a consistent content plan that feels intentional, premium,
              and on-brand. Designed for professionals who want their show to
              drive trust, demand, and business.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/planner"
                className="rounded-full bg-amber-500 px-7 py-3 text-sm font-bold text-black hover:bg-amber-400"
              >
                Try the demo
              </Link>

              <a
                href="/planner?paid=1"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                Buy the Full Version ($29)
              </a>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              <div className="font-semibold text-white/85">
                What you get in 12 weeks:
              </div>
              <ul className="mt-3 space-y-2">
                <li>• A repeatable structure (not random topics)</li>
                <li>• Authority Episode Briefs (strategy + positioning + distribution)</li>
                <li>• Guest archetypes that make the host look sharp</li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
              <img
                src="/bkm-hero.png"
                alt="Brian Kelsey"
                className="h-[520px] w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
