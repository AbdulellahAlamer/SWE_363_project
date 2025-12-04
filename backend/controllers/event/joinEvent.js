
import Event from "../../models/Event.js";

// Controller to allow a user to join (register for) an event
const joinEvent = async (req, res) => {
    try {
        console.log("[DEBUG] joinEvent called:", {
            params: req.params,
            user: req.user,
            userId: req.user?.id || req.user?._id
        });
        
        const { eventId } = req.params;
        const userId = req.user?.id || req.user?._id; // Get user ID from authenticated user
        
        console.log("[DEBUG] Extracted:", { eventId, userId });
        
        if (!eventId) {
            console.log("[DEBUG] Missing eventId");
            return res.status(400).json({ message: "Event ID is required." });
        }
        
        if (!userId) {
            console.log("[DEBUG] Missing userId - req.user:", req.user);
            return res.status(400).json({ message: "User authentication required." });
        }
        
        const event = await Event.findById(eventId);
        if (!event) {
            console.log("[DEBUG] Event not found:", eventId);
            return res.status(404).json({ message: "Event not found." });
        }
        
        if (event.registrations.map(id => id.toString()).includes(userId.toString())) {
            console.log("[DEBUG] User already registered");
            return res.status(400).json({ message: "User already registered for the event." });
        }
        
        event.registrations.push(userId);
        await event.save();
        console.log("[DEBUG] Registration successful");
        res.status(200).json({ message: "User registered for the event successfully." });
    } catch (error) {
        console.log("[DEBUG] Error in joinEvent:", error);
        res.status(500).json({ message: "Failed to register for event.", error: error.message });
    }
};

export default joinEvent;