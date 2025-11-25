const express = require("express");
const router = express.Router();
const getAllUsers = require("../controllers/user/getAllUsers");

const protectRoute = require("../middleware/protectRoute");

// All routes require authentication
router.use(protectRoute);

// User routes
router.get("/", getAllUsers); // GET /api/v1/users - Get all users (admin only)

module.exports = router;
