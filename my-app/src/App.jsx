import './App.css'
import LoginPage from './pages/login/loginPage'
import ForgotPasswordPage from './pages/login/forgotPassword/forgotPassword'
import MarketplacePage from './pages/marketplace/MarketplacePage'
import ListingDetailPage from './pages/ListingDetailPage'
import AddListingPage from './pages/AddListingPage'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
        {/* defining the routes that map URL paths to corresponding page components */}
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* root path, first thing user will see */}
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/listing-details" element={<ListingDetailPage />} />
        <Route path="/add-listing" element={<AddListingPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </>
  )
}

export default App
