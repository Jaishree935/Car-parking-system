import React from "react";
import "./App.css";

function App() {
  return (
    <div className="hero">
      <div className="overlay">
        <h1 className="title">Smart Way to Find a Parking Spot</h1>
        <p className="subtitle">Save Time, Park Smarter</p>
        <p className="subtitle">Your Space, Just a Click Away</p>

        <div className="buttons">
          <button className="btn user-btn">User Login</button>
          <button className="btn admin-btn">Admin Login</button>
        </div>
      </div>
    </div>
  );
}

export default App;
