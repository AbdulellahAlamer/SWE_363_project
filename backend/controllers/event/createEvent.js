import Event from '../../models/Event.js';
// Controller to create a new event
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, club } = req.body;
        console.log("[Event Creation] Incoming request body:", req.body);
        if (!title || !date || !club) {
            console.error("[Event Creation] Missing required fields:", { title, date, club });
            return res.status(400).json({ message: "Title, date, and club are required.", received: req.body });
        }
        // Validate club ObjectId format
        if (typeof club !== "string" || !club.match(/^[a-fA-F0-9]{24}$/)) {
            console.error("[Event Creation] Invalid club ObjectId:", club);
            return res.status(400).json({ message: "Invalid club ObjectId.", club });
        }
        // Check club existence
        try {
            const Club = (await import('../../models/Club.js')).default;
            const clubExists = await Club.findById(club);
            if (!clubExists) {
                console.error("[Event Creation] Club not found:", club);
                return res.status(404).json({ message: "Club not found.", club });
            } else {
                console.log("[Event Creation] Club found:", clubExists);
            }
        } catch (clubErr) {
            console.error("[Event Creation] Error checking club existence:", clubErr);
            return res.status(500).json({ message: "Error checking club existence.", error: clubErr.message, stack: clubErr.stack });
        }
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            club
        });
        await newEvent.save();
        console.log("[Event Creation] Event created successfully:", newEvent);
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("[Event Creation] Error:", error);
        console.error("[Event Creation] Error stack:", error.stack);
        res.status(500).json({ message: "Failed to create event.", error: error.message, stack: error.stack, received: req.body });
    }
};

export default createEvent;