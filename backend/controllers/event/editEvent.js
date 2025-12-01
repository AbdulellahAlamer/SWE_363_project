import Event from "../../models/Event";

const editEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required." });
        }
        const updateData = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "Failed to update event.", error: error.message });
    }
};

export default editEvent;