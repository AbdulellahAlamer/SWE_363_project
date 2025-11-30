import Event from "../../models/Event";
// Controller to delete an event by its ID
 export const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required." });
        }
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete event.", error: error.message });
    }
};

export default deleteEvent;