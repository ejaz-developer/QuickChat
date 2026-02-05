import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />

        <Header />
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
