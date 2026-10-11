import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="hero">
      <h1>Cloud Book Store</h1>
      <p>Store and manage your books securely in the cloud.</p>
      <div className="actions center">
        <Link className="btn" to="/login">
          Login
        </Link>
        <Link className="btn btn-light" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}
