// routes/club.routes.js
import express from "express";
import protectUser from "../middleware/protectUser.js";
import protectSuperAdmin from "../middleware/protectAdmin.js";

import getAllClubs from "../controllers/club/getAllClubs.js";
import getClubById from "../controllers/club/getClubById.js";
import getMyClubs from "../controllers/club/getMyClubs.js";
import createClub from "../controllers/club/createClub.js";
import updateClub from "../controllers/club/updateClub.js";
import deleteClub from "../controllers/club/deleteClub.js";

const router = express.Router();
// test imports

// -----------------------------
// PUBLIC / USER ROUTES
// -----------------------------

router.get("/test", (req, res) => {
  res.send("clubs route works");
});
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
router.post("/", createClub);

// Update a club
router.put("/:id", protectSuperAdmin, updateClub);

// Delete a club
router.delete("/:id", deleteClub);

export default router;
