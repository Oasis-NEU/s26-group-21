import './App.css'
import MarketplacePage from './MarketplacePage.jsx'

function App() {
  return (
    <>
    <div className="app-shell">
      <header className="app-header">
        <span className="app-logo-dot" />
        <span className="app-title">Northeastern Marketplace</span>
      </header>
      <MarketplacePage />
    </div>
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
