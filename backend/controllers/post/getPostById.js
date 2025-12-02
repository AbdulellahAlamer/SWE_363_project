import Post from "../../models/Post.js";

// Controller to get a single post by its ID
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({
        status: "error",
        message: "Post ID is required.",
      });
    }
    const post = await Post.findById(postId).populate(
      "club",
      "name category status"
    );
    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not found.",
      });
    }
    res.status(200).json({
      status: "success",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch post.",
      error: error.message,
    });
  }
};

export default getPostById;
