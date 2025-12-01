import User from "../../models/user.js";

// Change password controller
const changePassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword, userID } = req.body;
    console.log("Change password request for user:", userID);
    // Validate request
    if (!newPassword || !confirmPassword || !userID) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        errors: {
          required: ["newPassword", "confirmPassword"],
        },
      });
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "New passwords do not match",
      });
    }

    // Check password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "New password must be at least 6 characters long",
      });
    }

    // Change password
    const user = await User.findById(userID).select("+password");

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    return res.json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default changePassword;
