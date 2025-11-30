import Post from '../../models/Post.js';

export default async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json({ status: 'success', data: post });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};