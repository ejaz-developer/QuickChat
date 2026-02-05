import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { MessageSquare, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinkClass = ({ isActive }) =>
  `transition ${
    isActive ? 'text-white' : 'text-slate-200 hover:text-white'
  }`

function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setSubmitting(true)
    try {
      await logout()
      navigate('/auth', { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-slate-900">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight">Chatapp</p>
          <p className="text-xs text-slate-300">Fast, focused conversations</p>
        </div>
      </Link>
      <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
        <NavLink className={navLinkClass} to="/">
          Home
        </NavLink>
        <NavLink className={navLinkClass} to="/chat">
          Workspace
        </NavLink>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{user?.username}</span>
            <button
              className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:border-white/60 disabled:cursor-not-allowed disabled:opacity-70"
              onClick={handleLogout}
              disabled={submitting}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:border-white/60"
            to="/auth"
          >
            <Sparkles className="h-4 w-4" />
            Start Free
          </Link>
        )}
      </nav>
    </header>
  )
}

export default Header
