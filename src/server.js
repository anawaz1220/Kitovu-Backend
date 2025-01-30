require('dotenv').config();
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

// Middleware
app.use(express.json());
app.use('/uploads', express.static(uploadsDir)); // Serve uploaded files

// Routes
app.use('/', routes);

// Swagger Documentation
swaggerSetup(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});