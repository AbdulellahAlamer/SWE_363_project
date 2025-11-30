import Event from "../../models/Event.js";
import User from "../../models/user.js";
import { sendEmail } from "../../utils/sendingEmail.js";
import eventNotificationEmailTemplate from "../../utils/eventNotificationEmailTemplate.js";

// Controller to notify all participants of an event by email
const notifyByEmail = async (req, res) => {
	try {
		const { eventId } = req.params;
		if (!eventId) {
			return res.status(400).json({ message: "Event ID is required." });
		}
		// Find the event and populate registrations
		const event = await Event.findById(eventId).populate("registrations");
		if (!event) {
			return res.status(404).json({ message: "Event not found." });
		}
		const participants = event.registrations;
		if (!participants || participants.length === 0) {
			return res.status(200).json({ message: "No participants to notify." });
		}

		// Prepare email details
		const subject = `Update for event: ${event.title}`;
		const sendResults = [];
		for (const user of participants) {
			if (!user.email) continue;
			const html = eventNotificationEmailTemplate({
				name: user.name || user.username || user.email,
				eventName: event.title,
				eventDate: event.date,
				location: event.location || "TBA",
				description: event.description,
				actionUrl: req.body.actionUrl || undefined,
			});
			try {
				await sendEmail({
					to: user.email,
					subject,
					html,
				});
				sendResults.push({ email: user.email, status: "sent" });
			} catch (err) {
				sendResults.push({ email: user.email, status: "failed", error: err.message });
			}
		}
		res.status(200).json({ message: "Notification emails sent.", results: sendResults });
	} catch (error) {
		res.status(500).json({ message: "Failed to send notifications.", error: error.message });
	}
};

export default notifyByEmail;
