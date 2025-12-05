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

// Controller to update a post by its ID
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({
        status: "error",
        message: "Post ID is required.",
      });
    }
    
    console.log("[Post Edit] Request body:", req.body);
    console.log("[Post Edit] Has file:", !!req.file);
    console.log("[Post Edit] Delete image flag:", req.body.deleteImage);
    
    const updateData = { ...req.body };
    
    // Handle image operations
    if (req.file) {
        // New image uploaded - convert to base64
        const base64Image = req.file.buffer.toString('base64');
        updateData.imageData = `data:${req.file.mimetype};base64,${base64Image}`;
        console.log("[Post Edit] New image uploaded and converted to base64");
    } else if (updateData.deleteImage === 'true') {
        // Delete existing image
        updateData.imageData = "";
        updateData.imageURL = ""; // Also clear old URL field if present
        console.log("[Post Edit] Image marked for deletion - clearing imageData and imageURL");
        // Remove the deleteImage flag from update data
        delete updateData.deleteImage;
    }
    
    console.log("[Post Edit] Final update data:", updateData);
    
    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
      runValidators: true,
    }).populate("club", "name category status");

    if (!updatedPost) {
      return res.status(404).json({
        status: "error",
        message: "Post not found.",
      });
    }
    
    console.log("[Post Edit] Updated post imageData:", updatedPost.imageData ? "Has image" : "No image");
    
    res.status(200).json({
      status: "success",
      data: updatedPost,
    });
  } catch (error) {
    console.error("[Post Edit] Error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update post.",
      error: error.message,
    });
  }
};

export default updatePost;
