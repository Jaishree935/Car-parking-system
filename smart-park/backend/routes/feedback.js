const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST feedback
router.post("/", async (req, res) => {
  try {
    console.log("Incoming data:", req.body); // debug log

    const { name, phone, feedback } = req.body;
    const newFeedback = new Feedback({ name, phone, feedback });
    await newFeedback.save();

    res.status(201).json({ message: "Feedback saved" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
