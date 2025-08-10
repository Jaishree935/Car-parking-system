import React from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function Dashboard() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("parking_user") || "{}");

  const logout = () => {
    localStorage.removeItem("parking_user");
    nav("/login");
  };

  return (
    <div style={{padding:40}}>
      <h1>Welcome, {user.name || user.email}</h1>
      <p>This is a demo dashboard. Integrate with your backend to show bookings, slots, etc.</p>
      <button onClick={logout} className="btn">Logout</button>
    </div>
  );
}
