import React, { useEffect, useRef } from 'react'
import { Plus, Send } from 'lucide-react'
import { statusTone } from '../data/chatData'

function ChatPanel({
  friend,
  messages,
  currentUserId,
  draft,
  onDraftChange,
  mediaPreview,
  onSelectMedia,
  onClearMedia,
  onSend,
  isSending,
  isLoading,
  isTyping,
}) {
  const fileRef = useRef(null)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isTyping])

  if (!friend) {
    return (
      <main className="flex min-h-[520px] flex-1 flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/40 p-8 text-center text-sm text-slate-300">
        Select a teammate to start chatting.
      </main>
    )
  }

  return (
    <main className="flex max-h-screen min-h-[520px] flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
            {friend.name
              .split(' ')
              .map((part) => part[0])
              .join('')}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{friend.name}</p>
            <p className="text-xs text-slate-400">{friend.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span
            className={`h-2 w-2 rounded-full ${statusTone[friend.status]}`}
          />
          {friend.status}
        </div>
      </div>
      {isTyping && (
        <div className="border-b border-white/10 px-6 py-2 text-xs text-slate-400">
          Typing...
        </div>
      )}

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {isLoading && (
          <p className="text-xs text-slate-400">Loading messages...</p>
        )}
        {!isLoading && messages.length === 0 && (
          <p className="text-xs text-slate-400">
            No messages yet. Say hello.
          </p>
        )}
        {messages.map((message) => {
          const isMe = message.senderId === currentUserId
          return (
            <div
              key={message._id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isMe
                    ? 'bg-amber-400 text-slate-900'
                    : 'bg-white/10 text-white'
                }`}
              >
                {message.text}
                {message.image && (
                  <img
                    className="mt-3 max-h-56 w-full rounded-xl object-cover"
                    src={message.image}
                    alt="attachment"
                  />
                )}
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      <form
        className="flex flex-wrap items-center gap-3 border-t border-white/10 px-6 py-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSend()
        }}
      >
        <label
          htmlFor="chat-media-upload"
          className="cursor-pointer rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-white/40"
        >
          <Plus className="h-4 w-4" />
        </label>
        <input
          id="chat-media-upload"
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = () => {
              const result = reader.result?.toString()
              if (result) {
                onSelectMedia(result, result)
              }
            }
            reader.readAsDataURL(file)
            event.target.value = ''
          }}
        />
        {mediaPreview && (
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2">
            <img
              src={mediaPreview}
              alt="preview"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <button
              type="button"
              className="text-xs text-slate-300"
              onClick={onClearMedia}
            >
              Remove
            </button>
          </div>
        )}
        <input
          className="min-w-[180px] flex-1 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          placeholder="Write a message"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
        />
        <button
          className="flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSending}
        >
          <Send className="h-4 w-4" />
          {isSending ? 'Sending' : 'Send'}
        </button>
      </form>
    </main>
  )
}

export default ChatPanel
