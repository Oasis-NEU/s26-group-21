import { useState, useRef } from 'react'
import './addListingOverlay.css'

const EMPTY_FORM = {
  title: '',
  isbn: '',
  price: '',
  location: '',
  copies: '',
  description: '',
}

function AddListingOverlay({ open, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [image, setImage] = useState(null)
  const [dragging, setDragging] = useState(false)
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

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: wire to backend
    console.log({ ...form, image: image?.file })
    onClose()
    setForm(EMPTY_FORM)
    setImage(null)
  }

  function handleClose() {
    onClose()
    setForm(EMPTY_FORM)
    setImage(null)
  }

  return (
    <div className="addListingOverlay">
      <div className="addListingOverlay-backdrop" onClick={handleClose} />
      <div className="addListingOverlay-modal" role="dialog" aria-modal="true" aria-label="Add listing">
        <button type="button" className="addListingOverlay-close" onClick={handleClose}>×</button>
        <h2 className="addListingOverlay-heading">New Listing</h2>

        <form className="addListingOverlay-form" onSubmit={handleSubmit}>
          {/* Image drop zone */}
          <div
            className={`addListingOverlay-dropzone${dragging ? ' addListingOverlay-dropzone--active' : ''}${image ? ' addListingOverlay-dropzone--filled' : ''}`}
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
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
              <input id="al-title" name="title" value={form.title} onChange={handleField} placeholder="e.g. Calculus: Early Transcendentals" required />
            </div>

            <div className="addListingOverlay-row">
              <div className="addListingOverlay-field">
                <label htmlFor="al-isbn">ISBN</label>
                <input id="al-isbn" name="isbn" value={form.isbn} onChange={handleField} placeholder="9783161484100" required />
              </div>
              <div className="addListingOverlay-field">
                <label htmlFor="al-price">Price ($)</label>
                <input id="al-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleField} placeholder="0.00" required />
              </div>
            </div>

            <div className="addListingOverlay-row">
              <div className="addListingOverlay-field">
                <label htmlFor="al-location">Location</label>
                <input id="al-location" name="location" value={form.location} onChange={handleField} placeholder="e.g. Snell Library" required />
              </div>
              <div className="addListingOverlay-field">
                <label htmlFor="al-copies">Copies Available</label>
                <input id="al-copies" name="copies" type="number" min="1" step="1" value={form.copies} onChange={handleField} placeholder="1" required />
              </div>
            </div>

            <div className="addListingOverlay-field">
              <label htmlFor="al-description">Description <span className="addListingOverlay-optional">(optional)</span></label>
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
