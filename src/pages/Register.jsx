import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { friendlyError } from "../services/errorMessages";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirm) {
      return setError("Please fill in all fields.");
    }
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setBusy(true);
    try {
      await registerUser(form.name.trim(), form.email.trim(), form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(friendlyError(err));
    }
    setBusy(false);
  }

  return (
    <div className="form-page">
      <form className="card form" onSubmit={handleSubmit} noValidate>
        <h2>Create Account</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} />

        <label>Confirm Password</label>
        <input type="password" name="confirm" value={form.confirm} onChange={handleChange} />

        <button className="btn" disabled={busy}>
          {busy ? "Creating account..." : "Create Account"}
        </button>
        <p className="muted center-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
