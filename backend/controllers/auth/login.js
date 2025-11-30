import User from "../../models/user.js";
import { generateToken } from "../../utils/jwt.js";

// User login controller
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        errors: {
          required: ["email", "password"],
        },
      });
    }

    // Find user by email and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    // User not found
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if user account is active
    if (user.status !== "active") {
      return res.status(401).json({
        status: "error",
        message: "Account is not active. Please contact support.",
      });
    }

    // Compare passwords using the schema method
    // Ensure password exists (in case of corrupted data)
    if (!user.password) {
      return res.status(500).json({
        status: "error",
        message: "User password not set. Please reset your password.",
      });
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Remove password from user object before returning
    const userObject = user.toObject();
    delete userObject.password;

    // Return token and user info
    return res.json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          id: userObject._id,
          name: userObject.name,
          email: userObject.email,
          role: userObject.role,
          status: userObject.status,
          lastLogin: userObject.lastLogin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export default login;
