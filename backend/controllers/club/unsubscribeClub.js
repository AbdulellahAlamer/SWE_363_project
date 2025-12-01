import mongoose from "mongoose";
import Club from "../../models/Club.js";

// Unsubscribe the authenticated user from a club
export default async function unsubscribeClub(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid club id." });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ status: "error", message: "User not authenticated." });
    }

    const club = await Club.findById(id);
    if (!club) {
      return res
        .status(404)
        .json({ status: "error", message: "Club not found." });
    }

    const beforeCount = club.members.length;
    club.members = club.members.filter((memberId) => !memberId.equals(userId));

    if (club.members.length !== beforeCount) {
      await club.save();
    }

    return res.json({
      status: "success",
      message:
        club.members.length === beforeCount
          ? "User was not subscribed to this club."
          : "Unsubscribed from club.",
      data: club,
    });
  } catch (err) {
    console.error("unsubscribeClub error:", err);
    return res
      .status(500)
      .json({ status: "error", message: err.message || "Server error." });
  }
}
