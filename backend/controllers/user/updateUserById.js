import User from "../../models/user.js";

const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const allowedFields = [
      "username",
      "name",
      "major",
      "Join_Year",
      "photo_URL",
      "Certificates",
      "role",
      "status",
    ];

    const updates = {};
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) updates[field] = req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password -__v -passwordResetToken -passwordResetExpires");

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user by id:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while updating the user",
    });
  }
};

export default updateUserById;
