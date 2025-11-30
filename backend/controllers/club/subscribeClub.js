import mongoose from "mongoose";
import Club from "../../models/Club.js";

// Subscribe the authenticated user to a club
export default async function subscribeClub(req, res) {
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

    const alreadyMember = club.members.some((memberId) =>
      memberId.equals(userId)
    );

    if (!alreadyMember) {
      club.members.push(userId);
      await club.save();
    }

    return res.json({
      status: "success",
      message: alreadyMember
        ? "User is already subscribed to this club."
        : "Subscribed to club.",
      data: club,
    });
  } catch (err) {
    console.error("subscribeClub error:", err);
    return res
      .status(500)
      .json({ status: "error", message: err.message || "Server error." });
  }
}
