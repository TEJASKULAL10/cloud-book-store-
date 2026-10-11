import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { friendlyError } from "../services/errorMessages";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) return setError("Please enter your email and password.");

    setBusy(true);
    try {
      await loginUser(email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(friendlyError(err));
    }
    setBusy(false);
  }

  return (
    <div className="form-page">
      <form className="card form" onSubmit={handleSubmit} noValidate>
        <h2>Login</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn" disabled={busy}>
          {busy ? "Logging in..." : "Login"}
        </button>
        <Link className="btn btn-light center-btn" to="/register">
          Register
        </Link>
      </form>
    </div>
  );
}
