import User from "../../models/user.js";

const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in",
      });
    }

    const user = await User.findById(req.user.id).select(
      "-password -__v -passwordResetToken -passwordResetExpires"
    );

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching your profile",
    });
  }
};

export default getMe;
