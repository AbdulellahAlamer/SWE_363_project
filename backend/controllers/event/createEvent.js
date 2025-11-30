import Event from '../../models/Event.js';
// Controller to create a new event
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, club } = req.body;
        if (!title || !date || !club) {
            return res.status(400).json({ message: "Title, date, and club are required." });
        }
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            club
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: "Failed to create event.", error: error.message });
    }
};

export default createEvent;