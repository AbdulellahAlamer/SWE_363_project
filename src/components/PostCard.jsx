import Button from "./Button";

function PostCard({ post, onEdit, userType }) {
  return (
    <article className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            {post.clubInitials}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{post.clubName}</div>
            <div className="text-xs text-slate-400">{post.timeAgo}</div>
          </div>
        </div>

        {userType === "admin" && (
          <div className="text-sm">
            <button
              onClick={() => onEdit?.(post.id)}
              className="text-slate-500 hover:text-slate-700 text-sm rounded px-2 py-1"
              aria-label="Edit post"
            >
              Edit
            </button>
          </div>
        )}
      </header>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h3>
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
          <div className="text-xs">{post.likes} likes</div>
          <div className="text-xs">{post.comments} comments</div>
        </div>
      </footer>
    </article>
  );
}

export default PostCard;