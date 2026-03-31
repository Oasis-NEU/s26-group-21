import './filterBar.css'

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

function FilterBar({
  categories,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  totalCount,
}) {
  return (
    <div className="filterBar">
      <div className="filterBar-main">
        <div className="filterBar-search">
          <input
            type="text"
            placeholder="Search textbooks by title or course..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="filterBar-right">
          <div className="filterBar-chips" aria-label="Filter by subject">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={
                  cat === selectedCategory
                    ? 'filterBar-chip filterBar-chip--active'
                    : 'filterBar-chip'
                }
                onClick={() => onCategoryChange(cat)}
              >
                {cat === 'All' ? 'All textbooks' : cat}
              </button>
            ))}
          </div>
          <select
            className="filterBar-sort"
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
      <div className="filterBar-meta">
        <span>{totalCount} textbook listings</span>
      </div>
    </div>
  )
}

export default FilterBar
