import Post from "../../models/Post.js";
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

export default async (req, res) => {
  try {
    const postData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
        // Convert image buffer to base64
        const base64Image = req.file.buffer.toString('base64');
        postData.imageData = `data:${req.file.mimetype};base64,${base64Image}`;
        console.log("[Post Creation] Image uploaded and converted to base64");
    }
    
    const post = await Post.create(postData);
    const populated = await post.populate("club", "name category status");

    res.status(201).json({ status: "success", data: populated });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
