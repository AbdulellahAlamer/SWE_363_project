import Post from "../../models/Post.js";

// Controller to update a post by its ID
const updatePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const updateData = req.body;
		if (!postId) {
			return res.status(400).json({ message: "Post ID is required." });
		}
		const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });
		if (!updatedPost) {
			return res.status(404).json({ message: "Post not found." });
		}
		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(500).json({ message: "Failed to update post.", error: error.message });
	}
};

export default updatePost;
