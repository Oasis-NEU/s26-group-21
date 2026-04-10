/**
 * @fileoverview Handles user sign in and sign up to ensure all correct information is entered.
 * User must correctly enter name, email, password to be given access to app.
 * Form changes based on whether user is signing in or up.
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from '../../supabase'
import "./login.css"
import eyeIcon from "../../assets/eye.svg"
import eyeOffIcon from "../../assets/eye-off.svg"

import logo from '../../assets/textlook_logo_red_transparent.png'

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false) // Setting user signed up as false
    const [email, setEmail] = useState("") // Setting email to empty string
    // Setting password and password confirmation as empty strings
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false) // If user wants to see password while they type

    const [firstName, setFirstName] = useState("") // Setting first name to empty string
    const [lastName, setLastName] = useState("") // Setting last name to empty string

    const [error, setError] = useState("") // Setting error for signing in to empty string

    const navigate = useNavigate() // How different components will result in navigating app

    // Handling the submission of email and password
    const handleSubmit = async (e) => {
        e.preventDefault() // Preventing full browser reload to allow for own logic
        setError("") // Clearing previous errors

        // Handling errors for signing in to app

        if (!email.endsWith("@northeastern.edu")) {
            setError("Please use your @northeastern.edu email.")
            return
        }

        if (password === "") {
            setError("Please enter your password.")
            return
        }

        // If user is singing up for app, not singing *in*
        if (isSignUp) {
            // Error handling for during sign in
            if (firstName.trim() === "") {
                setError("Please enter your first name.")
                return
            }
            if (lastName.trim() === "") {
                setError("Please enter your last name.")
                return
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match.")
                return
            }
            // Determining if user was succesfully added to supabase
            const { data, error } = await supabase.auth.signUp({ email, password })

            // Error checking from supabase
            if (error) {
                setError(error.message + ".")
                return
            }

            try {
                // POST to API as JSON
                const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
                    method: "POST",
                    headers: { "Content-Type" : "application/json" },
                    body: JSON.stringify({
                        user_id: data.user.id,
                        first_name: firstName,
                        last_name: lastName
                    })
                })
                // response.ok is true if server returns 200 success code
                if (!response.ok) {
                    setError("Failed to create user profile.")
                    return
                }
            } catch {
                // If fetch fails entirely due to no response from backend
                setError("Network error. Please check your connection and try again.")
                return
            }
        }
        else {
            const { error } = await supabase.auth.signInWithPassword({ email, password })

            if (error) {
                setError(error.message + ".")
                return
            }
        }
        navigate("/marketplace") // Navgating to marketplace once there are no errors
    }

    // Called when user clicks between sign in/up
    // Resets form when switching between the two modes
    const switchMode = () => {
        setIsSignUp(!isSignUp)
        setError("")
        setFirstName("")
        setLastName("")
        setPassword("")
        setConfirmPassword("")
        setShowPassword(false)
    }

    return (
        <div className="login-page">
            <img className="login-logo" src={logo} />
            <h1 className="login-brand">Text<span className="login-brand-look">Look</span></h1> {/* Title/Brand */}
            <p className="login-subtitle">Because knowledge shouldn't be hard to find.</p>
            <p className="login-tagline">Made in Oasis @ Northeastern</p>
            <div className="login-card">
                <div className="login-tabs" style={{ "--tab-offset": isSignUp ? "1" : "0" }}>
                    <div className="tab-slider" />
                    {/* Switching between sign in/up */}

                    {/* Gets active when signing in */}
                    <button
                        className={`tab-btn ${!isSignUp ? "active" : ""}`}
                        onClick={() => !isSignUp || switchMode()}
                        type="button"
                    >
                        Sign In
                    </button>
                    {/* Gets active when signing up */}
                    <button
                        className={`tab-btn ${isSignUp ? "active" : ""}`}
                        onClick={() => isSignUp || switchMode()}
                        type="button"
                    >
                        Sign Up
                    </button>
                </div>

                {/* When error has a value, displays on screen */}
                {error && <p className="login-error">{error}</p>}

                {/* Runs all logic when user clicks button on login */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Renders first and last name entry on sign up form */}
                    {isSignUp && (
                        <div className="login-name-row">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName} // Binds input's displayed value to firstName state variable
                                onChange={(e) => setFirstName(e.target.value)} // Updates state variable on every keystroke
                                className="login-input"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName} // Binds input's displayed value to lastName state variable
                                onChange={(e) => setLastName(e.target.value)} // Updates state variable on every keystroke
                                className="login-input"
                            />
                        </div>
                    )}
                    {/* Display of sign in */}
                    <input
                        type="email" // Gives basic browser-level email format before handleSubmit runs
                        placeholder="Northeastern Email (@northeastern.edu)"
                        value={email} // Binds input's displayed value to email state variable
                        onChange={(e) => setEmail(e.target.value)} // Updates state variable on every keystroke
                        className="login-input"
                    />
                    <div className="login-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="login-eye-btn"
                        >
                            <img src={showPassword ? eyeOffIcon : eyeIcon} alt="toggle password" width="18" height="18" />
                        </button>
                    </div>
                    {/* Renders confirmation of password on sign up */}
                    {isSignUp && (
                        <input
                            type={showPassword ? "text" : "password"} // Masks characters when typing
                            placeholder="Confirm Password"
                            value={confirmPassword} // Binds input's value to confirmPassword state variable
                            onChange={(e) => setConfirmPassword(e.target.value)} // Update state variable on every keystroke
                            className="login-input"
                        />
                    )}

                    {/* If on sign in, renders forgot password link */}
                    {!isSignUp && (
                        <a href="/forgot-password" className="login-forgot">Forgot Password?</a>
                    )}

                    {/* Depending on form, changes button to access marketplace */}
                    <button type="submit" className="login-btn">
                        {isSignUp ? "Create Account" : "Sign In"}
                    </button>
                </form>

                {/* Depending on form, renders sign in/up link */}
                <p className="login-switch">
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <span className="login-switch-link" onClick={switchMode}> {/* Resets form */}
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </span>
                </p>
            </div>
        </div>
    )
}
