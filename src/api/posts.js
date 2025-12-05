import { request } from "./client.js";
import { getInitials } from "./clubs.js";

const DEFAULT_TAG = "Announcement";

const formatTimeAgo = (dateInput) => {
  if (!dateInput) return "Posted moments ago";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Posted moments ago";

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return "Posted just now";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `Posted ${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Posted ${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Posted ${diffDays}d ago`;

  return `Posted ${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;
};

export const normalizePost = (post = {}) => {
  const rawClub = post.club || {};
  const isClubObject =
    rawClub && typeof rawClub === "object" && !Array.isArray(rawClub);
  const clubName = isClubObject ? rawClub.name : post.clubName;

  const likesCount = Array.isArray(post.likes)
    ? post.likes.length
    : Number(post.likes || 0);

  const createdAt = post.createdAt || rawClub.createdAt;

  return {
    id: post._id || post.id,
    title: post.title || "Untitled Post",
    body: post.description || post.body || "",
    imageUrl: post.imageURL || post.imageUrl || "",
    imageData: post.imageData || "", // Add imageData field
    tag: post.tag || DEFAULT_TAG,
    likes: Number.isFinite(likesCount) ? likesCount : 0,
    clubId: isClubObject ? rawClub._id : rawClub,
    clubName: clubName || "Club",
    clubInitials: getInitials(clubName || post.clubInitials || "Club"),
    timeAgo: formatTimeAgo(createdAt || post.updatedAt),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    raw: post,
  };
};

const extractPostArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.posts)) return payload.posts;
  return [];
};

export async function fetchPosts({ clubId } = {}) {
  const params = new URLSearchParams();
  if (clubId) params.set("club", clubId);
  const qs = params.toString();
  const res = await request(qs ? `/posts?${qs}` : "/posts");
  const posts = extractPostArray(res);
  return posts.map(normalizePost);
}

export async function fetchPost(id) {
  if (!id) throw new Error("Post id is required");
  const res = await request(`/posts/${id}`);
  const post = res?.data || res;
  return normalizePost(post);
}

export async function createPost(payload) {
  const res = await request("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizePost(res?.data || res);
}

export async function updatePost(id, payload) {
  if (!id) throw new Error("Post id is required");
  const res = await request(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return normalizePost(res?.data || res);
}

export async function deletePost(id) {
  if (!id) throw new Error("Post id is required");
  await request(`/posts/${id}`, { method: "DELETE" });
  return true;
}

export async function likePost(id) {
  if (!id) throw new Error("Post id is required");
  const res = await request(`/posts/${id}/like`, { method: "POST" });
  return res;
}
