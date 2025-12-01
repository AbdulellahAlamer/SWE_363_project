// backend/controllers/user/getUserById.js
import User from "../../models/user.js";

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      "-password -__v -passwordResetToken -passwordResetExpires"
    );

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // If not admin, only allow user to see themselves
    if (req.user.role !== "admin" && req.user.id !== user.id) {
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to view this user",
      });
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Error getting user by id:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching the user",
    });
  }
};

export default getUserById;
