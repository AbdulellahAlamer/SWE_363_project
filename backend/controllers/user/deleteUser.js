// backend/controllers/user/deleteUser.js
import User from "../../models/user.js";

const deleteUser = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to perform this action",
      });
    }

    const userId = req.params.id;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { status: "Deleted" },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -__v -passwordResetToken -passwordResetExpires");

    if (!deletedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User soft deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while deleting the user",
    });
  }
};

export default deleteUser;
