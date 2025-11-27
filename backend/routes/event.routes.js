const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");
const Event = require("../models/Event");
const User = require("../models/user");
const Club = require("../models/Club");

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

// Get single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("club", "name description")
      .populate("registrations", "name email");
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
});

// Create new event (protected route)
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, description, date, type, imageURL, club } = req.body;
    
    // Validate required fields
    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }
    
    // Verify club exists if provided
    if (club) {
      const clubExists = await Club.findById(club);
      if (!clubExists) {
        return res.status(404).json({ message: "Club not found" });
      }
    }
    
    const newEvent = new Event({
      title,
      description,
      date,
      type,
      imageURL,
      club,
    });
    
    await newEvent.save();
    
    const populatedEvent = await Event.findById(newEvent._id).populate("club", "name");
    
    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
});

// Update event (protected route)
router.put("/:id", protectRoute, async (req, res) => {
  try {
    const { title, description, date, type, imageURL, club } = req.body;
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Verify club exists if being updated
    if (club && club !== event.club?.toString()) {
      const clubExists = await Club.findById(club);
      if (!clubExists) {
        return res.status(404).json({ message: "Club not found" });
      }
    }
    
    // Update fields
    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (date) event.date = date;
    if (type) event.type = type;
    if (imageURL !== undefined) event.imageURL = imageURL;
    if (club) event.club = club;
    
    await event.save();
    
    const updatedEvent = await Event.findById(event._id)
      .populate("club", "name")
      .populate("registrations", "name email");
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
});

// Delete event (protected route)
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
});

// Register user for event (protected route)
router.post("/:id/register", protectRoute, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    const userId = req.user._id;
    
    // Check if user is already registered
    if (event.registrations.includes(userId)) {
      return res.status(400).json({ message: "Already registered for this event" });
    }
    
    event.registrations.push(userId);
    await event.save();
    
    const updatedEvent = await Event.findById(event._id)
      .populate("club", "name")
      .populate("registrations", "name email");
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error registering for event", error: error.message });
  }
});

// Unregister user from event (protected route)
router.post("/:id/unregister", protectRoute, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    const userId = req.user._id;
    
    // Check if user is registered
    if (!event.registrations.includes(userId)) {
      return res.status(400).json({ message: "Not registered for this event" });
    }
    
    event.registrations = event.registrations.filter(
      (id) => id.toString() !== userId.toString()
    );
    await event.save();
    
    const updatedEvent = await Event.findById(event._id)
      .populate("club", "name")
      .populate("registrations", "name email");
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error unregistering from event", error: error.message });
  }
});

// Get events by club
router.get("/club/:clubId", async (req, res) => {
  try {
    const events = await Event.find({ club: req.params.clubId })
      .populate("club", "name")
      .populate("registrations", "name email")
      .sort({ date: 1 });
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching club events", error: error.message });
  }
});

// Get upcoming events
router.get("/filter/upcoming", async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ date: { $gte: now } })
      .populate("club", "name")
      .populate("registrations", "name email")
      .sort({ date: 1 });
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming events", error: error.message });
  }
});

// Get past events
router.get("/filter/past", async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ date: { $lt: now } })
      .populate("club", "name")
      .populate("registrations", "name email")
      .sort({ date: -1 });
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching past events", error: error.message });
  }
});

// Get events by type
router.get("/filter/type/:type", async (req, res) => {
  try {
    const events = await Event.find({ type: req.params.type })
      .populate("club", "name")
      .populate("registrations", "name email")
      .sort({ date: 1 });
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events by type", error: error.message });
  }
});

module.exports = router;
