import React from 'react'
import { friendsSeed } from '../data/chatData'
import { Circle } from 'lucide-react'

function PreviewList() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Live preview</p>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Circle className="h-3 w-3 text-emerald-400" />
          Online now
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {friendsSeed.slice(0, 3).map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                {friend.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </div>
              <div>
                <p className="text-sm font-semibold">{friend.name}</p>
                <p className="text-xs text-slate-300">{friend.role}</p>
              </div>
            </div>
            <span className="text-xs text-slate-400">2m ago</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PreviewList
