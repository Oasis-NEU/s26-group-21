import { useNavigate } from "react-router-dom"
import { useParams } from "react-router"
import { useState, useEffect } from "react";
import "./ListingDetailPage.css"
import DeleteButton from "../components/DeleteButton";

const API_URL = import.meta.env.VITE_API_URL

// creating React component (reusable piece of UI)
// export makes it available to be imported by other files
export default function ListingDetailPage() {
    // <div> groups content together
    // what will be displayed on screen

    // button that navigates user back to marketplace
    const BackButton = () => {
        let navigate = useNavigate()
        return (
                <button className="back-button" 
                onClick={() => navigate("/marketplace")}>
                Return to Marketplace
            </button>
        )
    }

    const {textbook_id} = useParams()
    const [listing, setListing] = useState([])

    useEffect(() => {
        // api call on component mount
        fetch(`${API_URL}/listings/${textbook_id}`)
        .then(response => response.json())
        .then(data => setListing(data))
        .catch(error => console.log(error));
    }, []) // empty dependency array = run once

    if (listing.length == 0) return <div>Loading...</div>
    return (
        <div>
            {/* title of page */}
            <h1>Listing Information</h1>

            {/* image of textbook */}
            <div className = "heading">
                {/* placeholder image and description */}
                <img src = {listing[0].image_url}
                alt="Image of seller's textbook"
                />
            </div>

            {/* textbook name */}
            <div>
                <h2>Name of Textbook</h2>
                <p>{listing[0].title}</p>
            </div>
            {/* author(s) of textbook */}
            <div>
                <h2>Author(s)</h2>
                <p>{listing[0].authors}</p>
            </div>
            {/* textbook isbn number */}
            <div>
                <h2>ISBN Number</h2>
                <p>{listing[0].isbn}</p>
            </div>
            {/* textbook description */}
            <div>
                <h2>Description</h2>
                <p>{listing[0].description}</p>
            </div>
            {/* price of textbook */}
            <div>
                <h2>Price</h2>
                <p>{listing[0].price}</p>
            </div>
            {/* contact information of seller */}
            <div>
                <h2>Contact Information</h2>
                <p>{listing[0].contact_info}</p>
            </div>
            <div className="button-container">
                <BackButton/>
            </div>
            <div>
                <DeleteButton textbook_id = {listing[0].textbook_id}/>
            </div>
        </div>
    )
}