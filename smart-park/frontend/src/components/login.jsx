// src/pages/login.jsx
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = useMemo(
    () => new URLSearchParams(location.search).get("role") || "user",
    [location.search]
  );

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});

  const brand = role === "admin" ? "Admin" : "User";

  function validate() {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    // Simulate auth flow
    console.log(`[LOGIN] role=${role}`, form);
    // You can branch route by role after login:
    if (role === "admin") {
      navigate("/dashboard/admin");
    } else {
      navigate("/dashboard/user");
    }
  }

  return (
    <div className="auth-wrap login-bg">
        
      <div className="auth-card">
        <div className="auth-head">
          <h2>{brand} Login</h2>
          <p>Welcome back! Let’s get you parked faster.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className={`field ${errors.email ? "has-error" : ""}`}>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoFocus
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className={`field ${errors.password ? "has-error" : ""}`}>
            <label>Password</label>
            <div className="password-row">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="ghost"
                onClick={() => setShowPwd((s) => !s)}
                aria-label="toggle password visibility"
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="row-between">
            <label className="remember">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) =>
                  setForm({ ...form, remember: e.target.checked })
                }
              />
              Remember me
            </label>
            <a className="link" href="#" onClick={(e)=>e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          <button className={`cta ${role === "admin" ? "admin" : "user"}`} type="submit">
            Sign in
          </button>

          <div className="divider"><span>or</span></div>

          <button
            type="button"
            className="outline"
            onClick={() => alert("Google OAuth placeholder")}
          >
            Continue with Google
          </button>
        </form>

        <div className="auth-foot">
          <p>
            New {brand}?{" "}
            <Link to={`/register?role=${role}`} className="link">
              Create an account
            </Link>
          </p>
          <p className="muted">
            Not {brand}?{" "}
            <button
              className="link ghost"
              onClick={() =>
                navigate(`/login?role=${role === "admin" ? "user" : "admin"}`)
              }
            >
              Switch to {role === "admin" ? "User" : "Admin"} login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
