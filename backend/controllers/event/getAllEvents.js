
import Event from "../../models/Event.js";

// Controller to get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("club", "name")
      .populate("registrations", "name email")
      .sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

export default getAllEvents;
