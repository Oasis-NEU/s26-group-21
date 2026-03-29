// creating React component (reusable piece of UI)
// export makes it available to be imported by other files
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/NU_RGB_seal_R.png"
export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!email.endsWith("@northeastern.edu")){
            setError("Please enter your @northeastern.edu email.")
            return
        }

        if (password === ""){
            setError("Please enter your password")
            return
        }
        navigate("/marketplace")
    }

return (
    <div style={styles.page}>
        <div style={styles.card}>
            <img src={logo} alt="Northeastern University Logo" style={styles.logo} />
            <h2 style={styles.title}>Northeastern Marketplace</h2>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="email"
                    placeholder="Northeastern Email (@northeastern.edu)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <div style={styles.checkboxRow}>
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe" style={styles.checkboxLabel}>Remember Me</label>
                </div>
                <button type="submit" style={styles.button}>Sign In</button>
                <a href="/forgot-password" style={styles.link}>Forgot Password?</a>
            </form>

        </div>
    </div>
)
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        backgroundColor: "#2a2a2a",
        padding: "60px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "480px",
        borderTop: "4px solid #cc0000",
        boxShadow: "0 0 30px rgba(204, 0, 0, 0.3)",
    },
    title: {
        color: "#cc0000",
        textAlign: "center",
        marginBottom: "6px",
    },
    subtitle: {
        color: "#aaaaaa",
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "28px",
        fontFamily: "Georgia, serif",
        letterSpacing: "1px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #444",
        backgroundColor: "#1a1a1a",
        color: "white",
        fontSize: "14px",
        outline: "none",
    },
    checkboxRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    checkboxLabel: {
        color: "#aaaaaa",
        fontSize: "14px",
    },
    button: {
        padding: "12px",
        backgroundColor: "#cc0000",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
    },
    link: {
        color: "#cc0000",
        textAlign: "center",
        fontSize: "14px",
    },
    error: {
        color: "#ff4444",
        backgroundColor: "#3a1a1a",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "14px",
        textAlign: "center",
    },

    logo: {
        width: "120px",
        height: "120px",
        objectFit: "contain",
        display: "block",
        margin: "0 auto 16px auto",
    },
    signupText: {
        color: "#aaaaaa",
        textAlign: "center",
        fontSize: "14px",
        margin: "0",
    },
    signupLink: {
        color: "#cc0000",
        textDecoration: "none",
    },
}