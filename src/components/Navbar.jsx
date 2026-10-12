import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, userName } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate("/login");
  }

  const userInitial = (userName || user?.email || "U")[0].toUpperCase();

  return (
    <header className="navbar">
      <Link to={user ? "/dashboard" : "/"} className="brand-wrapper">
        <div className="brand-icon-box">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <span className="brand">Cloud Book Store</span>
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/my-books" className={({ isActive }) => (isActive ? "active" : "")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>My Books</span>
            </NavLink>

            <NavLink to="/upload" className={({ isActive }) => (isActive ? "active" : "")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Upload Book</span>
            </NavLink>

            <div className="user-profile-badge">
              <div className="user-avatar" title={userName || user.email}>
                {userInitial}
              </div>
              <span className="user-name-text">{userName || "User"}</span>
              <button className="btn-nav-logout" onClick={handleLogout} title="Log Out">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-small">
              Log In
            </Link>
            <Link to="/register" className="btn btn-small">
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
