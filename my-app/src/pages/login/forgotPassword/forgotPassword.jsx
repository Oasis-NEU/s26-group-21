import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../login.css"
import "./forgotPassword.css"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError("")

        if (!email.endsWith("@northeastern.edu")) {
            setError("Please use your @northeastern.edu email.")
            return
        }

        setSubmitted(true)
    }

    return (
        <div className="login-page">
            <div className="login-logo-placeholder" />
            <h1 className="login-brand">Text<span className="login-brand-look">Look</span></h1>
            <p className="login-subtitle">Because knowledge shouldn't be hard to find.</p>
            <p className="login-tagline">Made in Oasis @ Northeastern</p>
            <div className="login-card">
                {submitted ? (
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
                        <p className="fp-description">
                            Enter your Northeastern email and we'll send you a link to reset your password.
                        </p>

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
