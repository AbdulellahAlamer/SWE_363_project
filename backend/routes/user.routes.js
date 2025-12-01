import express from "express";
import getAllUsers from "../controllers/user/getAllUsers.js";
import getUserById from "../controllers/user/getUserById.js";
import getMe from "../controllers/user/getMe.js";
import updateMe from "../controllers/user/updateMe.js";
import updateUserById from "../controllers/user/updateUserById.js";
import deleteUser from "../controllers/user/deleteUser.js";
import searchUsers from "../controllers/user/searchUsers.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// All /users routes require authentication
router.use(protectRoute);

/**
 * /api/v1/users
 */

// Get my profile
router.get("/me", getMe);

// Update my profile
router.patch("/me", updateMe);

// Search users: /users/search?q=...
router.get("/search", searchUsers);

// Get all users (admin)
router.get("/", getAllUsers);

// Get user by id
router.get("/:id", getUserById);

// Update user by id (admin)
router.patch("/:id", updateUserById);

// Soft delete user (admin)
router.delete("/:id", deleteUser);

export default router;
