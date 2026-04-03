import './detailsOverlay.css'

function DetailsOverlay({ item, onClose, wants, onToggleWant }) {
  if (!item) return null

  const mailtoHref = `mailto:${item.sellerEmail}?subject=${encodeURIComponent(
    `Interested in "${item.title}" textbook`,
  )}&body=${encodeURIComponent(
    `Hi,\n\nI'm interested in your listing for "${item.title}" on the TextLook.\n\nIs it still available?\n\nThanks,\n`,
  )}`

  return (
    <div className="detailsOverlay">
      <div className="detailsOverlay-backdrop" onClick={onClose} />
      <div className="detailsOverlay-modal" aria-label="Textbook details">
        <button type="button" className="detailsOverlay-close" onClick={onClose}>×</button>

        <div className="detailsOverlay-imageWrapper">
          <img src={item.image_url} alt={item.title} />
        </div>

        <div className="detailsOverlay-body">
          <span className="detailsOverlay-category">{item.category}</span>
          <div className="detailsOverlay-titleRow">
            <h2 className="detailsOverlay-title">{item.title}</h2>
            <button
              type="button"
              className={`listingCard-star${wants.includes(item.textbook_id) ? ' listingCard-star--active' : ''}`}
              title={wants.includes(item.textbook_id) ? 'Remove from wants' : 'Add to wants'}
              onClick={() => onToggleWant(item.textbook_id)}
            >
              <svg viewBox="0 0 24 24" fill={wants.includes(item.textbook_id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          </div>
          <p className="detailsOverlay-isbn">ISBN {item.isbn}</p>

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

          <p className="detailsOverlay-description">{item.description}</p>

          <a href={mailtoHref} className="detailsOverlay-primary">
            Contact seller
          </a>
        </div>
      </div>
    </div>
  )
}

export default DetailsOverlay
