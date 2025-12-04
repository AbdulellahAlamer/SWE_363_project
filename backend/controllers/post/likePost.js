import Post from "../../models/Post.js";

// Controller to like or unlike a post
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // Get user ID from authenticated user
    
    console.log("[DEBUG] likePost called:", { postId, userId });
    
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }
    
    if (!userId) {
      return res.status(400).json({ message: "User authentication required." });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      console.log("[DEBUG] Post not found:", postId);
      return res.status(404).json({ message: "Post not found." });
    }
    
    const hasLiked = post.likes.map(id => id.toString()).includes(userId.toString());
    
    if (hasLiked) {
      // Unlike: Remove user from likes array
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      console.log("[DEBUG] Post unliked by user");
    } else {
      // Like: Add user to likes array
      post.likes.push(userId);
      console.log("[DEBUG] Post liked by user");
    }
    
    await post.save();
    
    res.status(200).json({ 
      message: hasLiked ? "Post unliked successfully" : "Post liked successfully",
      likesCount: post.likes.length,
      liked: !hasLiked
    });
  } catch (error) {
    console.log("[DEBUG] Error in likePost:", error);
    res.status(500).json({ message: "Failed to toggle like.", error: error.message });
  }
};

export default likePost;