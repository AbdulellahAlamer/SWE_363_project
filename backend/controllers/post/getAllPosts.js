import Post from "../../models/Post.js";

// Controller to get all posts for a specific club
const getAllPosts = async (req, res) => {
	try {
		const { clubId } = req.params;
		if (!clubId) {
			return res.status(400).json({ message: "Club ID is required." });
		}
		const posts = await Post.find({ club: clubId }).sort({ createdAt: -1 });
		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch posts.", error: error.message });
	}
};

export default getAllPosts;
