const express = require('express');
const router = express.Router();
const farmerController = require('./controllers/farmerController');
const upload = require('./middleware/upload');

/**
 * @swagger
 * /api/farmer:
 *   post:
 *     summary: Create a new farmer with farm and affiliation details
 *     description: Insert data into farmer, farm, and farmer_affiliation tables
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               farmer_picture:
 *                 type: string
 *                 format: binary
 *               id_document_picture:
 *                 type: string
 *                 format: binary
 *               farmer:
 *                 type: string
 *                 example: '{"first_name": "John", "last_name": "Doe", "gender": "Male", "date_of_birth": "1990-05-15", "phone_number": "+1234567890", "street_address": "123 Main Street", "id_type": "Passport", "id_number": "A12345678"}'
 *               farm:
 *                 type: string
 *                 example: '{"farm_type": "Crop", "ownership_status": "Leased", "area": 10.5, "farm_latitude": 6.524379, "farm_longitude": 3.379206, "farm_geometry": "POLYGON((6.524379 3.379206, 6.524379 3.379306, 6.524479 3.379306, 6.524479 3.379206, 6.524379 3.379206))"}'
 *               affiliation:
 *                 type: string
 *                 example: '{"member_of_cooperative": true, "name": "Green Farmers Cooperative", "activities": "Organic farming, crop rotation, and sustainable practices"}'
 *     responses:
 *       201:
 *         description: Farmer, farm, and affiliation data created successfully
 *       400:
 *         description: Bad request (missing fields or files)
 *       500:
 *         description: Internal server error
 */
router.post(
  '/api/farmer',
  upload.fields([
    { name: 'farmer_picture', maxCount: 1 },
    { name: 'id_document_picture', maxCount: 1 },
  ]),
  farmerController.createFarmer
);

/**
 * @swagger
 * /api/farms/geometries:
 *   get:
 *     summary: Get all farm geometries
 *     description: Retrieve all farm geometries in GeoJSON format
 *     responses:
 *       200:
 *         description: Farm geometries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 geometries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: GeoJSON object representing a farm geometry
 *       500:
 *         description: Internal server error
 */
router.get('/api/farms/geometries', farmerController.getFarmGeometries);

module.exports = router;