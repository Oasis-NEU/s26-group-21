import { useState } from 'react'
import './listingCard.css'

function ListingCard({ item, onViewDetails }) {
  const [starred, setStarred] = useState(false)

  return (
    <article className="listingCard" onClick={() => onViewDetails(item)}>
      <div className="listingCard-imageWrapper">
        <img src={item.image_url} alt={item.title} />
      </div>
      <div className="listingCard-body">
        <span className="listingCard-category">{item.category}</span>
        <h3 className="listingCard-title">{item.title}</h3>
        <p className="listingCard-description">{item.description}</p>
        <div className="listingCard-meta">
          <span className="listingCard-price">${item.price.toFixed(2)}</span>
        </div>
        <div className="listingCard-footer">
          <span className="listingCard-location">{item.location}</span>
        </div>
      </div>
      <button
        type="button"
        className={`listingCard-star${starred ? ' listingCard-star--active' : ''}`}
        title={starred ? 'Remove from wants' : 'Add to wants'}
        onClick={(e) => { e.stopPropagation(); setStarred((s) => !s) }}
      >
        <svg viewBox="0 0 24 24" fill={starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    </article>
  )
}

function ListingGrid({ items, onViewDetails }) {
  if (!items.length) {
    return (
      <div className="listingGrid-empty">
        <h3>No textbooks found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="listingGrid">
      {items.map((item) => (
        <ListingCard key={item.textbook_id} item={item} onViewDetails={onViewDetails} />
      ))}
    </div>
  )
}

export default ListingGrid
