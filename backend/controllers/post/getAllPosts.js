import Post from "../../models/Post.js";

// Controller to fetch posts. Optionally filter by club via params or query.
const getAllPosts = async (req, res) => {
  try {
    const clubId =
      req.params.clubId ||
      req.query.clubId ||
      req.query.club ||
      req.query.club_id;

    const filter = {};
    if (clubId) {
      filter.club = clubId;
    }

    const posts = await Post.find(filter)
      .populate("club", "name category status")
      .populate("likes", "_id name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch posts.",
      error: error.message,
    });
  }
};

export default getAllPosts;
