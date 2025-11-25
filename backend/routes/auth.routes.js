const express = require("express");
const router = express.Router();
const register = require("../controllers/auth/register");
const login = require("../controllers/auth/login");
const getCurrentUser = require("../controllers/auth/getCurrentUser");
const protectUser = require("../middleware/protectUser");

// Public routes - no authentication required
router.post("/register", register);
router.post("/login", login);

// Protected routes - authentication required
router.get("/me", protectUser, getCurrentUser);

// Optional: Additional auth routes
router.post("/logout", protectUser, (req, res) => {
  // Clear cookie if using cookies
  res.clearCookie("jwt");
  res.json({
    status: "success",
    message: "Logged out successfully",
  });
});

module.exports = router;
