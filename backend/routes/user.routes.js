import express from "express";
import getAllUsers from "../controllers/user/getAllUsers.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// User routes
router.get("/", getAllUsers); // GET /api/v1/users - Get all users (admin only)

export default router;
