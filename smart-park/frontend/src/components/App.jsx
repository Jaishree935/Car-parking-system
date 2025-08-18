// src/components/App.jsx
import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "../styles/App.css";
import Login from "../components/login.jsx";
import Register from "../components/register.jsx";

function HomeHero() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="overlay">
        <h1 className="title">Smart Way to Find a Parking Spot</h1>
        <p className="subtitle">Save Time, Park Smarter</p>
        <p className="subtitle">Your Space, Just a Click Away</p>

        <div className="buttons">
          <button
            className="btn user-btn"
            onClick={() => navigate("/login?role=user")}
          >
            User
          </button>
          <button
            className="btn admin-btn"
            onClick={() => navigate("/login?role=admin")}
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeHero />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
