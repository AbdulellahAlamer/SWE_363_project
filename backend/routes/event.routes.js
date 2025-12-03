import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import restrictTo from "../middleware/restrictTo.js";
import getAllEvents from "../controllers/event/getAllEvents.js";
import getEventsOfClub from "../controllers/event/getEventsOfClub.js";
import createEvent from "../controllers/event/createEvent.js";
import editEvent from "../controllers/event/editEvent.js";
import deleteEvent from "../controllers/event/deleteEvent.js";
import joinEvent from "../controllers/event/joinEvent.js";
import leaveEvent from "../controllers/event/leaveEvent.js";
import notifyByEmail from "../controllers/event/notifyByEmail.js";

const router = express.Router();

// Public fetch endpoints
router.get("/", getAllEvents);
router.get("/club/:clubId", getEventsOfClub);

// Event management (admin/president)
router.post("/", createEvent);
router.put("/:eventId", protectRoute, restrictTo("admin", "president"), editEvent);
router.delete("/:eventId", protectRoute, restrictTo("admin", "president"), deleteEvent);

// Participant actions
router.post("/:eventId/join", protectRoute, joinEvent);
router.post("/:eventId/leave", protectRoute, leaveEvent);

// Notify registered users
router.post(
  "/:eventId/notify",
  protectRoute,
  restrictTo("admin", "president"),
  notifyByEmail
);

export default router;
