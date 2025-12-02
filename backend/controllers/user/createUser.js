import User from "../../models/user.js";

const allowedRoles = ["student", "admin", "president"];
const allowedStatuses = ["active", "inactive", "suspended", "Deleted"];

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      username,
      email,
      password,
      role = "student",
      status = "active",
      major,
      Join_Year,
      photo_URL,
      Certificates,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please enter a valid email address",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    const normalizedRole = allowedRoles.includes(role) ? role : "student";
    const normalizedStatus = allowedStatuses.includes(status) ? status : "active";

    const newUser = await User.create({
      name: name.trim(),
      username: username?.trim() || name.trim(),
      email: normalizedEmail,
      password,
      role: normalizedRole,
      status: normalizedStatus,
      major,
      Join_Year,
      photo_URL,
      Certificates,
    });

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          createdAt: newUser.createdAt,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        status: "error",
        message: `${field} already exists`,
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
    }

    return next(error);
  }
};

export default createUser;
