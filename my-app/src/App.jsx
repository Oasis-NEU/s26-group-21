import './App.css'
import MarketplacePage from './MarketplacePage.jsx'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-logo-dot" />
        <span className="app-title">Northeastern Marketplace</span>
      </header>
      <MarketplacePage />
    </div>
  )
}

export default App
