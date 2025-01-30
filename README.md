# Farmer Management API

This is a Node.js, Express.js, and PostgreSQL-based backend API for managing farmers, farms, and farmer affiliations. The API supports file uploads (e.g., farmer pictures and ID documents) and includes Swagger documentation for easy testing.

---

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Setup Instructions](#setup-instructions)
4. [API Endpoints](#api-endpoints)
5. [Testing the API](#testing-the-api)
6. [License](#license)

---

## Features

- **Create Farmer**: Add a new farmer with farm and affiliation details.
- **File Uploads**: Upload farmer pictures and ID documents.
- **Get Farm Geometries**: Retrieve all farm geometries in GeoJSON format.
- **Swagger Documentation**: Interactive API documentation for testing.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **File Uploads**: Multer
- **API Documentation**: Swagger
- **Geospatial Data**: PostGIS (for farm geometries)

---

## Setup Instructions

### 1. Prerequisites

- Node.js and npm installed.
- PostgreSQL installed and running.
- PostGIS extension enabled in PostgreSQL.

### 2. Clone the Repository


```bash
git clone https://github.com/your-username/farmer-management-api.git
cd farmer-management-api
```
### 3. to start the server
node src/server.js

## Swagger Documentation
http://localhost:3000/api-docs


