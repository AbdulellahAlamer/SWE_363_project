import express from "express";
import getAllUsers from "../controllers/user/getAllUsers.js";
import getUserById from "../controllers/user/getUserById.js";
import getMe from "../controllers/user/getMe.js";
import updateMe from "../controllers/user/updateMe.js";
import updateUserById from "../controllers/user/updateUserById.js";
import deleteUser from "../controllers/user/deleteUser.js";
import searchUsers from "../controllers/user/searchUsers.js";
import createUser from "../controllers/user/createUser.js";
import protectRoute from "../middleware/protectRoute.js";
import restrictTo from "../middleware/restrictTo.js";

const router = express.Router();

// All routes below require authentication
// router.use(protectRoute);

// My profile
router.get("/me", getMe);
router.patch("/me", updateMe);

// Search users (admin only)
router.get("/search", searchUsers);

// Create user & list users (admin)
router
  .route("/")
  .post(createUser)
  .get(getAllUsers);

// Admin operations on specific user
router
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUser);

export default router;
