import './listingCard.css'

function ListingCard({ item, onViewDetails, wants,
  onToggleWant, activeView, onDeleteListing, session }) {
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
      {activeView === 'mine' ?
        <button
          type="button"
          className="listingCard-trash"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteListing(item.textbook_id)
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 
              0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 
              0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 
              0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 
              0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 
              2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button> :
        session?.user?.id !== item.user_id &&
        <button
          type="button"
          className={`listingCard-star${wants.includes(item.textbook_id) ? ' listingCard-star--active' : ''}`}
          title={wants.includes(item.textbook_id) ? 'Remove from wants' : 'Add to wants'}
          onClick={(e) => { e.stopPropagation(); onToggleWant(item.textbook_id) }}
        >
          <svg viewBox="0 0 24 24" fill={wants.includes(item.textbook_id) ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 
            14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 
            2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      }
    </article>
  )
}

function ListingGrid({ items, onViewDetails, wants,
  onToggleWant, activeView, onDeleteListing, session }) {
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
        <ListingCard
          key={item.textbook_id} // React only has to re-render specific textbook
          session={session}
          item={item}
          wants={wants}
          onToggleWant={onToggleWant}
          activeView={activeView}
          onDeleteListing={onDeleteListing}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}

export default ListingGrid
