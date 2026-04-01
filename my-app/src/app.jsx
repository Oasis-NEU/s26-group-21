/**
 * @fileoverview Defining client-side routes and maps URL paths to corresponding
 * page components (Login, Marketplace, ForgotPassword, Settings)
 */

import LoginPage from './pages/login/loginPage'
import ForgotPasswordPage from './pages/login/forgotPassword/forgotPassword'
import MarketplacePage from './pages/marketplace/marketplacePage'
import Settings from './pages/settings/settings'

import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { supabase } from './supabase'

function ProtectedRoute({ session, children }) {
  if (!session) {
    return <Navigate to="/" />
  }
  return children
}

function App() {
  // Rendering UI based on state of session
  const [session, setSession] = useState(null)

  // Keeping track of session as users log in and out
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <>
      {/* defining the routes that map URL paths to corresponding page components */}
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* root path, first thing user will see */}
        <Route path="/marketplace" element={
          <ProtectedRoute session={session}>
            <MarketplacePage session={session} />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/settings" element={
          <ProtectedRoute session={session}>
            <Settings />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
