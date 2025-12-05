import Event from "../../models/Event.js";
import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

const editEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required." });
        }
        
        console.log("[Event Edit] Request body:", req.body);
        console.log("[Event Edit] Has file:", !!req.file);
        console.log("[Event Edit] Delete image flag:", req.body.deleteImage);
        
        const updateData = { ...req.body };
        
        // Handle image operations
        if (req.file) {
            // New image uploaded - convert to base64
            const base64Image = req.file.buffer.toString('base64');
            updateData.imageData = `data:${req.file.mimetype};base64,${base64Image}`;
            console.log("[Event Edit] New image uploaded and converted to base64");
        } else if (updateData.deleteImage === 'true') {
            // Delete existing image
            updateData.imageData = "";
            updateData.imageURL = ""; // Also clear old URL field if present
            console.log("[Event Edit] Image marked for deletion - clearing imageData and imageURL");
            // Remove the deleteImage flag from update data
            delete updateData.deleteImage;
        }
        
        console.log("[Event Edit] Final update data:", updateData);
        
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }
        
        console.log("[Event Edit] Updated event imageData:", updatedEvent.imageData ? "Has image" : "No image");
        
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("[Event Edit] Error:", error);
        res.status(500).json({ message: "Failed to update event.", error: error.message });
    }
};

export default editEvent;
