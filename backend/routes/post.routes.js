import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import restrictTo from "../middleware/restrictTo.js";
import getAllPosts from "../controllers/post/getAllPosts.js";
import getPostById from "../controllers/post/getPostById.js";
import createPost from "../controllers/post/createPost.js";
import updatePost from "../controllers/post/updatePost.js";
import deletePost from "../controllers/post/deletePost.js";
import likePost from "../controllers/post/likePost.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:postId", getPostById);

router.post(
  "/",
  protectRoute,
  restrictTo("admin", "president"),
  createPost
);

router.put(
  "/:postId",
  protectRoute,
  restrictTo("admin", "president"),
  updatePost
);

router.delete(
  "/:postId",
  protectRoute,
  restrictTo("admin", "president"),
  deletePost
);

// Like/unlike post (any authenticated user)
router.post(
  "/:postId/like",
  protectRoute,
  likePost
);

export default router;
