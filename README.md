# Farmer Management API

A robust Node.js and Express-based backend API for managing farmers, farms, and farmer affiliations. This system supports user authentication, file uploads, location tracking, and includes comprehensive Swagger documentation.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Prerequisites](#prerequisites)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Database Setup](#database-setup)
7. [Environment Variables](#environment-variables)
8. [API Documentation](#api-documentation)
9. [Authentication](#authentication)
10. [Development Guidelines](#development-guidelines)

## Features

- **User Management**
  - Role-based authentication (Admin/Enumerator)
  - JWT-based authentication
  - Password encryption
  - Session management

- **Farmer Management**
  - Create and manage farmer profiles
  - Upload farmer pictures and ID documents
  - Location tracking for form submissions
  - Farm geometry data storage

- **Data Validation**
  - Input validation
  - File validation
  - Location coordinate validation

- **File Handling**
  - Image upload support
  - File type validation
  - Organized file storage structure

- **Location Tracking**
  - Capture enumerator's location during form submission
  - Validate coordinate data
  - Store location data for audit purposes

## Technologies Used

- **Backend Framework**: Node.js, Express.js
- **Database**: PostgreSQL with PostGIS extension
- **Authentication**: JWT, bcrypt
- **File Upload**: Multer
- **Documentation**: Swagger/OpenAPI
- **Development**: node-pg-migrate for database migrations

## Prerequisites

Before setting up the project, ensure you have:

1. Node.js (v14 or higher)
2. PostgreSQL (v12 or higher)
3. PostGIS extension for PostgreSQL
4. Git

## Project Structure

```
src/
  ├── controllers/     # Route handlers
  ├── middleware/      # Custom middleware
  ├── models/         # Data models
  ├── routes/         # API routes
  ├── services/       # Business logic
  ├── utils/          # Helper functions
  ├── db.js          # Database configuration
  ├── server.js      # Application entry point
  └── swagger.js     # API documentation
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd farmer-management-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Database Setup

1. Install PostgreSQL and PostGIS:
   ```bash
   # Ubuntu
   sudo apt-get install postgresql postgresql-contrib postgis
   
   # Windows
   # Download and install from https://www.postgresql.org/download/windows/
   # Install PostGIS using Stack Builder
   ```

2. Create database and enable PostGIS:
   ```sql
   CREATE DATABASE kitovu;
   \c kitovu
   CREATE EXTENSION postgis;
   ```

3. Configure database connection in .env file

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=kitovu
DB_PASSWORD=your_password
DB_PORT=5432

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_secret_key

# Do not edit - this is constructed dynamically
DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
```

## API Documentation

Access the Swagger documentation at `http://localhost:3000/api-docs` after starting the server.

Key endpoints:

- **Authentication**
  - POST `/api/auth/login` - User login
  - POST `/api/auth/register` - Register new enumerator (Admin only)
  - POST `/api/auth/reset-password` - Reset password - currenlty not working 

- **Farmer Management**
  - POST `/api/farmer` - Create new farmer
  - GET `/api/farmer/:id` - Get farmer details - currenlty not working 
  - GET `/api/farms/geometries` - Get all farm geometries 

## Authentication

The system uses JWT for authentication. Include the token in requests:

```http
Authorization: Bearer <your_token>
```

Default admin credentials:
- Email: admin@kitovu.com.ng
- Password: K!tovu@dm!n2024

## Development Guidelines

1. **Code Organization**
   - Keep files under 125 lines
   - Split functionality into appropriate services
   - Use middleware for validation

2. **Error Handling**
   - Use try-catch blocks
   - Return consistent error responses
   - Log errors appropriately

3. **Database**
   - Use migrations for schema changes
   - Document complex queries
   - Use transactions where necessary

4. **API Design**
   - Follow RESTful principles
   - Validate inputs
   - Document with Swagger

5. **Security**
   - Validate file uploads
   - Sanitize user inputs
   - Use proper authentication
   - Implement rate limiting

