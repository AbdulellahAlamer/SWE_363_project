// imports
import express from "express";
import Event from "../../models/Event.js";
import User from "../../models/user.js";
import Club from "../../models/Club.js";

const router = express.Router();


// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("club", "name")
      .populate("registrations", "name email")
      .sort({ date: 1 });
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});
