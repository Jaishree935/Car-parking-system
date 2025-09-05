import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";

// ---------------- Header ----------------
function Header({ openAbout, openContact }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return console.error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

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
          <li>
            <button onClick={() => window.location.reload()}>Home</button>
          </li>
          <li>
            <button onClick={openAbout}>About Us</button>
          </li>
          <li>
            <a href="#explore">Explore</a>
          </li>
          <li>
            <button onClick={openContact}>Contact Us</button>
          </li>
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
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                {user.vehicleNumber && (
                  <p>
                    <strong>Vehicle:</strong> {user.vehicleNumber}
                  </p>
                )}
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
      <p>
        © {new Date().getFullYear()} Smart Parking System | All Rights Reserved
      </p>
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
          <button className="btn" onClick={openBooking}>
            Book Now
          </button>
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
        <h2 className="popup-heading">{title}</h2>
        {children}
        <div style={{ marginTop: "16px" }}>
          <button onClick={closePopup} className="btn-close">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- User Dashboard ----------------
function UserDashboard() {
  const [areaOpen, setAreaOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [spotOpen, setSpotOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false); // Contact Us popup

  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [bookedSpots, setBookedSpots] = useState([]);

  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    carNumber: "",
    date: "",
    time: "",
  });

  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    feedback: "",
  });

  const resetBookingForm = () => {
    setBookingData({ name: "", phone: "", carNumber: "", date: "", time: "" });
    setSelectedSpot(null);
  };

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleFeedbackChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingOpen(false);
    setSpotOpen(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings?date=${bookingData.date}&time=${bookingData.time}`
      );
      const data = await res.json();
      if (res.ok) {
        setBookedSpots(data.bookedSpots || []);
      }
    } catch (err) {
      console.error("Error fetching booked spots:", err);
    }
  };

  const handleSpotSelect = (spot) => {
    if (bookedSpots.includes(spot)) {
      alert(`❌ Spot ${spot} is already booked!`);
      return;
    }
    setSelectedSpot(spot);
  };

  const handleConfirmSpot = () => {
    if (!selectedSpot) return alert("Select a spot first!");
    setSpotOpen(false);
    setPaymentOpen(true);
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ Please login first");
        return;
      }

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...bookingData,
          spot: selectedSpot,
          area: selectedArea,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("❌ Booking failed: " + data.message);
        return;
      }

      alert(`✅ Payment successful! Spot ${selectedSpot} booked at ${selectedArea}`);
      setPaymentOpen(false);
      resetBookingForm();
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Something went wrong");
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("❌ Feedback failed: " + data.message);
        return;
      }

      alert("✅ Feedback submitted successfully!");
      setFeedbackData({ name: "", email: "", feedback: "" });
      setContactOpen(false);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("❌ Something went wrong!");
    }
  };

  return (
    <div className="dashboard">
      <Header openContact={() => setContactOpen(true)} />
      <main className="main-content">
        <h2 className="dashboard-title">Honk Less, Park More</h2>
        <Explore openBooking={() => setAreaOpen(true)} />
      </main>
      <Footer />

      {/* ---------------- Contact Us Popup ---------------- */}
      {contactOpen && (
        <Popup title="Contact Us" closePopup={() => setContactOpen(false)}>
          <form className="contact-form" onSubmit={handleFeedbackSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={feedbackData.name}
                onChange={handleFeedbackChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={feedbackData.email}
                onChange={handleFeedbackChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Feedback:</label>
              <textarea
                name="feedback"
                value={feedbackData.feedback}
                onChange={handleFeedbackChange}
                required
              ></textarea>
            </div>
            <div className="contact-form-buttons">
              <button type="submit" className="btn">
                Submit
              </button>
            </div>
          </form>d
        </Popup>
      )}

      {/* ---------------- Area Selection Popup ---------------- */}
      {areaOpen && (
        <Popup title="Choose Parking Area" closePopup={() => setAreaOpen(false)}>
          <div className="area-popup-content">
            <div className="area-grid">
              {[
                { name: "Chennai - International Airport", img: "/src/assets/chennai.png" },
                { name: "Kochin - LULU Mall", img: "/src/assets/kochi.png" },
                { name: "Bangalore - VR Bengaluru", img: "/src/assets/bangalore.png" },
              ].map((area) => (
                <div
                  key={area.name}
                  className={`area-card ${selectedArea === area.name ? "selected" : ""}`}
                  onClick={() => setSelectedArea(area.name)}
                >
                  <img src={area.img} alt={area.name} className="area-img" />
                  <h3>{area.name}</h3>
                </div>
              ))}
            </div>

            <div className="popup-buttons">
              {selectedArea && (
                <button
                  onClick={() => {
                    setAreaOpen(false);
                    setBookingOpen(true);
                  }}
                  className="btn"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </Popup>
      )}

      {/* ---------------- Booking Form Popup ---------------- */}
      {bookingOpen && (
        <Popup
          title={`Book at ${selectedArea}`}
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
            <button type="submit" className="btn">
              Select Spot
            </button>
          </form>
        </Popup>
      )}

      {/* ---------------- Spot Selection Popup ---------------- */}
      {spotOpen && (
        <Popup
          title="Select Your Parking Spot"
          closePopup={() => {
            setSpotOpen(false);
            resetBookingForm();
          }}
        >
          <div className="spot-grid">
            {Array.from({ length: 20 }, (_, i) => `S${i + 1}`).map((spot) => {
              const isBooked = bookedSpots.includes(spot);
              const isSelected = selectedSpot === spot;

              return (
                <div
                  key={spot}
                  className={`parking-spot ${isBooked ? "booked" : ""} ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => !isBooked && handleSpotSelect(spot)}
                >
                  {isBooked ? `❌ ${spot} (Booked)` : `🚗 ${spot}`}
                </div>
              );
            })}
          </div>
          {selectedSpot && !bookedSpots.includes(selectedSpot) && (
            <button onClick={handleConfirmSpot} className="btn">
              Confirm {selectedSpot}
            </button>
          )}
        </Popup>
      )}

      {/* ---------------- Payment Popup ---------------- */}
      {paymentOpen && (
        <Popup title="Payment" closePopup={() => setPaymentOpen(false)}>
          <p>
            Amount: <strong>₹50</strong>
          </p>
          <button onClick={handlePayment} className="btn">
            Pay & Confirm
          </button>
        </Popup>
      )}
    </div>
  );
}

export default UserDashboard;
