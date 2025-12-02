import User from "../../models/user.js";

const getAllUsers = async (req, res) => {
  try {
    const { status, role, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (role) filter.role = role;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }, { username: regex }];
    }

    const users = await User.find(filter).select(
      "-password -__v -passwordResetToken -passwordResetExpires"
    );

    return res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching users",
    });
  }
};

export default getAllUsers;
