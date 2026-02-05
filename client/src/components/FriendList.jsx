import React from 'react'
import { Search, UserPlus } from 'lucide-react'
import { statusTone } from '../data/chatData'

function FriendList({ friends, selectedId, onSelect, search, onSearch }) {
  return (
    <aside className="flex max-h-screen min-h-[520px] flex-col rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Friends</p>
        <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-white/40">
          <UserPlus className="h-4 w-4" />
          Add new
        </button>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          placeholder="Search friends"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      <div className="mt-5 flex-1 space-y-3 overflow-y-auto pr-1">
        {friends.map((friend) => {
          const isActive = friend._id === selectedId
          const lastMessage = friend.lastMessage || 'No messages yet'
          const unreadCount = friend.unread || 0
          return (
            <button
              key={friend._id}
              onClick={() => onSelect(friend._id)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                isActive
                  ? 'border-amber-300/60 bg-amber-300/10'
                  : 'border-white/5 bg-slate-950/60 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                    {friend.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </div>
                  <span
                    className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-slate-950 ${statusTone[friend.status]}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {friend.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {lastMessage}
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-semibold text-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default FriendList
