import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "var(--primary-light)",
          color: "var(--primary)",
          padding: "6px 16px",
          borderRadius: "var(--radius-full)",
          fontWeight: 600,
          fontSize: "0.85rem",
          marginBottom: 20,
        }}
      >
        <span>✨</span> Cloud-Powered Digital Library
      </div>

      <h1 style={{ fontSize: "2.8rem", maxWidth: 700, margin: "0 auto 16px", lineHeight: 1.2 }}>
        Store, Organize, and Read Your Books Anywhere
      </h1>

      <p style={{ fontSize: "1.15rem", maxWidth: 540, margin: "0 auto 32px" }}>
        A modern cloud bookstore designed for readers. Upload your PDFs and eBooks to secure cloud storage and manage your collection effortlessly.
      </p>

      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <Link className="btn" to="/login" style={{ padding: "14px 28px", fontSize: "1rem" }}>
          <span>Get Started Now</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
        <Link className="btn btn-secondary" to="/register" style={{ padding: "14px 28px", fontSize: "1rem" }}>
          Create Free Account
        </Link>
      </div>
    </div>
  );
}
