import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import AuthPage from './pages/AuthPage'
import { useAuth } from './context/AuthContext'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/chat"
          element={
            isAuthenticated ? <ChatPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/auth"
          element={
            isAuthenticated ? <Navigate to="/chat" replace /> : <AuthPage />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
