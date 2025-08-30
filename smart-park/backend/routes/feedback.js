const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, feedback } = req.body;

    // save directly with email
    const newFeedback = new Feedback({ name, email, feedback });
    await newFeedback.save();

    res.status(201).json({ message: "Feedback saved" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
