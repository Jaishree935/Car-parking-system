 // src/components/App.jsx
import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "../styles/App.css";
import Login from "./login.jsx";
import Register from "./register.jsx";
import UserDashboard from "../pages/user/UserDashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import Header from "../pages/user/Header.jsx";
import Footer from "../pages/user/Footer.jsx";

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
      {/* Landing Page */}
      <Route path="/" element={<HomeHero />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Dashboard */}
      <Route
        path="/dashboard/user"
        element={
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-4">
              <UserDashboard />
            </main>
            <Footer />
          </div>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/dashboard/admin"
        element={
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-4">
              <AdminDashboard />
            </main> 
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
