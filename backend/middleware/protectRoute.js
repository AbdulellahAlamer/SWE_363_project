import jwt from "jsonwebtoken";
import User from "../models/user.js";
import config from "../config/config.js";

// Base auth guard: verifies JWT, loads user, and attaches it to req.user
const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.jwt;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided.",
      });
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, config.jwt.secret);

    // Find user and exclude password
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    if (user.status !== "active") {
      return res.status(401).json({
        status: "error",
        message: "Account is not active.",
      });
    }

    // Expose user (and token if needed) downstream
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        message: "Access denied. Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Access denied. Token expired.",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

export default protectRoute;
