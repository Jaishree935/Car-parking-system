// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import bannerImg from "../../assets/banner.jpg";
import { useNavigate } from "react-router-dom";

// ---------------- Header ----------------
function Header({ admin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">
      <h1
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={() => window.location.reload()}
      >
        🛠️ Admin Panel
      </h1>

      <nav className="nav-center">
        <ul className="nav-links">
          <li>
            <button onClick={() => window.location.reload()}>Dashboard</button>
          </li>
          <li>
            <a href="#manage">Manage</a>
          </li>
          <li>
            <a href="#reports">Reports</a>
          </li>
        </ul>
      </nav>

      <div className="profile-container">
        <button className="profile-btn">👨‍💼</button>
        <div className="profile-dropdown">
          <p>
            <strong>Role:</strong> {admin?.role || "Loading..."}
          </p>
          <p>
            <strong>Email:</strong> {admin?.email || "Loading..."}
          </p>
          <button
            className="btn"
            onClick={handleLogout}
            style={{ marginTop: "10px", backgroundColor: "#d63031" }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Smart Parking | Admin Panel</p>
    </footer>
  );
}

function Popup({ title, children, closePopup }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>{title}</h2>
        {children}
        <button onClick={closePopup} className="btn-close">
          Close
        </button>
      </div>
    </div>
  );
}

// ---------------- Admin Cards ----------------
function AdminCards({ actions }) {
  const navigate = useNavigate();

  const cards = [
    { title: "Manage Users", action: actions.openUsers },
    { title: "Manage Bookings", action: actions.openBookings },
    { title: "Parking Spots", action: () => navigate("/live-feed") }, // 🚀 Separate Page
    { title: "Book Slot", action: actions.openBookSlot },
  ];

  return (
    <section id="manage" className="explore">
      <div className="card-container">
        {cards.map((card) => (
          <div
            key={card.title}
            className="card"
            onClick={card.action}
            style={{ cursor: "pointer" }}
          >
            <h3>{card.title}</h3>
            <p>
              {card.title === "Book Slot"
                ? "Manually book a slot"
                : `Open ${card.title}`}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SlotMonitor({ slots }) {
  return (
    <section id="slots" className="slot-monitor">
      <div className="slot-grid">
        {slots.map((slot) => (
          <div key={slot.id} className={`slot ${slot.status}`}>
            <span className={`status-dot ${slot.status}`}></span>
            {slot.id} - {slot.status}
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [popup, setPopup] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookSlotOpen, setBookSlotOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAdmin(data.user))
      .catch((err) => console.error("Profile fetch error:", err));
  }, []);

  useEffect(() => {
    const fetchSlots = () => {
      fetch("http://localhost:5000/api/slots")
        .then((res) => res.json())
        .then((data) => setSlots(data))
        .catch((err) => console.error("Slot fetch error:", err));
    };
    fetchSlots();
    const intervalId = setInterval(fetchSlots, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const openPopup = (name) => setPopup(name);
  const closePopup = () => setPopup(null);
  const openBookSlotPopup = () => setBookSlotOpen(true);

  const handleSlotBooking = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData);

    fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Slot booked successfully!");
        setBookSlotOpen(false);
        setSelectedSlot(null);
      })
      .catch((err) => console.error("Booking error:", err));
  };

  return (
    <div className="dashboard">
      <Header admin={admin} />

      <section className="dashboard-banner">
        <img src={bannerImg} alt="Admin Banner" />
        <div className="banner-text">
          <h1>Welcome, Admin!</h1>
          <p>Manage Users, Bookings & Parking Effortlessly 🚗</p>
        </div>
      </section>

      <main className="main-content">
        <AdminCards
          actions={{
            openUsers: () => openPopup("Manage Users"),
            openBookings: () => openPopup("Manage Bookings"),
            openBookSlot: openBookSlotPopup,
          }}
        />

        <SlotMonitor slots={slots} />
      </main>

      <Footer />

      {popup && (
        <Popup title={popup} closePopup={closePopup}>
          {popup === "Manage Users" && (
            <p>Here admin can view and manage users (CRUD operations).</p>
          )}
          {popup === "Manage Bookings" && (
            <p>Here admin can approve, reject or cancel bookings.</p>
          )}
        </Popup>
      )}

      {bookSlotOpen && (
        <Popup
          title="Book Parking Slot"
          closePopup={() => setBookSlotOpen(false)}
        >
          <h3>Select Your Parking Spot</h3>
          <div className="slot-grid booking-grid">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`slot-box ${
                  slot.status === "occupied" ? "disabled" : ""
                } ${selectedSlot === slot.id ? "selected" : ""}`}
                onClick={() =>
                  slot.status === "free" && setSelectedSlot(slot.id)
                }
              >
                🚗 {slot.id}
              </div>
            ))}
          </div>

          <form className="book-slot-form" onSubmit={handleSlotBooking}>
            <div>
              <label>Name:</label>
              <input type="text" name="name" required />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" name="email" required />
            </div>
            <div>
              <label>Contact:</label>
              <input type="text" name="contact" required />
            </div>
            <div>
              <label>Chosen Slot:</label>
              <input
                type="text"
                name="slotId"
                value={selectedSlot || ""}
                readOnly
                required
              />
            </div>
            <div>
              <label>Payment Amount:</label>
              <input type="number" name="payment" required />
            </div>
            <button type="submit" className="btn" disabled={!selectedSlot}>
              Book Slot
            </button>
          </form>
        </Popup>
      )}
    </div>
  );
}

export default AdminDashboard;
