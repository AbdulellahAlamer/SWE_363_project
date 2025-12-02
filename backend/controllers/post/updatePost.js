import Post from "../../models/Post.js";

// Controller to update a post by its ID
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const updateData = req.body;
    if (!postId) {
      return res.status(400).json({
        status: "error",
        message: "Post ID is required.",
      });
    }
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
    res.status(200).json({
      status: "success",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update post.",
      error: error.message,
    });
  }
};

export default updatePost;
