import { useMemo, useState, useEffect } from 'react'
import { categories } from './categories.js'

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
  const [searchQuery, setSearchQuery] = useState('') // for search query
  const [selectedCategory, setSelectedCategory] = useState('All') // for category when searching
  const [sortOption, setSortOption] = useState('relevance') // to sort listings
  const [selectedItem, setSelectedItem] = useState(null) // for selecting listing to see details
  const [activeView, setActiveView] = useState('all') // to put listing into overlay
  const [showAddListing, setShowAddListing] = useState(false) // to determine if add listing FAB was clicked
  const [firstName, setFirstName] = useState('') // for displaying user's first name
  const [listings, setListings] = useState([]) // setting the listings through database
  const [wants, setWants] = useState([]) // setting user wants through database

  // When clicking star, updates wants in database
  async function onToggleWant(textbook_id) {
    // If textbook_id exists in wants, then user wants to delete it
    if (wants.includes(textbook_id)) {
      try {
        const response = await fetch(
          `http://localhost:8000/wants/${textbook_id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        })
        // response.ok is true if server returns 200 success code
        if (!response.ok) {
          console.error("Could not remove textbook from wants.")
          return
        }
      } catch {
        // If fetch fails entirely due to no response from backend
        console.error("Network error. Please check your connection and try again.")
        return
      }
    }
    // If textbook_id does not exist in wants, then user wants to add it
    else {
      try {
        // POST to API as JSON
        const response = await fetch(
          'http://localhost:8000/wants', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: session.user.id,
            textbook_id: textbook_id
          })
        })
        // response.ok is true if server returns 200 success code
        if (!response.ok) {
          console.error("Could not add textbook to wants.")
          return
        }
      } catch {
        // If fetch fails entirely due to no response from backend
        console.error("Network error. Please check your connection and try again.")
        return
      }
    }
    fetchWants()
  }

  // Sends DELETE fetch for user to remove a listing
  async function onDeleteListing(textbook_id) {
    try {
      const response = await fetch(`http://localhost:8000/listings/${textbook_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      // response.ok is true if server returns 200 success code
      if (!response.ok) {
        console.error("Could not remove listing.")
        return
      }
    } catch {
      // If fetch fails entirely due to no response from backend
      console.error("Network error. Please check your connection and try again.")
      return
    }
    fetchListings()
  }

  // Fetches listings once after component loads
  useEffect(() => {
    fetchListings()
  }, [])

  // Fetches first name once after component loads
  useEffect(() => {
    fetch(`http://localhost:8000/users/${session.user.id}`)
      .then(res => res.json())
      .then(data => setFirstName(data[0].first_name))
  }, [])

  // Fetches wants once after component loads
  useEffect(() => {
    if (session) fetchWants()
  }, [])

  // Fetches all listings from backend
  const fetchListings = () => {
    fetch(`http://localhost:8000/listings/`)
      .then(res => res.json())
      .then(data => setListings(data))
  }

  // Fetches user's wants from backend
  const fetchWants = () => {
    fetch(`http://localhost:8000/wants/${session.user.id}`)
      .then(res => res.json())
      .then(data => setWants(data.map(row => row.textbook_id)))
  }

  // Filtering listings depending on user input
  const filteredItems = useMemo(() => {
    let items = listings

    // User wants to filter to own listings
    if (activeView == 'mine') {
      items = items.filter((item) => item.user_id === session.user.id)
    }

    // User wants to filter to listings they want
    if (activeView == 'wants') {
      items = items.filter((item) => wants.includes(item.textbook_id))
    }

    // User searching for specific listing
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      // Searching based on title, description, and isbn number
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          String(item.isbn).includes(q.replaceAll('-', ''))
      )
    }

    // If user selects a category, all listings with category are shown
    if (selectedCategory !== 'All') {
      items = items.filter((item) => item.category === selectedCategory)
    }

    // Sorting listings by price
    if (sortOption === 'price-asc') {
      items = [...items].sort((a, b) => a.price - b.price)
    } else if (sortOption === 'price-desc') {
      items = [...items].sort((a, b) => b.price - a.price)
    }

    return items
  }, [listings, activeView, searchQuery, selectedCategory, sortOption])

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
            wants={wants}
            session={session}
            onToggleWant={onToggleWant}
            activeView={activeView}
            onDeleteListing={onDeleteListing}
            onViewDetails={(item) => setSelectedItem(item)}
          />
        </section>
      </main>

      <DetailsOverlay
        item={selectedItem}
        wants={wants}
        session={session}
        onToggleWant={onToggleWant}
        onClose={() => setSelectedItem(null)} />
      <AddListingFAB onClick={() => setShowAddListing(true)} />
      <AddListingOverlay
        open={showAddListing}
        session={session}
        fetchListings={fetchListings}
        activeView={activeView}
        onDeleteListing={onDeleteListing}
        onClose={() => setShowAddListing(false)} />
    </>
  )
}

export default MarketplacePage
