import Event from "../../models/Event.js";

// Controller to get events of a specific club by club ID
const getEventsOfClub = async (req, res) => {
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
};

export default getEventsOfClub;