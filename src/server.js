require('dotenv').config();

const { default: migrate } = require('node-pg-migrate');
const express = require('express');
const db = require('./db');
const routes = require('./routes');
const swaggerSetup = require('./swagger');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Create 'uploads' directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Function to construct database URL from environment variables
const constructDatabaseUrl = () => {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
  return `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
};

const runMigrations = async () => {
  try {
    await migrate({
      direction: process.env.NODE_MIGRATE_DIRECTION || 'up',
      databaseUrl: constructDatabaseUrl(),
      migrationsTable: 'pgmigrations',
      dir: 'migrations'
    });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};

// Check if running in migration-only mode
const isMigrateOnly = process.argv.includes('--migrate-only');

if (isMigrateOnly) {
  // Run migrations and exit
  runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
} else {
  // Normal server startup
  // Middleware
  app.use(express.json());
  app.use('/uploads', express.static(uploadsDir)); 

  // Routes
  app.use('/', routes);

  // Swagger Documentation
  swaggerSetup(app);

  // Start the server
  app.listen(PORT, async () => {
    try {
      await runMigrations();
      console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
      console.error('Server startup failed:', error);
      process.exit(1);
    }
  });
}