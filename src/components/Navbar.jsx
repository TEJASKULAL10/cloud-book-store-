import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <span className="brand">Cloud Book Store</span>
      {user && (
        <div className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/my-books">My Books</NavLink>
          <NavLink to="/upload">Upload Book</NavLink>
          <button className="link-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
