import Event from "../../models/Event.js";

// Controller to get events of a specific club by club ID
const getEventsOfClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!clubId) {
      return res.status(400).json({
        status: "error",
        message: "Club ID is required",
      });
    }

    const events = await Event.find({ club: clubId })
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
      message: "Error fetching events for the club",
      error: error.message,
    });
  }
};

export default getEventsOfClub;
