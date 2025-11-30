import Event from "../../models/Event.js";
import User from "../../models/user.js";

// Controller to allow a user to leave (unregister from) an event
const leaveEvent = async (req, res) => {
	try {
		const { eventId } = req.params;
		// You may get userId from req.user (if using auth middleware) or from body/params
		const userId = req.user?._id || req.body.userId || req.params.userId;
		if (!eventId || !userId) {
			return res.status(400).json({ message: "Event ID and User ID are required." });
		}

		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ message: "Event not found." });
		}

		// Remove user from registrations array
		const initialCount = event.registrations.length;
		event.registrations = event.registrations.filter(
			(regId) => regId.toString() !== userId.toString()
		);
		if (event.registrations.length === initialCount) {
			return res.status(400).json({ message: "User was not registered for this event." });
		}
		await event.save();
		res.status(200).json({ message: "Successfully left the event." });
	} catch (error) {
		res.status(500).json({ message: "Failed to leave event.", error: error.message });
	}
};

export default leaveEvent;
