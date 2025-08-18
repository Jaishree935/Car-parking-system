require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

// CORS: allow your frontend dev origin. Adjust if your Vite uses a different port.
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => { console.error("MongoDB error:", err); process.exit(1); });

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Smart Parking API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
