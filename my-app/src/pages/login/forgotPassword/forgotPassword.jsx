/**
 * @fileoverview The forgotten password page of login. 
 * Handles user entering email to get a password reset link. (will be set up through Supabase)
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../login.css"
import "./forgotPassword.css"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("") // Setting email to empty string
    // Determining that user has not submitted request to change password
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("") // Setting error to empty string

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault() // Preventing browser handling of error to perform logic
        setError("") // Clearing previous errors

        if (!email.endsWith("@northeastern.edu")) {
            setError("Please use your @northeastern.edu email.")
            return
        }

        setSubmitted(true) // If northeastern email entered, setting submitted to true
    }

    return (
        <div className="login-page">
            <div className="login-logo-placeholder" />
            <h1 className="login-brand">Text<span className="login-brand-look">Look</span></h1>
            <p className="login-subtitle">Because knowledge shouldn't be hard to find.</p>
            <p className="login-tagline">Made in Oasis @ Northeastern</p>
            <div className="login-card">
                {submitted ? (
                    // If user has successfully entered email, updates page
                    <div className="fp-success">
                        <div className="fp-icon">&#10003;</div>
                        <p className="fp-success-text">
                            If an account exists for <strong>{email}</strong>, a reset link has been sent.
                        </p>
                        <button className="login-btn" onClick={() => navigate("/")}>
                            Back to Sign In
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Renders forgot password page */}
                        <p className="fp-description">
                            Enter your Northeastern email and we'll send you a link to reset your password.
                        </p>

                        {/* Renders error message if state is true */}
                        {error && <p className="login-error">{error}</p>}

                        <form onSubmit={handleSubmit} className="login-form">
                            <input
                                type="email"
                                placeholder="Northeastern Email (@northeastern.edu)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                            />
                            <button type="submit" className="login-btn">
                                Send Reset Link
                            </button>
                        </form>

                        <p className="login-switch">
                            Remembered it?{" "}
                            <span className="login-switch-link" onClick={() => navigate("/")}>
                                Back to Sign In
                            </span>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}
