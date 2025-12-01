// backend/controllers/user/searchUsers.js
import User from "../../models/user.js";

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a search query ?q=",
      });
    }

    const regex = new RegExp(q, "i");

    const users = await User.find({
      status: { $ne: "Deleted" },
      $or: [{ name: regex }, { email: regex }, { username: regex }],
    }).select("-password -__v -passwordResetToken -passwordResetExpires");

    return res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while searching for users",
    });
  }
};

export default searchUsers;
