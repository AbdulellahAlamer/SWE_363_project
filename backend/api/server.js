import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import process from "process";

import config from "../config/config.js";
import { connect } from "../config/db.js";

// ROUTES
import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";
import clubRoutes from "../routes/club.routes.js";
import postRoutes from "../routes/post.routes.js";
import eventRoutes from "../routes/event.routes.js";

dotenv.config();

// Initialize app
const app = express();

// Security middleware
app.use(helmet(config.security.helmet));
app.use(cors(config.security.cors));

// Body parsing
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

/* ==========================
        API ROUTES
========================== */

// Auth routes (public)
app.use(`${config.app.apiPrefix}/auth`, authRoutes);

// User routes (protected)
app.use(`${config.app.apiPrefix}/users`, userRoutes);

// Club routes (protected)
app.use(`${config.app.apiPrefix}/clubs`, clubRoutes);

// Post routes
app.use(`${config.app.apiPrefix}/posts`, postRoutes);

// Event routes
app.use(`${config.app.apiPrefix}/events`, eventRoutes);

/* ==========================
        404 HANDLERS
========================== */

// 404 for API routes
app.use(`${config.app.apiPrefix}/*`, (req, res) => {
  res.status(404).json({
    status: "error",
    message: "API endpoint not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// General 404 fallback
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

/* ==========================
        START SERVER
========================== */

const startServer = async () => {
  try {
    if (config.db.uri) {
      await connect();
    }

    console.log("✅ Database connected successfully");

    const server = app.listen(config.app.port, () => {
      console.log(`🚀 Server running in ${config.app.environment} mode`);
      console.log(`📍 Local: http://${config.app.host}:${config.app.port}`);
      console.log(
        `🔌 API: http://${config.app.host}:${config.app.port}${config.app.apiPrefix}`
      );
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async (err) => {
        if (err) {
          console.error("❌ Error during server shutdown:", err);
        } else {
          console.log("✅ HTTP server closed");
        }

        try {
          await mongoose.connection.close();
          console.log("✅ Database connection closed");
        } catch (dbErr) {
          console.error("❌ Error closing DB connection:", dbErr);
        }

        process.exit(err ? 1 : 0);
      });

      setTimeout(() => {
        console.error("⚠️ Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    return server;
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Auto-start if this file is run directly
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  startServer();
}

export default app;

