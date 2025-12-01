
import Event from "../../models/Event.js";

// Controller to allow a user to join (register for) an event
const joinEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.body;
        if (!eventId || !userId) {
            return res.status(400).json({ message: "Event ID and User ID are required." });
        }
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }
        if (event.registrations.map(id => id.toString()).includes(userId.toString())) {
            return res.status(400).json({ message: "User already registered for the event." });
        }
        event.registrations.push(userId);
        await event.save();
        res.status(200).json({ message: "User registered for the event successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to register for event.", error: error.message });
    }
};

export default joinEvent;