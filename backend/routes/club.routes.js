// routes/club.routes.js
import express from "express";
import protectUser from "../middleware/protectUser.js";
import protectSuperAdmin from "../middleware/protectSuperAdmin.js";

import {
  getAllClubs,
  getClubById,
  getMyClubs,
  createClub,
  updateClub,
  deleteClub,
} from "../controllers/clubs/club.controllers.js";

const router = express.Router();

// -----------------------------
// PUBLIC / USER ROUTES
// -----------------------------

// Get all clubs
router.get("/", getAllClubs);

// Get a specific club
router.get("/:id", getClubById);

// Get clubs the user has joined
router.get("/user/mine", protectUser, getMyClubs);

// -----------------------------
// SUPER ADMIN ROUTES
// -----------------------------

// Create a club
router.post("/", protectSuperAdmin, createClub);

// Update a club
router.put("/:id", protectSuperAdmin, updateClub);

// Delete a club
router.delete("/:id", protectSuperAdmin, deleteClub);

export default router;
