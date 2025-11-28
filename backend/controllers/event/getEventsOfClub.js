// this file is for retrieving events of a specific club
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Club = require("../models/Club");

// Get events of a specific club by club ID
router.get("/:clubId", async (req, res) => {
  try {
    const { clubId } = req.params;
    const events = await Event.find({ club: clubId })
      .populate("club", "name")
      .populate("registrations", "name email")
      .sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events for the club", error: error.message });
  }
});

module.exports = router;