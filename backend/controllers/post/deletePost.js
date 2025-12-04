import Post from '../../models/Post.js';

export default async (req, res) => {
    try {
        console.log('[BACKEND DEBUG] Delete post request received');
        console.log('[BACKEND DEBUG] req.params:', req.params);
        console.log('[BACKEND DEBUG] postId from params:', req.params.postId);
        console.log('[BACKEND DEBUG] user:', req.user?._id);
        
        const postId = req.params.postId;
        
        if (!postId) {
            console.log('[BACKEND DEBUG] ERROR: No postId provided');
            return res.status(400).json({ status: 'error', message: 'Post ID is required' });
        }
        
        console.log('[BACKEND DEBUG] Attempting to find and delete post with ID:', postId);
        const post = await Post.findByIdAndDelete(postId);
        
        if (!post) {
            console.log('[BACKEND DEBUG] ERROR: Post not found in database');
            // Let's also try to check if the post exists at all
            const existingPost = await Post.findById(postId);
            console.log('[BACKEND DEBUG] Direct findById result:', existingPost);
            return res.status(404).json({ status: 'error', message: 'Post not found' });
        }
        
        console.log('[BACKEND DEBUG] Post successfully deleted:', post._id);
        res.status(200).json({ status: 'success', message: 'Post deleted successfully' });
    } catch (err) {
        console.log('[BACKEND DEBUG] ERROR in delete operation:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};