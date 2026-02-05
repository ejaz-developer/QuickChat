import React from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Zap } from 'lucide-react'
import PreviewList from './PreviewList'

function HeroSection() {
  return (
    <section
      id="home"
      className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-10 md:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-200">
          <Zap className="h-4 w-4" />
          The modern chat experience
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
          Keep your team connected with a clean, focused chat flow.
        </h1>
        <p className="text-base text-slate-200 md:text-lg">
          Organize contacts, shift between conversations instantly, and stay on
          top of the work that matters. Everything feels fast, lightweight, and
          ready for remote teams.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            to="/chat"
          >
            Jump into chat
          </Link>
          <button className="rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:border-white/60">
            See how it works
          </button>
        </div>
        <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.3em] text-slate-300">
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            Realtime updates
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            Secure threads
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            Smart search
          </span>
        </div>
      </div>

      <PreviewList />
    </section>
  )
}

export default HeroSection
