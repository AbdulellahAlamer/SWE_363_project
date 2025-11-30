import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import process from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envCandidates = [
  path.join(__dirname, "..", ".env"),
  path.join(__dirname, "..", "config.env"),
  path.join(__dirname, "config.env"),
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));

if (envPath) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

// Minimal defaults; override via environment variables when needed.
const config = {
  app: {
    name: process.env.APP_NAME || "Node API",
    port: process.env.PORT || 5000,
    host: process.env.HOST || "localhost",
    apiPrefix: process.env.API_PREFIX || "/api/v1",
    environment: NODE_ENV,
    isProduction,
  },
  db: {
    uri: process.env.DATABASE || "mongodb://localhost:27017",
    password: process.env.DATABASE_PASSWORD,
    options: {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
      // serverSelectionTimeoutMS: 5000,
      // socketTimeoutMS: 45000,
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

export default config;
