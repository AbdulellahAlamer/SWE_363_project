import process from "process";
import User from "../../models/user.js";
import { sendEmail } from "../../utils/sendingEmail.js";
import greetingEmailTemplate from "../../utils/greetingEmailTamplate.js";

const { MAILERSEND_FROM, MAILERSEND_FROM_NAME } = process.env;

// User registration controller
const register = async (req, res, next) => {
  try {
    const allowedRoles = ["student", "admin", "president"];
    const { name, password, email, role = "student" } = req.body;
    const trimmedName = name;

    // Validate request
    if (!trimmedName || !password || !email) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        errors: {
          required: ["name", "password", "email"],
        },
      });
    }

    // Basic validation
    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
      });
    }

    if (trimmedName.length < 3) {
      return res.status(400).json({
        status: "error",
        message: "Name must be at least 3 characters long",
      });
    }

    // Validate role (fallback to student if invalid)
    const normalizedRole = allowedRoles.includes(role) ? role : "student";

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please enter a valid email address",
      });
    }

    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();

    const existingUserByEmail = await User.findOne({
      email: normalizedEmail,
    });
    if (existingUserByEmail) {
      throw new Error("User with this email already exists");
    }

    // Create new user (password will be hashed by the pre-save middleware)
    const result = await User.create({
      name: trimmedName,
      username: trimmedName, // keep legacy uniqueness happy
      password,
      email: normalizedEmail,
      role: normalizedRole,
    });
    console.log("the user has been created");

    // Send greeting email (non-blocking)
    const html = greetingEmailTemplate({ name: result.name });
    sendEmail({
      to: result.email,
      subject: "Welcome to KFUPM Clubs Hub",
      html,
      text: "Welcome to KFUPM Clubs Hub! You can now sign in to explore clubs, events, and more.",
      from: MAILERSEND_FROM,
      fromName: MAILERSEND_FROM_NAME,
    }).catch((err) =>
      console.error("Failed to send greeting email:", err.message)
    );

    // Return success
    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: result._id,
          name: result.name,
          email: result.email,
          role: result.role,
          status: result.status,
          createdAt: result.createdAt,
        },
      },
    });
  } catch (error) {
    // Check for duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const label = field === "username" ? "Name" : field;
      return res.status(409).json({
        status: "error",
        message: `${label.charAt(0).toUpperCase() + label.slice(1)} already exists`,
      });
    }

    // Check for validation errors
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

    // Handle custom error messages
    if (error.message.includes("already exists")) {
      return res.status(409).json({
        status: "error",
        message: error.message,
      });
    }

    next(error);
  }
};

export default register;
