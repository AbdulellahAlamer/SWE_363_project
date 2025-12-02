
import Event from "../../models/Event.js";

// Controller to get all events (optionally filtered by club via query)
const getAllEvents = async (req, res) => {
  try {
    const clubId = req.query.club || req.query.clubId || req.query.club_id;
    const userId = req.query.user || req.query.userId || req.query.user_id;
    const filter = {};

    if (clubId) {
      filter.club = clubId;
    }
    if (userId) {
      filter.registrations = userId;
    }

    const events = await Event.find(filter)
      .populate("club", "name")
      .populate("registrations", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      status: "success",
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching events",
      error: error.message,
    });
  }
};

export default getAllEvents;
