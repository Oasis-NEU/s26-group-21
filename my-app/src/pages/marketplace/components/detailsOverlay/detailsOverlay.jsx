import { useEffect, useState } from 'react'

import './detailsOverlay.css'

function DetailsOverlay({ item, onClose, wants, onToggleWant, onDeleteListing, onEditListing, session }) {
  const [error, setError] = useState('')

  // Clears errors when item is changed
  useEffect(() => { setError('') }, [item])

  if (!item) return null

  const mailtoHref = `mailto:${item.sellerEmail}?subject=${encodeURIComponent(
    `Interested in "${item.title}" textbook`,
  )}&body=${encodeURIComponent(
    `Hi,\n\nI'm interested in your listing for "${item.title}" on TextLook.\n\nIs it still available?\n\nThanks!`,
  )}`

  // Sends GET fetch for a user's email for contact between users
  async function onContactSeller(item) {
    setError('')
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/email/${item.user_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      // response.ok is true if server returns 200 success code
      if (!response.ok) {
        setError("Could not contact seller.")
        return
      }
      const data = await response.json()
      const mailtoHref = `mailto:${data.email}?subject=${encodeURIComponent(
        `Interested in "${item.title}" textbook`,
      )}&body=${encodeURIComponent(
        `Hi,\n\nI'm interested in your listing for "${item.title}" on TextLook.\n\nIs it still available?\n\nThanks,\n`,
      )}`
      window.location.href = mailtoHref
    } catch {
      // If fetch fails entirely due to no response from backend
      setError("Network error. Please check your connection and try again.")
      return
    }
  }

  return (
    <>
      {error !== '' &&
        <div
          id="temp-banner"
          className='detailsOverlay-banner'
        >
          {error}
        </div>
      }


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
              {session.user.id !== item.user_id ?
                <button
                  type="button"
                  className={`detailsOverlay-star${wants.includes(item.textbook_id) ? ' detailsOverlay-star--active' : ''}`}
                  title={wants.includes(item.textbook_id) ? 'Remove from wants' : 'Add to wants'}
                  onClick={() => onToggleWant(item.textbook_id)}
                >
                  <svg viewBox="0 0 24 24" fill={wants.includes(item.textbook_id) ? 'currentColor' : 'none'}
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 
                14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button> :
                <button
                  type="button"
                  className="detailsOverlay-pencil"
                  onClick={() => { onEditListing(item); onClose() }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 
                  0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>

                </button>
              }
            </div>
            <p className="detailsOverlay-isbn">ISBN: {item.isbn}</p>

            <div className='detailsOverlay-row'>
              <span className='detailsOverlay-label'>Author(s)</span>
              <span className='detailsOverlay-value'>{item.authors}</span>
            </div>

            <div className="detailsOverlay-row">
              <span className="detailsOverlay-label">Price</span>
              <span className="detailsOverlay-value">${item.price.toFixed(2)}</span>
            </div>

            <p className="detailsOverlay-description">{item.description}</p>

            {session.user.id === item.user_id ?
              <button
                type="button"
                className="detailsOverlay-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteListing(item.textbook_id)
                  onClose()
                }}>Delete Listing</button> :
              <button
                className="detailsOverlay-primary"
                onClick={() => onContactSeller(item)}>
                Contact seller
              </button>
            }
          </div>
        </div>
      </div>
    </>
  )
}

  export default DetailsOverlay
