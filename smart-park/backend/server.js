require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

// Routes
const authRoutes = require("./routes/auth");
const feedbackRoutes = require("./routes/feedback"); // 👈 added

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

// CORS: allow your frontend dev origin (Vite runs at 5173 by default)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes); // 👈 added

// Test route
app.get("/", (req, res) => res.send("Smart Parking API is running 🚀"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
