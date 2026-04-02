import { useState, useRef } from 'react'
import './addListingOverlay.css'
import { categories } from '../../marketplaceData'
import { supabase } from '../../../../supabase'

const EMPTY_FORM = {
  title: '',
  authors: '',
  isbn: '',
  category: '',
  description: '',
  price: ''
}

function AddListingOverlay({ open, onClose, session, fetchListings}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [image, setImage] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  if (!open) return null

  function handleField(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function acceptFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setImage({ file, url: URL.createObjectURL(file) })
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    acceptFile(e.dataTransfer.files[0])
  }

  function handleClose() {
    onClose()
    setForm(EMPTY_FORM)
    setImage(null)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // Checking for missing fields in submission
    if (image === null) {
      setError("Please add an image.")
      return
    }
    if (!form.title) {
      setError("Please enter a title.")
      return
    }
    if (!form.authors) {
      setError("Please enter an author.")
      return
    }
    if (!form.isbn) {
      setError("Please enter an ISBN number.")
      return
    }
    if (!form.category) {
      setError("Please select a category.")
      return
    }

    // Ensuring image will render on marketplace

    // Generating unique file name
    let uniqueFileName = `${session.user.id}--${Date.now()}`
    // Checking for errors during image upload to bucket in supabase
    let { error: uploadError } = await supabase.storage.from('listing_images').upload(uniqueFileName, image.file)
    if (uploadError) {
      setError("Could not upload image. Please try again.")
      return
    }
    // Creating public URL to be used in marketplace
    let { data: { publicUrl } } = await supabase.storage.from('listing_images').getPublicUrl(uniqueFileName)

    try {
      // Post to API as JSON
      const response = await fetch("http://localhost:8000/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, // Spreading all form fields in
          user_id: session.user.id,
          image_url: publicUrl
        })
      })
      // response.ok is true if server returns 200 success code
      if (!response.ok) {
        setError("Failed to post listing.")
        return
      }
    } catch {
      // If fetch fails entirely due to no response from backend
      setError("Network error. Please check your connection and try again.")
      return
    }
    fetchListings()
    handleClose()
  }


  return (
    <div className="addListingOverlay">
      <div className="addListingOverlay-backdrop" onClick={handleClose} />
      <div className="addListingOverlay-modal" role="dialog" aria-modal="true" aria-label="Add listing">
        <button type="button" className="addListingOverlay-close" onClick={handleClose}>×</button>
        <h2 className="addListingOverlay-heading">New Listing</h2>

        <form className="addListingOverlay-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="addListingOverlay-error">{error}</p>}
          {/* Image drop zone */}
          <div
            className={`addListingOverlay-dropzone${dragging ? ' addListingOverlay-dropzone--active' : ''}
            ${image ? ' addListingOverlay-dropzone--filled' : ''}`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            {image ? (
              <>
                <img src={image.url} alt="preview" className="addListingOverlay-preview" />
                <button
                  type="button"
                  className="addListingOverlay-removeImg"
                  onClick={(e) => { e.stopPropagation(); setImage(null) }}
                >×</button>
              </>
            ) : (
              <div className="addListingOverlay-dropHint">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Drag &amp; drop an image, or <strong>click to browse</strong></span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => acceptFile(e.target.files[0])}
            />
          </div>

          <div className="addListingOverlay-fields">
            <div className="addListingOverlay-field">
              <label htmlFor="al-title">Title</label>
              <input id="al-title" name="title" value={form.title} onChange={handleField}
                placeholder="e.g. Calculus: Early Transcendentals" required />
            </div>

            <div className="addListingOverlay-row">
              <div className="addListingOverlay-field">
                <label htmlFor="al-authors">Author(s)</label>
                <input id="al-authors" name="authors" value={form.authors}
                  onChange={handleField} placeholder="e.g. John Doe, Jane Smith" required />
              </div>
              <div className="addListingOverlay-field">
                <label htmlFor="al-category">Category</label>
                <select name="category" onChange={handleField}
                  style={{ color: form.category === '' ? '#9ca3af' : '#0f172a' }}
                  value={form.category} required>
                  <option value="">Category</option>
                  {categories.filter(cat => cat !== "All").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="addListingOverlay-row">
              <div className="addListingOverlay-field">
                <label htmlFor="al-isbn">ISBN</label>
                <input id="al-isbn" name="isbn" value={form.isbn} onChange={handleField}
                  placeholder="9783161484100" required />
              </div>
              <div className="addListingOverlay-field">
                <label htmlFor="al-price">Price ($)</label>
                <input id="al-price" name="price" type="number" min="0" step="0.01"
                  value={form.price} onChange={handleField} placeholder="0.00" required />
              </div>
            </div>

            <div className="addListingOverlay-field">
              <label htmlFor="al-description">Description
                <span className="addListingOverlay-optional"> (optional)</span>
              </label>
              <textarea
                id="al-description"
                name="description"
                value={form.description}
                onChange={handleField}
                placeholder="Condition, edition notes, highlights, etc."
                rows={3}
              />
            </div>
          </div>

          <button type="submit" className="addListingOverlay-submit">Post Listing</button>
        </form>
      </div>
    </div>
  )
}

export default AddListingOverlay
