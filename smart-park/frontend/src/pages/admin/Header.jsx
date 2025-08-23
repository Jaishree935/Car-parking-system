 import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-lg font-bold">Smart Parking</h1>
      <nav className="space-x-4">
        <Link to="/dashboard/user">Dashboard</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}

export default Header;
