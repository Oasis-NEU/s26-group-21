import { useMemo, useState } from 'react'
import { categories, marketplaceItems } from './marketplaceData'
import './marketplace.css'

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
    <article className="listingCard">
      <div className="listingCard-imageWrapper">
        <img src={item.thumbnailUrl} alt={item.title} />
      </div>
      <div className="listingCard-body">
        <span className="listingCard-category">{item.category}</span>
        <h3 className="listingCard-title">{item.title}</h3>
        <p className="listingCard-description">{item.shortDescription}</p>
        <div className="listingCard-meta">
          <span className="listingCard-price">${item.price.toFixed(2)}</span>
          <span className="listingCard-rating">★ {item.rating.toFixed(1)}</span>
        </div>
        <div className="listingCard-footer">
          <span className="listingCard-location">{item.location}</span>
          <button
            type="button"
            className="listingCard-cta"
            onClick={() => onViewDetails(item)}
          >
            View details
          </button>
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
      <aside className="detailsOverlay-panel" aria-label="Textbook details">
        <button
          type="button"
          className="detailsOverlay-close"
          onClick={onClose}
        >
          ×
        </button>
        <div className="detailsOverlay-imageWrapper">
          <img src={item.thumbnailUrl} alt={item.title} />
        </div>
        <div className="detailsOverlay-body">
          <span className="detailsOverlay-category">{item.category}</span>
          <h2 className="detailsOverlay-title">{item.title}</h2>
          <p className="detailsOverlay-location">{item.location}</p>
          <div className="detailsOverlay-meta">
            <span className="detailsOverlay-price">
              ${item.price.toFixed(2)}
            </span>
            <span className="detailsOverlay-rating">
              ★ {item.rating.toFixed(1)}
            </span>
          </div>
          <p className="detailsOverlay-description">{item.shortDescription}</p>
          <div className="detailsOverlay-quantity">
            <span className="detailsOverlay-quantity-label">Copies left</span>
            <span className="detailsOverlay-quantity-value">
              {item.quantity}
            </span>
          </div>
          <a href={mailtoHref} className="detailsOverlay-primary">
            Contact seller
          </a>
        </div>
      </aside>
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
      <main className="marketplace">
        <section className="marketplace-hero">
          <p className="marketplace-eyebrow">Northeastern textbook exchange</p>
          <h1>Campus Textbook Marketplace</h1>
          <p className="marketplace-subtitle">
            Buy and sell course textbooks directly with other Huskies. Search by
            title, course, or subject to find what you need for the semester.
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
    </>
  )
}

export default MarketplacePage

