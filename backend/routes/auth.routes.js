import express from "express";
import register from "../controllers/auth/register.js";
import login from "../controllers/auth/login.js";
import changePassword from "../controllers/auth/changePassword.js";
import sendForgetPassword from "../controllers/auth/sendForgetPassword.js";
import getCurrentUser from "../controllers/auth/getCurrentUser.js";
import protectUser from "../middleware/protectUser.js";

const router = express.Router();

// Public routes - no authentication required
router.post("/register", register);
router.post("/login", login);
router.post("/sendForgetPassword", sendForgetPassword);
router.post("/changePassword", changePassword);

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

export default router;
