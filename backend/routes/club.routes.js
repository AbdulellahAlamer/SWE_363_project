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
import subscribeClub from "../controllers/club/subscribeClub.js";
import unsubscribeClub from "../controllers/club/unsubscribeClub.js";

const router = express.Router();
// test imports

// -----------------------------
// PUBLIC / USER ROUTES
// -----------------------------

router.get("/test", (req, res) => {
  res.send("clubs route works");
});

// Get clubs the user has joined
router.get("/user/mine", protectUser, getMyClubs);

// Get all clubs
router.get("/", getAllClubs);

// Subscribe / unsubscribe
router.post("/:id/subscribe", protectUser, subscribeClub);
router.delete("/:id/subscribe", protectUser, unsubscribeClub);

// Get a specific club
router.get("/:id", getClubById);


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
