import Post from "../../models/Post.js";

export default async (req, res) => {
  try {
    const post = await Post.create(req.body);
    const populated = await post.populate("club", "name category status");

    res.status(201).json({ status: "success", data: populated });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
