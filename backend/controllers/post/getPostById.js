import Post from "../../models/Post.js";

// Controller to get a single post by its ID
const getPostById = async (req, res) => {
  try {
    console.log('[BACKEND DEBUG] Get post request received');
    console.log('[BACKEND DEBUG] req.params:', req.params);
    console.log('[BACKEND DEBUG] postId from params:', req.params.postId);
    
    const { postId } = req.params;
    if (!postId) {
      console.log('[BACKEND DEBUG] ERROR: No postId provided');
      return res.status(400).json({
        status: "error",
        message: "Post ID is required.",
      });
    }
    
    console.log('[BACKEND DEBUG] Attempting to find post with ID:', postId);
    const post = await Post.findById(postId).populate(
      "club",
      "name category status"
    );
    if (!post) {
      console.log('[BACKEND DEBUG] ERROR: Post not found in database');
      return res.status(404).json({
        status: "error",
        message: "Post not found.",
      });
    }
    
    console.log('[BACKEND DEBUG] Post found successfully:', post._id);
    res.status(200).json({
      status: "success",
      data: post,
    });
  } catch (error) {
    console.log('[BACKEND DEBUG] ERROR in get operation:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch post.",
      error: error.message,
    });
  }
};

export default getPostById;
