import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import parkingBg from '../../assets/parking-bg.JPG';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("parking_users") || "[]");
    const user = users.find(u => u.email === email);
    if (!user) {
      setErr("No account with this email.");
      return;
    }
    // demo plain check (for production use hashed passwords & backend)
    if (user.password !== password) {
      setErr("Incorrect password.");
      return;
    }
    // store session
    localStorage.setItem("parking_user", JSON.stringify({ email: user.email, name: user.name }));
    nav("/dashboard");
  };

  return (
    <div className="auth-page" style={{ backgroundImage: `url(${parkingBg})` }}>
      <div className="bg-overlay" />
      <div className="auth-card">
        <h2 className="logo">ParkSecure</h2>
        <p className="sub">Smart parking — access your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {err && <div className="error">{err}</div>}

          <label>
            Email
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </label>

          <button type="submit" className="btn primary">Login</button>
        </form>

        <div className="auth-foot">
          <span>New here?</span>
          <Link to="/register" className="link">Create account</Link>
        </div>
      </div>
    </div>
  );
}
