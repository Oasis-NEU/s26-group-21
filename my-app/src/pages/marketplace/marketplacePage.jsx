import { useMemo, useState, useEffect } from 'react'
import { categories } from './categories.js'

// Importing components to be used on marketplace
import Navbar from '../../components/navbar/navbar.jsx'
import Spinner from '../../components/spinner/spinner.jsx'

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
  const [listings, setListings] = useState([]) // setting the listings through database
  const [wants, setWants] = useState([]) // setting user wants through database

  const [firstName, setFirstName] = useState('') // For displaying user's first name
  const [lastName, setLastName] = useState('') // For displaying user's last name

  const [error, setError] = useState('') // setting error to be displayed as banner
  const [isLoading, setIsLoading] = useState(true) // loading listings on marketplace for UI

  const [editListing, setEditListing] = useState(null) // if user is editing an existing listing

  // When clicking star, updates wants in database
  async function onToggleWant(textbook_id) {
    // If textbook_id exists in wants, then user wants to delete it
    if (wants.includes(textbook_id)) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/wants/${textbook_id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        })
        // response.ok is true if server returns 200 success code
        if (!response.ok) {
          setError("Could not remove textbook from wants.")
          return
        }
      } catch {
        // If fetch fails entirely due to no response from backend
        setError("Network error. Please check your connection and try again.")
        return
      }
    }
    // If textbook_id does not exist in wants, then user wants to add it
    else {
      try {
        // POST to API as JSON
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/wants`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: session.user.id,
            textbook_id: textbook_id
          })
        })
        // response.ok is true if server returns 200 success code
        if (!response.ok) {
          setError("Could not add textbook to wants.")
          return
        }
      } catch {
        // If fetch fails entirely due to no response from backend
        setError("Network error. Please check your connection and try again.")
        return
      }
    }
    fetchWants()
  }

  // Sends DELETE fetch for user to remove a listing
  async function onDeleteListing(textbook_id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/listings/${textbook_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      // response.ok is true if server returns 200 success code
      if (!response.ok) {
        setError("Could not remove listing.")
        return
      }
    } catch {
      // If fetch fails entirely due to no response from backend
      setError("Network error. Please check your connection and try again.")
      return
    }
    fetchListings()
  }

  // Sends PUT fetch for user to edit a listing
  async function onEditListing(item) { setEditListing(item) }

  // Fetches user's name once after component loads
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users/${session.user.id}`)
      .then(res => res.json())
      .then(data => { setFirstName(data[0].first_name); setLastName(data[0].last_name) })
  }, [])

  // Fetches listings once after component loads
  useEffect(() => {
    fetchListings()
  }, [])

  // Fetches wants once after component loads
  useEffect(() => {
    if (session) fetchWants()
  }, [])

  useEffect(() => {
    let timer = setTimeout(() => {
      setError('')
    }, 4985)

    return () => {
      clearTimeout(timer)
    }
  }, [error])

  // Fetches all listings from backend
  const fetchListings = () => {
    setIsLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/listings/`)
      .then(res => res.json())
      .then(data => { setListings(data); setIsLoading(false) })
  }

  // Fetches user's wants from backend
  const fetchWants = () => {
    fetch(`${import.meta.env.VITE_API_URL}/wants/${session.user.id}`)
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
      // Lowest price - highest price --> negative number, cheapest first
      items = [...items].sort((a, b) => a.price - b.price)
    } else if (sortOption === 'price-desc') {
      // Highest price - lowest price --> positive number, most expensive first
      items = [...items].sort((a, b) => b.price - a.price)
    } else if (sortOption === 'newest') {
      // Newest date - oldest date --> positive number, newest first
      items = [...items].sort((a, b) => new Date(b.listed_at) - new Date(a.listed_at))
    } else if (sortOption === 'oldest') {
      // Oldest date - newest date --> negative number, oldest first
      items = [...items].sort((a, b) => new Date(a.listed_at) - new Date(b.listed_at))
    }

    return items
  }, [listings, wants, activeView, searchQuery, selectedCategory, sortOption])

  return (
    <>
      <Navbar firstName={firstName} lastName={lastName} session={session} />
      <main className="marketplace">
        <section className="marketplace-hero">
          <h1>Welcome to the Marketplace<span className="marketplace-hero-look"></span></h1>
          <p className="marketplace-subtitle">
            Buy and sell textbooks directly with other Huskies.
          </p>
        </section>

        {error !== '' &&
          <div
            id="temp-banner"
            className="marketplace-banner"
          >
            {error}
          </div>
        }

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
          {isLoading == false ?
            <ListingGrid
              items={filteredItems}
              wants={wants}
              session={session}
              onToggleWant={onToggleWant}
              activeView={activeView}
              onDeleteListing={onDeleteListing}
              onViewDetails={(item) => setSelectedItem(item)}
            /> :
            <div
              className='spinner-location'
            >
              <Spinner />
            </div>
          }
        </section>
      </main>

      <DetailsOverlay
        item={selectedItem}
        wants={wants}
        session={session}
        onToggleWant={onToggleWant}
        onEditListing={onEditListing}
        onDeleteListing={onDeleteListing}
        onClose={() => setSelectedItem(null)} />
      <AddListingFAB onClick={() => setShowAddListing(true)} />
      <AddListingOverlay
        open={showAddListing || editListing !== null}
        session={session}
        fetchListings={fetchListings}
        editListing={editListing}
        onEditListing={onEditListing}
        onClose={() => { setShowAddListing(false); setEditListing(null) }} />
    </>
  )
}

export default MarketplacePage
