import './viewButtons.css'

function ViewButtons({ activeView, onViewChange }) {
  return (
    <div className="marketplace-view-btns">
      {activeView !== 'all' &&
        <button
          type="button"
          className="marketplace-view-btn marketplace-view-btn--return"
          onClick={() => onViewChange('all')}
        >
          {'\u2190'}
        </button>
      }
      <>
        <button
          type="button"
          className={`marketplace-view-btn marketplace-view-btn--listings${activeView === 'mine' ? ' marketplace-view-btn--active' : ''}`}
          onClick={() => onViewChange((v) => v === 'mine' ? 'all' : 'mine')}
        >
          My Listings
        </button>
        <button
          type="button"
          className={`marketplace-view-btn marketplace-view-btn--wants${activeView === 'wants' ? ' marketplace-view-btn--active' : ''}`}
          onClick={() => onViewChange((v) => v === 'wants' ? 'all' : 'wants')}
        >
          Wants
        </button>
      </>
    </div>
  )
}

export default ViewButtons
