import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar/navbar.jsx'
import './settings.css'

function Settings() {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState('First Name')
    const [lastName, setLastName] = useState('Last Name')
    const [email, setEmail] = useState('email@northeastern.edu')
    const [editingName, setEditingName] = useState(false)
    const [editingEmail, setEditingEmail] = useState(false)
    const [editingPassword, setEditingPassword] = useState(false)
    const [draftFirst, setDraftFirst] = useState('')
    const [draftLast, setDraftLast] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    function openNameModal() {
        setDraftFirst(firstName)
        setDraftLast(lastName)
        setEditingName(true)
    }

    function saveNameModal() {
        setFirstName(draftFirst)
        setLastName(draftLast)
        setEditingName(false)
    }

    function openPasswordModal() {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setEditingPassword(true)
    }

    function savePasswordModal() {
        // password update logic will connect to backend
        setEditingPassword(false)
    }

    return (
        <>
            <Navbar />
            <div className="settings-page">
                <h1 className="settings-title">Settings</h1>
                <p className="settings-subtitle">Manage your account</p>

                <div className="settings-card">
                    <div className="settings-row">
                        <div className="settings-row-info">
                            <span className="settings-row-label">Name</span>
                            <span className="settings-row-value">{firstName} {lastName}</span>
                        </div>
                        <button className="settings-link" onClick={openNameModal}>Edit</button>
                    </div>

                    <div className="settings-divider" />

                    <div className="settings-row">
                        <div className="settings-row-info">
                            <span className="settings-row-label">Email</span>
                            {editingEmail ? (
                                <div className="settings-row-edit">
                                    <input
                                        className="settings-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoFocus
                                    />
                                    <button className="settings-link" onClick={() => setEditingEmail(false)}>Save</button>
                                </div>
                            ) : (
                                <span className="settings-row-value">{email}</span>
                            )}
                        </div>
                        {!editingEmail && (
                            <button className="settings-link" onClick={() => setEditingEmail(true)}>Edit</button>
                        )}
                    </div>
                </div>

                <div className="settings-card">
                    <button className="settings-btn settings-btn--primary" onClick={openPasswordModal}>
                        Change Password
                    </button>
                    <div className="settings-divider" />
                    <button className="settings-btn settings-btn--outline" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Log Out
                    </button>
                    <div className="settings-divider" />
                    <button className="settings-btn settings-btn--danger">Delete Account</button>
                </div>
            </div>

            {/* Name edit modal */}
            {editingName && (
                <div className="settings-modal-backdrop" onClick={() => setEditingName(false)}>
                    <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="settings-modal-title">Edit Name</h2>
                        <div className="settings-modal-fields">
                            <div className="settings-modal-field">
                                <label className="settings-modal-label">First Name</label>
                                <input
                                    className="settings-modal-input"
                                    value={draftFirst}
                                    onChange={(e) => setDraftFirst(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="settings-modal-field">
                                <label className="settings-modal-label">Last Name</label>
                                <input
                                    className="settings-modal-input"
                                    value={draftLast}
                                    onChange={(e) => setDraftLast(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="settings-modal-actions">
                            <button className="settings-modal-btn settings-modal-btn--cancel" onClick={() => setEditingName(false)}>Cancel</button>
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
                                <input
                                    className="settings-modal-input"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="settings-modal-field">
                                <label className="settings-modal-label">New Password</label>
                                <input
                                    className="settings-modal-input"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="settings-modal-field">
                                <label className="settings-modal-label">Confirm New Password</label>
                                <input
                                    className="settings-modal-input"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
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
