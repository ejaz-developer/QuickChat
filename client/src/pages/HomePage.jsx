import React from 'react'
import { Users } from 'lucide-react'
import HeroSection from '../components/HeroSection'

function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Team workspace
            </p>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Conversations at a glance
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
            <Users className="h-4 w-4 text-emerald-400" />
            14 teammates active
          </div>
        </div>
        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/40 p-6">
          <p className="text-sm text-slate-200">
            Jump into the workspace view to explore the full chat interface and
            switch between conversations seamlessly.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-slate-400">
            <span>Focused channels</span>
            <span>Conversation search</span>
            <span>Smart status</span>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
