import { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import PostCard from "../components/PostCard";
import PopupForm from "../components/PopupForm";

// 1. **IMPORT THE IMAGE:** // Use a relative path from PostsPage.jsx (in src/pages)
// back to src/assets/images/funny.png
import funnyImage from "../assets/images/funny.png";

/* Mock posts — replace with real data / API later */
const SAMPLE_POSTS = [
  {
    id: "post-001",
    clubInitials: "CS",
    clubName: "Computer Club",
    timeAgo: "Posted 2h ago",
    title: "Hack the Future Winners",
    body: "Congratulations to Team Catalyst for securing first place in the smart-campus track! Their AI powered energy dashboard impressed the judges.",
    // 2. **USE THE IMPORTED VARIABLE:**
    imageUrl: funnyImage,
    tag: "Event Recap",
    likes: 86,
  },
  {
    id: "post-002",
    clubInitials: "ISE",
    clubName: "ISE Club",
    timeAgo: "Posted yesterday",
    title: "Lean Workshop Materials",
    body: "Slides and templates from last week's lean manufacturing bootcamp are now available. Download and share with your project teams.",
    // 3. **USE THE IMPORTED VARIABLE AGAIN:**
    imageUrl: funnyImage,
    tag: "Resources",
    likes: 42,
  },
  {
    id: "post-003",
    clubInitials: "ME",
    clubName: "Mechanical Engineers Club",
    timeAgo: "Posted Mar 21",
    title: "Formula Student Build Update",
    body: "Chassis welding is complete! Join us this Friday for suspension assembly and testing at the workshop.",
    imageUrl: null,
    tag: "Project Update",
    likes: 64,
  },
];

export default function PostsPage() {
  // ... (rest of the component code remains the same)

  // ... (handleEdit and closePopup functions)

  const posts = SAMPLE_POSTS;
  const [editingPost, setEditingPost] = useState(null);

  const handleEdit = (postId) => {
    const post = posts.find((p) => p.id === postId);
    setEditingPost(post || null);
  };

  const closePopup = () => setEditingPost(null);

  return (
    <div className="flex">
      <NavigationBar active="/posts" type="student" />

+      <main className="ml-0 md:ml-64 flex-1 min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Club Posts</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onEdit={handleEdit} />
            ))}
          </div>
        </div>
      </main>

      {editingPost && (
        <PopupForm
          method="PUT"
          endpoint={`/api/posts/${editingPost.id}`}
          fields={[
            { name: "title", label: "Title", dataType: "string" },
            { name: "body", label: "Body", dataType: "text" },
            { name: "tag", label: "Tag", dataType: "string" },
          ]}
          initialValues={{
            title: editingPost.title,
            body: editingPost.body,
            tag: editingPost.tag,
          }}
          submitLabel="Save changes"
          onClose={closePopup}
        />
      )}
    </div>
  );
}
