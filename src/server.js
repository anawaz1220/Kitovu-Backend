// src/server.js
require("dotenv").config();

const express = require("express");
const { default: migrate } = require("node-pg-migrate");
const path = require("path");
const fs = require("fs");

// Import middleware
const cors = require("./middleware/cors");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");

// Import configurations and routes
const db = require("./db");
const routes = require("./routes");
const swaggerSetup = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// Create required directories
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Database URL construction
const constructDatabaseUrl = () => {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
  return `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
};

// Middleware setup
app.use(requestLogger);
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/", routes);

// Swagger Documentation
swaggerSetup(app);

// Error handling
app.use(errorHandler);

// Database migration function
const runMigrations = async () => {
  try {
    await migrate({
      direction: "up",
      databaseUrl: constructDatabaseUrl(),
      migrationsTable: "pgmigrations",
      dir: "migrations",
    });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  }
};

// Server startup
const startServer = async () => {
  try {
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(
        `API Documentation available at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
