import Event from "../../models/Event.js";

export default async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        status: "error", 
        message: "Event not found" 
      });
    }

    // Check if user is already registered for the event
    if (!event.registrations.includes(userId)) {
      return res.status(400).json({ 
        status: "error", 
        message: "You must be registered for this event to mark attendance" 
      });
    }

    // Check if user already marked attendance
    if (event.attendees && event.attendees.includes(userId)) {
      return res.status(400).json({ 
        status: "error", 
        message: "Attendance already marked for this event" 
      });
    }

    // Initialize attendees array if it doesn't exist
    if (!event.attendees) {
      event.attendees = [];
    }

    // Mark attendance
    event.attendees.push(userId);
    await event.save();

    res.json({ 
      status: "success", 
      message: "Attendance marked successfully",
      data: {
        eventId: event._id,
        eventTitle: event.title,
        attendanceCount: event.attendees.length
      }
    });
  } catch (err) {
    res.status(500).json({ 
      status: "error", 
      message: err.message 
    });
  }
};