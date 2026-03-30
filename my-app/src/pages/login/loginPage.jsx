import { useState } from "react"
import { useNavigate } from "react-router-dom"
// import logo from "../assets/NU_RGB_seal_R.png"
import "./login.css"

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError("")

        if (!email.endsWith("@northeastern.edu")) {
            setError("Please use your @northeastern.edu email.")
            return
        }

        if (password === "") {
            setError("Please enter your password.")
            return
        }

        if (isSignUp) {
            if (name.trim() === "") {
                setError("Please enter your full name.")
                return
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match.")
                return
            }
        }

        navigate("/marketplace")
    }

    const switchMode = () => {
        setIsSignUp(!isSignUp)
        setError("")
        setPassword("")
        setConfirmPassword("")
    }

    return (
        <div className="login-page">
            <div className="login-logo-placeholder" />
            <h1 className="login-brand">Text<span className="login-brand-look">Look</span></h1>
            <p className="login-subtitle">Because knowledge shouldn't be hard to find.</p>
            <p className="login-tagline">Made in Oasis @ Northeastern</p>
            <div className="login-card">
                <div className="login-tabs" style={{ "--tab-offset": isSignUp ? "1" : "0" }}>
                    <div className="tab-slider" />
                    <button
                        className={`tab-btn ${!isSignUp ? "active" : ""}`}
                        onClick={() => !isSignUp || switchMode()}
                        type="button"
                    >
                        Sign In
                    </button>
                    <button
                        className={`tab-btn ${isSignUp ? "active" : ""}`}
                        onClick={() => isSignUp || switchMode()}
                        type="button"
                    >
                        Sign Up
                    </button>
                </div>

                {error && <p className="login-error">{error}</p>}

                <form onSubmit={handleSubmit} className="login-form">
                    {isSignUp && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="login-input"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Northeastern Email (@northeastern.edu)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    {isSignUp && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="login-input"
                        />
                    )}

                    {!isSignUp && (
                        <a href="/forgot-password" className="login-forgot">Forgot Password?</a>
                    )}

                    <button type="submit" className="login-btn">
                        {isSignUp ? "Create Account" : "Sign In"}
                    </button>
                </form>

                <p className="login-switch">
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <span className="login-switch-link" onClick={switchMode}>
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </span>
                </p>
            </div>
        </div>
    )
}
