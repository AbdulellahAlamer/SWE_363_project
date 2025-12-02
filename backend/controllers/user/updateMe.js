import User from "../../models/user.js";

const filterAllowedFields = (obj, allowedFields) => {
  const filtered = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) filtered[key] = obj[key];
  });
  return filtered;
};

const updateMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in",
      });
    }

    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "This route is not for password updates",
      });
    }

    const allowedFields = [
      "username",
      "name",
      "major",
      "Join_Year",
      "photo_URL",
      "Certificates",
    ];
    const updates = filterAllowedFields(req.body, allowedFields);

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password -__v -passwordResetToken -passwordResetExpires");

    return res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating current user:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while updating your profile",
    });
  }
};

export default updateMe;
