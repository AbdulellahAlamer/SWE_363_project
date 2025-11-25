import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import config from "../config/config.js";
import { connect } from "../config/db.js";
import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";
import protectRoute from "../middleware/protectRoute.js";

dotenv.config();

// Initialize app
const app = express();

// Security middleware
app.use(helmet(config.security.helmet));
app.use(cors(config.security.cors));

// Body parsing middleware with size limits
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));

// Logging middleware
const morganFormat = config.app.isProduction ? "combined" : "dev";
app.use(morgan(morganFormat));



// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: `Welcome to ${config.app.name}`,
    version: process.env.npm_package_version || "1.0.0",
    environment: config.app.environment,
    apiPrefix: config.app.apiPrefix,
  });
});

// API Routes
app.use(`${config.app.apiPrefix}/auth`, authRoutes);
app.use(`${config.app.apiPrefix}/users`, protectRoute, userRoutes);



// 404 handler for API routes
app.use(`${config.app.apiPrefix}/*`, (req, res) => {
  res.status(404).json({
    status: "error",
    message: "API endpoint not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// General 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});


// Start server function
const startServer = async () => {
  try {
    // Connect to database
    if (config.db.uri && config.db.password) {
      await connect();
    }

    console.log("✅ Database connected successfully");

    // Start HTTP server
    const server = app.listen(config.app.port, () => {
      console.log(`🚀 Server running in ${config.app.environment} mode`);
      console.log(`📍 Local: http://${config.app.host}:${config.app.port}`);
      console.log(
        `🔌 API: http://${config.app.host}:${config.app.port}${config.app.apiPrefix}`
      );
      
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      console.log(`\n🛑 ${signal} received. Starting graceful shutdown...`);

      server.close(async (err) => {
        if (err) {
          console.error("❌ Error during server shutdown:", err);
        } else {
          console.log("✅ HTTP server closed");
        }

        try {
          // Close database connection
          await mongoose.connection.close();
          console.log("✅ Database connection closed");
        } catch (dbErr) {
          console.error("❌ Error closing database connection:", dbErr);
        }

        process.exit(err ? 1 : 0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error("⚠️  Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    return server;
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};



// Start the server if this file is run directly
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  startServer();
}

export default app;
