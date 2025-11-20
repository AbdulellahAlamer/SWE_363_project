import { useEffect, useState } from "react";

function PostCard({ post, onEdit, type = "student" }) {
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const canLike = type === "student";
  const canEdit = type === "president";

  useEffect(() => {
    setLikesCount(post.likes || 0);
    setLiked(false);
  }, [post.id, post.likes]);

  const handleLikeToggle = () => {
    if (!canLike) return;
    setLikesCount((prev) => prev + (liked ? -1 : 1));
    setLiked((prev) => !prev);
  };

  return (
    <article className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            {post.clubInitials}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {post.clubName}
            </div>
            <div className="text-xs text-slate-400">{post.timeAgo}</div>
          </div>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => onEdit?.(post.id)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
            aria-label="Edit post"
          >
            Edit
          </button>
        )}
      </header>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">{post.body}</p>

        {/* -- FIX APPLIED HERE --
          1. Changed 'object-cover' to 'object-contain' to show the full image without cropping.
          2. Added 'bg-slate-200' to the container to make the empty space visible.
        */}
        <div className="w-full rounded-lg overflow-hidden bg-slate-200 aspect-video mb-4 flex items-center justify-center text-gray-400">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-contain" // Key change: object-contain
            />
          ) : (
            <div className="text-sm">600 × 320</div>
          )}
        </div>
      </div>

      <footer className="mt-auto flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
            {post.tag}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs">{likesCount} likes</div>
          {canLike && (
            <button
              type="button"
              onClick={handleLikeToggle}
              className={`text-xs font-medium rounded-full px-3 py-1 border transition ${
                liked
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
              }`}
              aria-pressed={liked}
            >
              {liked ? "Liked" : "Like"}
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}

export default PostCard;
