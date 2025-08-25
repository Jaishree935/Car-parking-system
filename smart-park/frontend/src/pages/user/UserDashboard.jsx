import React, { useState } from "react";
import "./UserDashboard.css"; // Import CSS

// ---------------- Header ----------------
function Header({ openAbout, openContact }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="header">
      {/* Logo */}
      <h1
        onClick={() => window.location.reload()} // 🔄 same page refresh
        className="logo"
        style={{ cursor: "pointer" }}
      >
        🚗 Smart Parking
      </h1>

      {/* Navigation (Center) */}
      <nav className="nav-center">
        <ul className="nav-links">
          <li>
            <button onClick={() => window.location.reload()}>Home</button>
          </li>
          <li><button onClick={openAbout}>About Us</button></li>
          <li><a href="#explore">Explore</a></li>
          <li><button onClick={openContact}>Contact Us</button></li>
        </ul>
      </nav>

      {/* Profile (Right) */}
      <div className="profile-container">
        <button
          className="profile-btn"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          👤
        </button>
        {profileOpen && (
          <div className="profile-dropdown">
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> john@example.com</p>
            <p><strong>Phone:</strong> +91 9876543210</p>
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
function Explore() {
  return (
    <section id="explore" className="explore">
      <h2>🚀 Explore</h2>
      <div className="card-container">
        <div className="card">
          <h3>Book a Spot</h3>
          <p>Easily book your parking spot online.</p>
          <button className="btn">Book Now</button>
        </div>
        <div className="card">
          <h3>My Bookings</h3>
          <p>Check and manage your existing bookings.</p>
          <button className="btn">View</button>
        </div>
        <div className="card">
          <h3>Parking History</h3>
          <p>View your past parking activities.</p>
          <button className="btn">History</button>
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
        <button onClick={closePopup} className="btn-close">
          Close
        </button>
      </div>
    </div>
  );
}

// ---------------- User Dashboard ----------------
function UserDashboard() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Feedback form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    feedback: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Feedback submitted successfully!");
        setFormData({ name: "", phone: "", feedback: "" }); // reset form
        setContactOpen(false); // close popup
      } else {
        alert("❌ Error: " + (data.error || "Failed to submit"));
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("⚠️ Server not responding. Check backend.");
    }
  };

  return (
    <div className="dashboard">
      <Header
        openAbout={() => setAboutOpen(true)}
        openContact={() => setContactOpen(true)}
      />

      <main className="main-content">
        <h2 className="dashboard-title">✨ Your Smart Parking Dashboard</h2>
        <Explore />
      </main>

      <Footer />

      {/* About Popup */}
      {aboutOpen && (
        <Popup
          title="About Us"
          closePopup={() => setAboutOpen(false)}
        >
          <p>
            Smart Parking System helps users easily find, book, and manage
            parking spots efficiently.
          </p>
        </Popup>
      )}

      {/* Contact Popup with Feedback Form */}
      {contactOpen && (
        <Popup
          title="Contact Us"
          closePopup={() => setContactOpen(false)}
        >
          <form className="contact-form" onSubmit={handleFeedbackSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="form-group">
              <label>Feedback:</label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Write your feedback..."
                required
              />
            </div>
            <div className="contact-form-buttons">
              <button type="submit" className="btn">
                Submit
              </button>
            </div>
          </form>
        </Popup>
      )}
    </div>
  );
}

export default UserDashboard;
