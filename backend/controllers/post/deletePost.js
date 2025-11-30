import Post from '../../models/Post.js';

export default async (req, res) => {
    try { 
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ status: 'error', message: 'Post not found' });
        }
        res.status(200).json({ status: 'success', message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};