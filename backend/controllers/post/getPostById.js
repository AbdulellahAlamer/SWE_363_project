import Post from "../../models/Post.js";

// Controller to get a single post by its ID
const getPostById = async (req, res) => {
	try {
		const { postId } = req.params;
		if (!postId) {
			return res.status(400).json({ message: "Post ID is required." });
		}
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found." });
		}
		res.status(200).json(post);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch post.", error: error.message });
	}
};

export default getPostById;
