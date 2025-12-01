import User from "../../models/user.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export default getAllUsers;
