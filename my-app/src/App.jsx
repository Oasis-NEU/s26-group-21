import './App.css'

import { Routes, Route } from 'react-router-dom'

import AddListingPage from './pages/AddListingPage'
import ListingDetailPage from './pages/ListingDetailPage'
import LoginPage from './pages/LoginPage'
import MarketplacePage from './pages/MarketplacePage'


function App() {
  return (
    <>
    {/* defining the routes that map URL paths to corresponding page components */}
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* root path, first thing user will see */}
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/listing-details" element={<ListingDetailPage />} />
        <Route path="/add-listing" element={<AddListingPage />} />
      </Routes>
    </>
  )
}

export default App
