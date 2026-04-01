import { useMemo, useState, useEffect } from 'react'
import { categories, marketplaceItems } from './marketplaceData'

// Importing components to be used on marketplace
import Navbar from '../navbar/navbar.jsx'
import FilterBar from './components/filterBar/filterBar.jsx'
import ViewButtons from './components/viewButtons/viewButtons.jsx'
import ListingGrid from './components/listingCard/listingCard.jsx'
import DetailsOverlay from './components/detailsOverlay/detailsOverlay.jsx'
import AddListingFAB from './components/addListingFAB/addListingFAB.jsx'
import AddListingOverlay from './components/addListingOverlay/addListingOverlay.jsx'

import './marketplace.css'

function MarketplacePage({ session }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortOption, setSortOption] = useState('relevance')
  const [selectedItem, setSelectedItem] = useState(null)
  const [activeView, setActiveView] = useState('all')
  const [showAddListing, setShowAddListing] = useState(false)
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    fetch(`http://localhost:8000/users/${session.user.id}`)
    .then(res => res.json())
    .then(data => setFirstName(data[0].first_name))
  }, [])

  const filteredItems = useMemo(() => {
    let items = marketplaceItems

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q),
      )
    }

    if (selectedCategory !== 'All') {
      items = items.filter((item) => item.category === selectedCategory)
    }

    if (sortOption === 'price-asc') {
      items = [...items].sort((a, b) => a.price - b.price)
    } else if (sortOption === 'price-desc') {
      items = [...items].sort((a, b) => b.price - a.price)
    }

    return items
  }, [searchQuery, selectedCategory, sortOption])

  return (
    <>
      <Navbar />
      <main className="marketplace">
        <section className="marketplace-hero">
          <h1>Welcome to the Marketplace, <span className="marketplace-hero-look">{firstName}</span></h1>
          <p className="marketplace-subtitle">
            Buy and sell course textbooks directly with other Huskies.
          </p>
        </section>

        <ViewButtons activeView={activeView} onViewChange={setActiveView} />

        <section className="marketplace-controls">
          <FilterBar
            categories={categories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
            totalCount={filteredItems.length}
          />
        </section>

        <section className="marketplace-content">
          <ListingGrid
            items={filteredItems}
            onViewDetails={(item) => setSelectedItem(item)}
          />
        </section>
      </main>

      <DetailsOverlay item={selectedItem} onClose={() => setSelectedItem(null)} />
      <AddListingFAB onClick={() => setShowAddListing(true)} />
      <AddListingOverlay open={showAddListing} onClose={() => setShowAddListing(false)} />
    </>
  )
}

export default MarketplacePage
