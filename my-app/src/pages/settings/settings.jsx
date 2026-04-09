import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar/navbar.jsx'
import { supabase } from '../../supabase'
import eyeIcon from "../../assets/eye.svg"
import eyeOffIcon from "../../assets/eye-off.svg"
import './settings.css'

function Settings({ session }) {
    const navigate = useNavigate()
    const containsAlphabeticalCharacter = /[A-Za-z]/

    const [draftEmail, setDraftEmail] = useState('') // What user types for changing email
    const [email, setEmail] = useState('') // Setting email to new email
    const [editingEmail, setEditingEmail] = useState(false) // Whether editing input is shown for email

    const [firstName, setFirstName] = useState('') // Displayed front name from backend
    const [lastName, setLastName] = useState('')  // Displayed last name from backend
    const [editingName, setEditingName] = useState(false) // Whether editing input is shown for names
    const [draftFirst, setDraftFirst] = useState('') // What user types for editing first name
    const [draftLast, setDraftLast] = useState('') // What user types for editing last name
    const [nameError, setNameError] = useState('')

    const [editingPassword, setEditingPassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState('')

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Fetches first name, last name, and email once after component loads
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users/${session.user.id}`)
            .then(res => res.json())
            .then(data => {
                setFirstName(data[0].first_name);
                setLastName(data[0].last_name);
            })
            .catch(() => setError("Could not load user data."))
        setEmail(session.user.email)
    }, [])

    // Sends PUT fetch for user to update name
    async function onEditName(session, newFirst, newLast) {
        // PUT to API as JSON
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${session.user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: session.user.id,
                    first_name: newFirst,
                    last_name: newLast
                })
            })
            // response.ok is true if server returns 200 success code
            if (!response.ok) {
                setNameError("Failed to change name.")
                return false
            }
            return true
        } catch {
            // If fetch fails entirely due to no response from backend
            setNameError("Network error. Please check your connection and try again.")
            return false
        }
    }

    async function onEditEmail() {
        if (!draftEmail.endsWith('@northeastern.edu')) { setError("Must be a valid Northeastern email."); return }
        const response = await supabase.auth.updateUser({ email: draftEmail })
        if (response.error) { setError(response.error); return } // If error resetting email
        setEmail(response.data.user.email)
    }

    async function onEditPassword() {
        // Checking that new password and confirmation match
        if (newPassword !== confirmPassword) { setError("Passwords do not match."); return false }
        const response = await supabase.auth.updateUser({ password: newPassword })
        if (response.error) { setError(response.error); return false } // If error resetting password
        return true // If password change was succesful
    }

    async function onDeleteAccount(session) {
        if (window.confirm(
            "Are you sure you want to delete your account? This cannot be undone."
        )) {
            // DELETE to API as JSON
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${session.user.id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                })
                // response.ok is true if server returns 200 success code
                if (!response.ok) {
                    setError("Could not delete account.")
                    return
                }
            } catch {
                // If fetch fails entirely due to no response from backend
                setError("Network error. Please check your connection and try again.")
                return
            }
            handleSignOut()
        }
    }


    function openNameModal() {
        setDraftFirst(firstName)
        setDraftLast(lastName)
        setNameError('')
        setEditingName(true)
    }

    async function saveNameModal() {
        const nextFirst = draftFirst.trim()
        const nextLast = draftLast.trim()

        if (!containsAlphabeticalCharacter.test(nextFirst)) {
            setNameError("Please enter your first name.")
            return
        }

        if (!containsAlphabeticalCharacter.test(nextLast)) {
            setNameError("Please enter your last name.")
            return
        }

        const saveSucceeded = await onEditName(session, nextFirst, nextLast)
        if (!saveSucceeded) {
            return
        }

        setFirstName(nextFirst)
        setLastName(nextLast)
        setDraftFirst(nextFirst)
        setDraftLast(nextLast)
        setNameError('')
        setEditingName(false)
    }

    function openPasswordModal() {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setEditingPassword(true)
    }

    async function handleSignOut() {
        await supabase.auth.signOut();
        navigate('/')
    }

    async function savePasswordModal() {
        // password update logic will connect to backend
        const success = await onEditPassword()
        if (success) {
            setNewPassword('')
            setConfirmPassword('')
            setCurrentPassword('')
            setEditingPassword(false)
        }
    }

    return (
        <>
            {error !== '' &&
                <div
                    id="temp-banner"
                    className='settings-banner'
                >
                    {error}
                </div>
            }

            <Navbar firstName={firstName} lastName={lastName} session={session} />
            <div className="settings-page">
                <h1 className="settings-title">Settings</h1>
                <p className="settings-subtitle">Manage your account</p>

                <div className="settings-card">
                    <div className="settings-row">
                        <div className="settings-row-info">
                            <span className="settings-row-label">Name</span>
                            <span className="settings-row-value">{firstName} {lastName}</span>
                        </div>
                        <button
                            className="settings-link"
                            onClick={openNameModal}>Edit</button>
                    </div>

                    <div className="settings-divider" />

                    <div className="settings-row">
                        <div className="settings-row-info">
                            <span className="settings-row-label">Email</span>
                            {/* {editingEmail ? (
                                <div className="settings-row-edit">
                                    <input
                                        className="settings-input"
                                        value={draftEmail}
                                        onChange={(e) => setDraftEmail(e.target.value)}
                                        autoFocus
                                    />
                                    <button className="settings-link" onClick={() => { onEditEmail(); setEditingEmail(false) } }>Save</button>
                                </div>
                            ) : (
                                <span className="settings-row-value">{email}</span>
                            )}
                        </div>
                        {!editingEmail && (
                            <button className="settings-link" onClick={() => { setEditingEmail(true); setDraftEmail(email) } }>Edit</button>
                        )} */}
                            <span className='settings-row-value'>{email}</span>
                            <span className='settings-row-value' style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Email changes coming soon.</span>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <button className="settings-btn settings-btn--primary" onClick={openPasswordModal}>
                        Change Password
                    </button>
                    <div className="settings-divider" />
                    <button className="settings-btn settings-btn--outline" onClick={handleSignOut}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Log Out
                    </button>
                    <div className="settings-divider" />
                    <button className="settings-btn settings-btn--danger" onClick={() => onDeleteAccount(session)}>Delete Account</button>
                </div>
            </div>

            {/* Name edit modal */}
            {editingName && (
                <div className="settings-modal-backdrop" onClick={() => { setNameError(''); setEditingName(false) }}>
                    <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="settings-modal-title">Edit Name</h2>
                        {nameError && (
                            <div className="settings-modal-error" role="alert" aria-live="polite">
                                <span>{nameError}</span>
                                <button
                                    type="button"
                                    className="settings-modal-error-close"
                                    aria-label="Dismiss name error"
                                    onClick={() => setNameError('')}
                                >
                                    x
                                </button>
                            </div>
                        )}
                        <div className="settings-modal-fields">
                            <div className="settings-modal-field">
                                <label className="settings-modal-label">First Name</label>
                                <input
                                    className="settings-modal-input"
                                    type={"text"}
                                    value={draftFirst}
                                    onChange={(e) => setDraftFirst(e.target.value)}
                                />
                            </div>
                            <div className="settings-modal-field">
                                <label className="settings-modal-label">Last Name</label>
                                <input
                                    className="settings-modal-input"
                                    type={"text"}
                                    value={draftLast}
                                    onChange={(e) => setDraftLast(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="settings-modal-actions">
                            <button className="settings-modal-btn settings-modal-btn--cancel" onClick={() => { setNameError(''); setEditingName(false) }}>Cancel</button>
                            <button className="settings-modal-btn settings-modal-btn--save" onClick={saveNameModal}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change password modal */}
            {editingPassword && (
                <div className="settings-modal-backdrop" onClick={() => setEditingPassword(false)}>
                    <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="settings-modal-title">Change Password</h2>
                        <div className="settings-modal-fields">
                            <div className="settings-modal-field">
                                <label className="settings-modal-label">Current Password</label>
                                <div className="settings-input-wrapper">
                                    <input
                                        className="settings-modal-input"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="settings-eye-btn"
                                    >
                                        <img src={showCurrentPassword ? eyeOffIcon : eyeIcon} alt="toggle password" width="18" height="18" />
                                    </button>
                                </div>
                            </div>
                            <div className="settings-modal-field">
                                <label className="settings-modal-label">New Password</label>
                                <div className="settings-input-wrapper">
                                    <input
                                        className="settings-modal-input"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="settings-eye-btn"
                                    >
                                        <img src={showNewPassword ? eyeOffIcon : eyeIcon} alt="toggle password" width="18" height="18" />
                                    </button>
                                </div>
                            </div>
                            <div className="settings-modal-field">
                                <label className="settings-modal-label">Confirm New Password</label>
                                <div className="settings-input-wrapper">
                                    <input
                                        className="settings-modal-input"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="settings-eye-btn"
                                    >
                                        <img src={showConfirmPassword ? eyeOffIcon : eyeIcon} alt="toggle password" width="18" height="18" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="settings-modal-actions">
                            <button className="settings-modal-btn settings-modal-btn--cancel" onClick={() => setEditingPassword(false)}>Cancel</button>
                            <button className="settings-modal-btn settings-modal-btn--save" onClick={savePasswordModal}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Settings
