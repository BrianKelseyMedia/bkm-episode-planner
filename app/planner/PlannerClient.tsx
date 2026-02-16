<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm text-white/70">Show name</label>
        <input
          value={showName}
          onChange={(e) => setShowName(e.target.value)}
          placeholder=" "
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Niche / audience category</label>
        <input
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder=" "
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm text-white/70">Who is this show for?</label>
        <input
          value={whoFor}
          onChange={(e) => setWhoFor(e.target.value)}
          placeholder=" "
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />
      </div>
      <div>
        <label className="text-sm text-white/70">What problem do you solve?</label>
        <input
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder=" "
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />
      </div>
      <div>
        <label className="text-sm text-white/70">What outcome do you promise?</label>
        <input
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          placeholder=" "
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />
      </div>
    </div>

    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        onClick={handleGenerate}
        className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
      >
        {isPaid ? "Generate my 12-week plan" : "Generate my 3-month plan (demo)"}
      </button>
      <button
        onClick={handleCopy}
        disabled={!plan}
        className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Copy plan
      </button>
      {!isPaid && (
        
          href={STRIPE_PAYMENT_LINK}
         <a href={STRIPE_PAYMENT_LINK} className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Unlock the full 12 weeks ($29)
            </a>
          Unlock the full 12 weeks ($29)
        </a>
      )}
    </div>
  </div>

  <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-white/70">
        Unlocked:{" "}
        <span className="font-semibold text-white">Weeks 1-{maxUnlockedWeek}</span>
      </div>
      {!isPaid && plan && (
        
          href={STRIPE_PAYMENT_LINK}
          className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-black hover:bg-amber-400"
        >
          Unlock the full 12 weeks
        </a>
      )}
    </div>

    <div className="mt-6 flex flex-wrap gap-2">
      {visibleWeeks.map((w) => {
        const locked = isLockedWeek(w);
        const activeTab = w === activeWeek;
        return (
          <button
            key={w}
            onClick={() => {
              if (locked) return;
              setActiveWeek(w);
            }}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              locked
                ? "cursor-not-allowed border border-white/10 bg-black/20 text-white/35"
                : "border border-white/15 bg-white/5 text-white hover:bg-white/10",
              activeTab && !locked ? "bg-white text-black hover:bg-white" : "",
            ].join(" ")}
            title={locked ? "Locked in demo" : `Week ${w}`}
          >
            Week {w}
          </button>
        );
      })}
    </div>

    {!plan && (
      <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 text-white/70">
        <div className="text-lg font-semibold text-white">
          Add your show details above.
        </div>
        <div className="mt-2">
          Then click <span className="font-semibold text-white">Generate</span> to get
          your {isPaid ? "full 12-week plan" : "first 3 weeks (demo)"} as Authority Episode Briefs.
        </div>
        <div className="mt-4 text-white/60">
          You'll get structure, positioning angles, guest archetypes, distribution
          plays, interview questions, and inspiration you can save per episode.
        </div>
      </div>
    )}

    {plan && active && active.week <= maxUnlockedWeek && (
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-sm text-white/60">Week {active.week}</div>
          <h2 className="mt-2 text-2xl font-extrabold">{active.title}</h2>
          <div className="mt-6 space-y-4 text-sm text-white/75">
            <div>
              <div className="font-semibold text-white">Audience trigger</div>
              <div className="mt-1">{active.audienceTrigger}</div>
            </div>
            <div>
              <div className="font-semibold text-white">Positioning angle</div>
              <div className="mt-1">{active.positioningAngle}</div>
            </div>
            <div>
              <div className="font-semibold text-white">Host credibility moment</div>
              <div className="mt-1">{active.hostCredibilityMoment}</div>
            </div>
            <div>
              <div className="font-semibold text-white">Guest suggestion (archetype)</div>
              <div className="mt-1">{active.guestArchetype}</div>
            </div>
            <div>
              <div className="font-semibold text-white">Why this guest strengthens your authority</div>
              <div className="mt-1">{active.whyThisGuestStrengthensAuthority}</div>
            </div>
            <div>
              <div className="font-semibold text-white">Strategic outcome</div>
              <div className="mt-1">{active.strategicOutcome}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <div className="text-lg font-bold">Distribution play</div>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <div>
                <div className="font-semibold text-white">Vertical hook</div>
                <div className="mt-1">{active.distribution.verticalHook}</div>
              </div>
              <div>
                <div className="font-semibold text-white">LinkedIn angle</div>
                <div className="mt-1">{active.distribution.linkedinAngle}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Newsletter angle</div>
                <div className="mt-1">{active.distribution.newsletterAngle}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <div className="text-lg font-bold">Interview questions</div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/75">
              {active.interviewQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-bold">Trending / inspirational videos</div>
              <button
                onClick={() => refreshIdeasForWeek(active.week)}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                Refresh ideas
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {active.inspiration.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-xs text-white/60">{v.platform}</div>
                    <div className="text-sm font-semibold">{v.title}</div>
                    
                      href={v.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs text-white/60 underline decoration-white/20 underline-offset-4 hover:text-white"
                    >
                      Open link
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => saveInspirationToEpisode(active.week, v)}
                      className="rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400"
                    >
                      Save to this episode
                    </button>
                    <button
                      onClick={() => removeInspirationFromEpisode(active.week, v.id)}
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {!isPaid && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                Demo includes Weeks 1-3. Want Weeks 4-12 + export?{" "}
                
                  className="font-semibold text-white underline decoration-white/20 underline-offset-4"
                  href={STRIPE_PAYMENT_LINK}
                >
                  Unlock here
                </a>
                .
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {!isPaid && plan && activeWeek > 3 && (
      <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 text-white/70">
        <div className="text-lg font-semibold text-white">
          Week {activeWeek} is part of the full version.
        </div>
        <div className="mt-2">
          Unlock Weeks 4-12 to view, copy, and export the full plan.
        </div>
        
          href={STRIPE_PAYMENT_LINK}
          className="mt-4 inline-flex rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
        >
          Unlock the full 12 weeks ($29)
        </a>
      </div>
    )}
  </div>
</div>
