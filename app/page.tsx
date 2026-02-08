"use client";

import Image from "next/image";
import Link from "next/link";

const PRICE = 29;
const CHECKOUT_URL = "https://buy.stripe.com/fZu9AS9lG2Pt6IQdQLdAk0f";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.10),transparent_60%)]" />

      {/* Header */}
      <header className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* ✅ Smaller logo */}
            <Image
              src="/bkm-logo.png"
              alt="Brian Kelsey Media"
              width={180}
              height={50}
              className="h-9 w-auto"
              priority
            />

            {/* ✅ Larger tagline */}
            <span className="hidden sm:block text-base font-semibold tracking-wide text-zinc-200">
              Premium video strategy + production
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/planner"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Try the demo
            </Link>

            <Link
              href={CHECKOUT_URL}
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition"
            >
              Buy the Full Version (${PRICE})
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Brian Kelsey Media · Episode Planning System
            </div>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              12-Week Episode Planner{" "}
              <span className="text-zinc-400">for authority-driven shows.</span>
            </h1>

            <p className="mt-6 max-w-xl text-zinc-300">
              Build a consistent content plan that feels intentional, premium, and on-brand.
              Designed for professionals who want their show to drive trust, demand, and business.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/planner"
                className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition"
              >
                Start the planner
              </Link>

              <Link
                href={CHECKOUT_URL}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Buy the Full Version (${PRICE})
              </Link>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-sm text-zinc-300">
              <div className="mb-2 font-semibold text-white">What you get in 12 weeks:</div>
              <ul className="space-y-1">
                <li>• A repeatable structure (not random topics)</li>
                <li>• Clear episode angles and hooks</li>
                <li>• A premium authority feel across the series</li>
                <li>• Guest archetypes + prompts that make the host look sharp</li>
                <li>• Distribution angles for vertical, LinkedIn, and newsletter</li>
              </ul>

              <div className="mt-4 text-xs text-zinc-400">
                Demo preview shows Weeks 1–3. Full version unlocks Weeks 1–12 + copy/export.
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            {/* ✅ Slightly smaller image container so it feels cleaner */}
            <div className="mx-auto max-w-[520px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-3">
              <Image
                src="/bkm-hero.png"
                alt="Brian Kelsey"
                width={900}
                height={1100}
                className="h-auto w-full rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <footer className="mt-20 border-t border-white/10 pt-8 text-xs text-zinc-500">
          © {new Date().getFullYear()} Brian Kelsey Media. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
