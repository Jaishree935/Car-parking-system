import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";

// ---------------- Header ----------------
function Header({ openAbout, openContact }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch logged-in user from backend using token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch user");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      <h1
        onClick={() => window.location.reload()}
        className="logo"
        style={{ cursor: "pointer" }}
      >
        🚗 Smart Parking
      </h1>

      <nav className="nav-center">
        <ul className="nav-links">
          <li><button onClick={() => window.location.reload()}>Home</button></li>
          <li><button onClick={openAbout}>About Us</button></li>
          <li><a href="#explore">Explore</a></li>
          <li><button onClick={openContact}>Contact Us</button></li>
        </ul>
      </nav>

      <div className="profile-container">
        <button
          className="profile-btn"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          👤
        </button>
        {profileOpen && (
          <div className="profile-dropdown">
            {user ? (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <button onClick={handleLogout} className="btn logout-btn">
                  🚪 Logout
                </button>
              </>
            ) : (
              <p>Loading user...</p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

// ---------------- Footer ----------------
function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Smart Parking System | All Rights Reserved</p>
    </footer>
  );
}

// ---------------- Explore Section ----------------
function Explore({ openBooking }) {
  return (
    <section id="explore" className="explore">
      <div className="card-container">
        <div className="card">
          <h3>Book a Spot</h3>
          <p>Easily book your parking spot online.</p>
          <button className="btn" onClick={openBooking}>Book Now</button>
        </div>
        <div className="card">
          <h3>My Bookings</h3>
          <p>Check and manage your existing bookings.</p>
          <button className="btn">View</button>
        </div>
      </div>
    </section>
  );
}

// ---------------- Popup ----------------
function Popup({ title, children, closePopup }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>{title}</h2>
        {children}
        <button onClick={closePopup} className="btn-close">Close</button>
      </div>
    </div>
  );
}

// ---------------- User Dashboard ----------------
function UserDashboard() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [spotOpen, setSpotOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);

  // Booking form state
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    carNumber: "",
    date: "",
    time: "",
  });

  // Contact form state
  const [contactData, setContactData] = useState({
    name: "",
    phone: "",
    feedback: "",
  });

  // Reset functions
  const resetBookingForm = () => {
    setBookingData({ name: "", phone: "", carNumber: "", date: "", time: "" });
    setSelectedSpot(null);
  };

  const resetContactForm = () => {
    setContactData({ name: "", phone: "", feedback: "" });
  };

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingOpen(false);
    setSpotOpen(true);
  };

  const handleSpotSelect = (spot) => {
    setSelectedSpot(spot);
  };

  const handleConfirmSpot = () => {
    alert(`✅ Booking confirmed for Spot ${selectedSpot}`);
    setSpotOpen(false);
    resetBookingForm();
  };

  return (
    <div className="dashboard">
      <Header
        openAbout={() => setAboutOpen(true)}
        openContact={() => setContactOpen(true)}
      />

      <main className="main-content">
        <h2 className="dashboard-title">Honk Less, Park More</h2>
        <Explore openBooking={() => setBookingOpen(true)} />
      </main>

      <Footer />

      {/* About Popup */}
      {aboutOpen && (
        <Popup title="About Us" closePopup={() => setAboutOpen(false)}>
          <p>
            Smart Parking System helps users easily find, book, and manage
            parking spots efficiently.
          </p>
        </Popup>
      )}

      {/* Contact Popup */}
      {contactOpen && (
        <Popup
          title="Contact Us"
          closePopup={() => {
            setContactOpen(false);
            resetContactForm();
          }}
        >
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("✅ Feedback submitted successfully!");
              setContactOpen(false);
              resetContactForm();
            }}
          >
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={contactData.name}
                onChange={(e) =>
                  setContactData({ ...contactData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={contactData.phone}
                onChange={(e) =>
                  setContactData({ ...contactData, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Feedback:</label>
              <textarea
                name="feedback"
                value={contactData.feedback}
                onChange={(e) =>
                  setContactData({ ...contactData, feedback: e.target.value })
                }
                required
              />
            </div>
            <div className="contact-form-buttons">
              <button type="submit" className="btn">Submit</button>
            </div>
          </form>
        </Popup>
      )}

      {/* Booking Form Popup */}
      {bookingOpen && (
        <Popup
          title="Book a Parking Spot"
          closePopup={() => {
            setBookingOpen(false);
            resetBookingForm();
          }}
        >
          <form className="booking-form" onSubmit={handleBookingSubmit}>
            <div className="form-group">
              <label>User Name:</label>
              <input
                type="text"
                name="name"
                value={bookingData.name}
                onChange={handleBookingChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phone"
                value={bookingData.phone}
                onChange={handleBookingChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Car Number:</label>
              <input
                type="text"
                name="carNumber"
                value={bookingData.carNumber}
                onChange={handleBookingChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group half">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleBookingChange}
                  required
                />
              </div>
              <div className="form-group half">
                <label>Time:</label>
                <input
                  type="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleBookingChange}
                  required
                />
              </div>
            </div>
            <div className="contact-form-buttons">
              <button type="submit" className="btn">Select Spot</button>
            </div>
          </form>
        </Popup>
      )}

      {/* Spot Selection Popup */}
      {spotOpen && (
        <Popup
          title="Select Your Parking Spot"
          closePopup={() => {
            setSpotOpen(false);
            resetBookingForm();
          }}
        >
          <div className="spot-grid">
            {Array.from({ length: 20 }, (_, i) => `S${i + 1}`).map((spot) => (
              <div
                key={spot}
                className={`parking-spot ${selectedSpot === spot ? "selected" : ""}`}
                onClick={() => handleSpotSelect(spot)}
              >
                🚗 {spot}
              </div>
            ))}
          </div>
          {selectedSpot && (
            <div className="confirm-container">
              <button onClick={handleConfirmSpot} className="btn">
                Confirm {selectedSpot}
              </button>
            </div>
          )}
        </Popup>
      )}
    </div>
  );
}

export default UserDashboard;
