import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("parking_users") || "[]");
    if (users.some(u => u.email === email)) {
      setErr("Email already registered.");
      return;
    }

    // Save user (demo). In real: call backend and store hashed password.
    users.push({ name, email, password });
    localStorage.setItem("parking_users", JSON.stringify(users));
    setSuccess("Account created. Redirecting to login...");
    setTimeout(() => nav("/login"), 1300);
  };

  return (
    <div className="auth-page">
      <div className="bg-overlay" />
      <div className="auth-card">
        <h2 className="logo">ParkSecure</h2>
        <p className="sub">Create your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {err && <div className="error">{err}</div>}
          {success && <div className="success">{success}</div>}

          <label>
            Full name
            <input value={name} onChange={e=>setName(e.target.value)} required />
          </label>

          <label>
            Email
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </label>

          <label>
            Confirm Password
            <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
          </label>

          <button className="btn primary" type="submit">Register</button>
        </form>

        <div className="auth-foot">
          <span>Already have an account?</span>
          <Link to="/login" className="link">Login</Link>
        </div>
      </div>
    </div>
  );
}
