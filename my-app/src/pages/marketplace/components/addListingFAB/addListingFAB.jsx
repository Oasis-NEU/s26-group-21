import './addListingFAB.css'

function AddListingFAB({ onClick }) {
  return (
    <button className="fab-add" title="Add listing" onClick={onClick}>
      +
    </button>
  )
}

export default AddListingFAB
