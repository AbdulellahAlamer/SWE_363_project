import { useEffect, useMemo, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import PostCard from "../components/PostCard";
import PopupForm from "../components/PopupForm";
import { fetchPosts, updatePost } from "../api/posts.js";

const editFields = [
  { name: "title", label: "Title", dataType: "string" },
  { name: "body", label: "Body", dataType: "text" },
  { name: "tag", label: "Tag", dataType: "string" },
];

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [editingPost, setEditingPost] = useState(null);

  const tags = useMemo(() => {
    const unique = new Set(
      posts
        .map((post) => (post.tag || "").trim())
        .filter((tag) => Boolean(tag))
    );
    return ["All", ...unique];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag =
        selectedTag === "All" ||
        (post.tag || "").toLowerCase() === selectedTag.toLowerCase();
      if (!matchesTag) return false;

      if (!query) return true;
      return (
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query) ||
        post.clubName.toLowerCase().includes(query)
      );
    });
  }, [posts, searchTerm, selectedTag]);

  const loadPosts = async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleEdit = (postId) => {
    const post = posts.find((p) => p.id === postId);
    setEditingPost(post || null);
  };

  const closePopup = () => setEditingPost(null);

  const handleSubmitEdit = async (values) => {
    if (!editingPost) return;
    const payload = {
      title: values.title,
      description: values.body,
      tag: values.tag,
    };
    const updatedPost = await updatePost(editingPost.id, payload);
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  return (
    <div className="flex">
      <NavigationBar active="/posts" type="student" />
      <main className="ml-0 md:ml-64 flex-1 min-h-screen bg-gradient-to-b from-slate-50 to-white p-8 pt-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                Club Posts
              </h1>
              <p className="text-sm text-slate-500">
                Browse announcements across all clubs.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Search by title or club"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="w-full sm:w-48 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-slate-500 py-12">
              Loading posts…
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-3">{error}</p>
              <button
                type="button"
                onClick={loadPosts}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700"
                disabled={isRefreshing}
              >
                {isRefreshing ? "Refreshing…" : "Retry"}
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center text-slate-500 py-12">
              No posts found. Try a different search or filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </div>
      </main>

      {editingPost && (
        <PopupForm
          method="PUT"
          fields={editFields}
          initialValues={{
            title: editingPost.title,
            body: editingPost.body,
            tag: editingPost.tag,
          }}
          submitLabel="Save changes"
          onClose={closePopup}
          onSubmit={handleSubmitEdit}
        />
      )}
    </div>
  );
}
