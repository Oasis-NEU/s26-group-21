import './viewButtons.css'

function ViewButtons({ activeView, onViewChange }) {
  return (
    <div className="marketplace-view-btns">
      <button
        type="button"
        className={`marketplace-view-btn marketplace-view-btn--blue${activeView === 'mine' ? ' marketplace-view-btn--active' : ''}`}
        onClick={() => onViewChange((v) => v === 'mine' ? 'all' : 'mine')}
      >
        My Listings
      </button>
      <button
        type="button"
        className={`marketplace-view-btn marketplace-view-btn--yellow${activeView === 'wants' ? ' marketplace-view-btn--active' : ''}`}
        onClick={() => onViewChange((v) => v === 'wants' ? 'all' : 'wants')}
      >
        Wants
      </button>
    </div>
  )
}

export default ViewButtons
