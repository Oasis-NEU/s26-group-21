/**
 * @fileoverview Defining client-side routes and maps URL paths to corresponding
 * page components (Login, Marketplace, ForgotPassword, Settings)
 */

import LoginPage from './pages/login/loginPage'
import ForgotPasswordPage from './pages/login/forgotPassword/forgotPassword'
import MarketplacePage from './pages/marketplace/marketplacePage'
import Settings from './pages/settings/settings'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
        {/* defining the routes that map URL paths to corresponding page components */}
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* root path, first thing user will see */}
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  )
}

export default App
