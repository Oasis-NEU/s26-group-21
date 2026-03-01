import { useNavigate } from "react-router-dom"
import "./ListingDetailPage.css"

// creating React component (reusable piece of UI)
// export makes it available to be imported by other files
export default function ListingDetailPage() {
    // <div> groups content together
    // what will be displayed on screen

    // button that navigates user back to marketplace
    const BackButton = () => {
        let navigate = useNavigate();
        return (
                <button className="back-button" 
                onClick={() => navigate("/marketplace")}>
                Return to Marketplace
            </button>
        )
    }

    return (
        <div>
            {/* title of page */}
            <h1>Listing Information</h1>

            {/* image of textbook */}
            <div>
                {/* placeholder image and description */}
                <img src="https://picsum.photos/200"
                alt="Image of seller's textbook"
                />
            </div>

            {/* textbook name */}
            <div>
                <h2>Name of Textbook</h2>
                <p>textbook</p>
            </div>
            {/* textbook isbn number */}
            <div>
                <h2>ISBN Number</h2>
                <p>isbn</p>
            </div>
            {/* textbook description */}
            <div>
                <h2>Description</h2>
                <p>desc.</p>
            </div>
            {/* price of textbook */}
            <div>
                <h2>Price</h2>
                <p>$</p>
            </div>
            {/* contact information of seller */}
            <div>
                <h2>Contact Information</h2>
                <p>info.</p>
            </div>
            <div className="button-container">
                <BackButton/>
            </div>
        </div>
    )
}