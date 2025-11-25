// Load environment variables from the project's config.env file
require("dotenv").config({
  path: require("path").join(__dirname, "..", "config.env"),
});

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

// Minimal defaults; override via environment variables when needed.
module.exports = {
  app: {
    name: process.env.APP_NAME || "Node Template API",
    port: process.env.PORT || 5000,
    host: process.env.HOST || "localhost",
    apiPrefix: "/api/v1",
    environment: NODE_ENV,
    isProduction,
  },
  db: {
    uri: process.env.DATABASE || "mongodb://localhost:27017/node_template",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      (isProduction ? undefined : "development-secret"),
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  security: {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    },
  },
};
