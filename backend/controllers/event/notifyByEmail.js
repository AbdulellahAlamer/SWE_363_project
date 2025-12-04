import Event from "../../models/Event.js";
import User from "../../models/user.js";
import { sendEmail } from "../../utils/sendingEmail.js";
import eventNotificationEmailTemplate from "../../utils/eventNotificationEmailTemplate.js";

// Controller to notify all participants of an event by email
const notifyByEmail = async (req, res) => {
	try {
		const { eventId } = req.params;
		console.log("[DEBUG] notifyByEmail called for eventId:", eventId);
		
		if (!eventId) {
			return res.status(400).json({ message: "Event ID is required." });
		}
		
		// Find the event and populate registrations
		const event = await Event.findById(eventId).populate("registrations");
		if (!event) {
			console.log("[DEBUG] Event not found:", eventId);
			return res.status(404).json({ message: "Event not found." });
		}
		
		const participants = event.registrations;
		console.log("[DEBUG] Found participants:", participants.length);
		
		if (!participants || participants.length === 0) {
			return res.status(200).json({ message: "No participants to notify.", results: [] });
		}

		// Prepare email details
		const subject = `Update for event: ${event.title}`;
		const sendResults = [];
		
		for (const user of participants) {
			if (!user.email) {
				console.log("[DEBUG] Skipping user without email:", user.name || user._id);
				sendResults.push({ email: "N/A", status: "skipped", error: "No email address" });
				continue;
			}
			
			const html = eventNotificationEmailTemplate({
				name: user.name || user.username || user.email,
				eventName: event.title,
				eventDate: event.date,
				location: event.location || "TBA",
				description: event.description,
				actionUrl: req.body.actionUrl || undefined,
			});
			
			console.log(`[DEBUG] Attempting to send email to: ${user.email}`);
			
			try {
				await sendEmail({
					to: user.email,
					subject,
					html,
				});
				sendResults.push({ email: user.email, status: "sent" });
				console.log(`[DEBUG] Email sent successfully to: ${user.email}`);
			} catch (err) {
				console.log(`[DEBUG] Email failed to: ${user.email}, error:`, err.message);
				sendResults.push({ email: user.email, status: "failed", error: err.message });
			}
		}
		
		console.log("[DEBUG] Email notification results:", sendResults);
		res.status(200).json({ message: "Notification emails processed.", results: sendResults });
	} catch (error) {
		console.log("[DEBUG] Error in notifyByEmail:", error);
		res.status(500).json({ message: "Failed to send notifications.", error: error.message });
	}
};

export default notifyByEmail;
