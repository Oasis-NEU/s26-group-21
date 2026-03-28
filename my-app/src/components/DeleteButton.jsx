import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL

export default function DeleteButton({textbook_id}) {
    let navigate = useNavigate()
    function handleDelete() {
        fetch(`${API_URL}/listings/${textbook_id}`, {
            method: 'DELETE'
        })
        .then(response => {
            // Checking if response was succesful
            if (response.ok) {
                navigate("/marketplace")
            }
        })
        .catch(error => {
            console.error('Failed to delete listing:', error)
        })
        
    }
    return (
        <button onClick={handleDelete}>
            Delete Listing
        </button>
    )
}
