import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories, marketplaceItems } from './marketplaceData'
import './marketplace.css'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo-placeholder" />
        <span className="navbar-brand">
          Text<span className="navbar-brand-look">Look</span>
        </span>
      </div>
      <div className="navbar-right">
        <button className="navbar-icon-btn" title="Settings">
          {/* placeholder: replace with settings icon image */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <button className="navbar-icon-btn" title="Log out" onClick={() => navigate('/')}>
          {/* placeholder: replace with logout/door icon image */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

function FiltersBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  totalCount,
}) {
  return (
    <div className="filtersBar">
      <div className="filtersBar-main">
        <div className="filtersBar-search">
          <input
            type="text"
            placeholder="Search textbooks by title or course..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="filtersBar-right">
          <div className="filtersBar-chips" aria-label="Filter by subject">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={
                  cat === selectedCategory
                    ? 'filtersBar-chip filtersBar-chip--active'
                    : 'filtersBar-chip'
                }
                onClick={() => onCategoryChange(cat)}
              >
                {cat === 'All' ? 'All textbooks' : cat}
              </button>
            ))}
          </div>
          <select
            className="filtersBar-sort"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="filtersBar-meta">
        <span>{totalCount} textbook listings</span>
      </div>
    </div>
  )
}

function ListingCard({ item, onViewDetails }) {
  return (
    <article className="listingCard" onClick={() => onViewDetails(item)}>
      <div className="listingCard-imageWrapper">
        <img src={item.thumbnailUrl} alt={item.title} />
      </div>
      <div className="listingCard-body">
        <span className="listingCard-category">{item.category}</span>
        <h3 className="listingCard-title">{item.title}</h3>
        <p className="listingCard-description">{item.shortDescription}</p>
        <div className="listingCard-meta">
          <span className="listingCard-price">${item.price.toFixed(2)}</span>
        </div>
        <div className="listingCard-footer">
          <span className="listingCard-location">{item.location}</span>
        </div>
      </div>
    </article>
  )
}

function ListingGrid({ items, onViewDetails }) {
  if (!items.length) {
    return (
      <div className="listingGrid-empty">
        <h3>No items found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="listingGrid">
      {items.map((item) => (
        <ListingCard key={item.id} item={item} onViewDetails={onViewDetails} />
      ))}
    </div>
  )
}

function DetailsOverlay({ item, onClose }) {
  if (!item) return null

  const mailtoHref = `mailto:${item.sellerEmail}?subject=${encodeURIComponent(
    `Interested in "${item.title}" textbook`,
  )}&body=${encodeURIComponent(
    `Hi,\n\nI'm interested in your listing for "${item.title}" on the Northeastern Campus Textbook Marketplace.\n\nIs it still available?\n\nThanks,\n`,
  )}`

  return (
    <div className="detailsOverlay">
      <div className="detailsOverlay-backdrop" onClick={onClose} />
      <div className="detailsOverlay-modal" aria-label="Textbook details">
        <button type="button" className="detailsOverlay-close" onClick={onClose}>×</button>

        <div className="detailsOverlay-imageWrapper">
          <img src={item.thumbnailUrl} alt={item.title} />
        </div>

        <div className="detailsOverlay-body">
          <span className="detailsOverlay-category">{item.category}</span>
          <h2 className="detailsOverlay-title">{item.title}</h2>
          <p className="detailsOverlay-isbn">ISBN: {item.isbn}</p>

          <div className="detailsOverlay-row">
            <span className="detailsOverlay-label">Price</span>
            <span className="detailsOverlay-value">${item.price.toFixed(2)}</span>
          </div>

          <div className="detailsOverlay-row">
            <span className="detailsOverlay-label">Location</span>
            <span className="detailsOverlay-value">{item.location}</span>
          </div>

          <div className="detailsOverlay-row">
            <span className="detailsOverlay-label">Copies available</span>
            <span className="detailsOverlay-value">{item.quantity}</span>
          </div>

          <p className="detailsOverlay-description">{item.shortDescription}</p>

          {/* additional info can be added here */}

          <a href={mailtoHref} className="detailsOverlay-primary">
            Contact seller
          </a>
        </div>
      </div>
    </div>
  )
}

function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortOption, setSortOption] = useState('relevance')
  const [selectedItem, setSelectedItem] = useState(null)

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
          <h1>The Marketplace</h1>
          <p className="marketplace-subtitle">
            Buy and sell course textbooks directly with other Huskies.
          </p>
        </section>

        <section className="marketplace-controls">
          <FiltersBar
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
      <button className="fab-add" title="Add listing" onClick={() => navigate('/add-listing')}>+</button>
    </>
  )
}

export default MarketplacePage

