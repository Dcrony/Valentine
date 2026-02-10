import { useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import "./admin.css";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey') || 'ibrahim');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('adminKey');
        if (storedKey === 'ibrahim') {
            setIsAuthenticated(true);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await API.get("/admin/users", {
                headers: {
                    'x-admin-key': adminKey
                }
            });
            setUsers(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            if (err.response && err.response.status === 403) {
                setError("Authorized Access Only. The embedded credential may be incorrect on the server.");
                setIsAuthenticated(false);
            } else {
                setError("Failed to load users. Please check server status.");
            }
        } finally {
            setLoading(false);
        }
    }, [adminKey]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUsers();
        }
    }, [isAuthenticated, fetchUsers]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (adminKey === 'ibrahim') {
            localStorage.setItem('adminKey', adminKey);
            setIsAuthenticated(true);
            setError(null);
        } else {
            setError("Invalid Credentials (Embedded check failed)");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminKey');
        setAdminKey('ibrahim'); // Reset to embedded default
        setIsAuthenticated(false);
        setUsers([]);
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-container">
                <div className="admin-login-card">
                    <h1 className="admin-title">Admin Access</h1>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#4b5563' }}>
                            Using embedded credentials: <strong>ibrahim</strong>
                        </div>
                        <input
                            type="password"
                            placeholder="Enter Key"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            className="admin-input" // define in css if needed, or stick to inline for simple inputs
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }}
                        />
                        <button
                            type="submit"
                            style={{ padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                        >
                            Login
                        </button>
                        {error && <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</div>}
                    </form>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="admin-container">
            <div className="admin-loading">
                <div className="spinner"></div> {/* You might need a spinner class in css */}
                Loading users...
            </div>
        </div>
    );

    if (error) return (
        <div className="admin-container">
            <div className="admin-error">
                <p>{error}</p>
                <button onClick={handleLogout} style={{ marginTop: '1rem', padding: '10px 20px', backgroundColor: '#ffffff', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Retry Login
                </button>
            </div>
        </div>
    );

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-title" style={{ fontSize: '1.5rem', margin: 0 }}>Valentine Admin</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="admin-subtitle" style={{ margin: 0, fontSize: '0.9rem' }}>Users: {users.length}</span>
                    <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500', color: '#374151' }}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Status</th>
                            <th>Responded At</th>
                            <th>Created At</th>
                            <th>Link ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.linkId}>
                                <td>{user.senderName}</td>
                                <td>{user.receiverName}</td>
                                <td>
                                    <span className={`status-badge status-${user.response}`}>
                                        {user.response}
                                    </span>
                                </td>
                                <td>
                                    {user.respondedAt
                                        ? new Date(user.respondedAt).toLocaleString()
                                        : "-"}
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <a href={`/val/${user.linkId}`} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>
                                        {user.linkId}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
