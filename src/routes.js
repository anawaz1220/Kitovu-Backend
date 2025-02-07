const express = require('express');
const router = express.Router();
const farmerController = require('./controllers/farmerController');
const upload = require('./middleware/upload');
const { validateFarmerData } = require('./middleware/validation');
const { authenticateToken } = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');

// Auth routes
router.use('/api/auth', authRoutes);

/**
 * @swagger
 * /api/farmer:
 *   post:
 *     summary: Create a new farmer with farm and affiliation details
 *     tags: [Farmer]
 *     security:
 *       - bearerAuth: []
 *     description: Create new farmer record with associated farm and affiliation data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               farmer:
 *                 type: string
 *                 description: |
 *                   Farmer details in JSON format:
 *                   {
 *                     "first_name": "John", *
 *                     "middle_name": "Peter",
 *                     "last_name": "Doe", *
 *                     "gender": "Male", *
 *                     "date_of_birth": "1990-05-15", *
 *                     "phone_number": "+2347012345678", *
 *                     "alternate_phone_number": "+2347087654321",
 *                     "street_address": "123 Farm Road", *
 *                     "state": "Oyo",
 *                     "community": "Ibadan North",
 *                     "lga": "Ibadan",
 *                     "city": "Ibadan",
 *                     "id_type": "NationalID", *
 *                     "id_number": "12345678901" *
 *                     "user_latitude":6.524379, *
 *                     "user_longitude":3.379206 *
 *                   }
 *                 example: |
 *                   {
 *                     "first_name": "John",
 *                     "middle_name": "Peter",
 *                     "last_name": "Doe",
 *                     "gender": "Male",
 *                     "date_of_birth": "1990-05-15",
 *                     "phone_number": "+2347012345678",
 *                     "alternate_phone_number": "+2347087654321",
 *                     "street_address": "123 Farm Road",
 *                     "state": "Oyo",
 *                     "community": "Ibadan North",
 *                     "lga": "Ibadan",
 *                     "city": "Ibadan",
 *                     "id_type": "NationalID",
 *                     "id_number": "12345678901"
 *                   }
 *               farm:
 *                 type: string
 *                 description: |
 *                   Array of farm details in JSON format:
 *                   [{
 *                     "farm_type": "Mixed", *
 *                     "ownership_status": "Owned", *
 *                     "lease_years": null,
 *                     "lease_months": null,
 *                     "area": 2.5, *
 *                     "crop_type": "Cassava",
 *                     "crop_area": 1.5,
 *                     "livestock_type": "Poultry",
 *                     "number_of_animals": 100,
 *                     "farm_latitude": 7.992079, *
 *                     "farm_longitude": 3.565551, *
 *                     "farm_geometry": "MULTIPOLYGON(((7.992079 3.565551, 7.992179 3.565551, 7.992179 3.565651, 7.992079 3.565651, 7.992079 3.565551)), ((7.992279 3.565751, 7.992379 3.565751, 7.992379 3.565851, 7.992279 3.565851, 7.992279 3.565751)))"
 *                   }]
 *                 example: |
 *                   [{
 *                     "farm_type": "Mixed",
 *                     "ownership_status": "Owned",
 *                     "lease_years": null,
 *                     "lease_months": null,
 *                     "area": 2.5,
 *                     "crop_type": "Cassava",
 *                     "crop_area": 1.5,
 *                     "livestock_type": "Poultry",
 *                     "number_of_animals": 100,
 *                     "farm_latitude": 7.992079,
 *                     "farm_longitude": 3.565551,
 *                     "farm_geometry": "MULTIPOLYGON(((7.992079 3.565551, 7.992179 3.565551, 7.992179 3.565651, 7.992079 3.565651, 7.992079 3.565551)), ((7.992279 3.565751, 7.992379 3.565751, 7.992379 3.565851, 7.992279 3.565851, 7.992279 3.565751)))"
 *                   }]
 *               affiliation:
 *                 type: string
 *                 description: |
 *                   Affiliation details in JSON format:
 *                   {
 *                     "member_of_cooperative": true, *
 *                     "name": "Local Farmers Cooperative",
 *                     "activities": "Crop farming, poultry"
 *                   }
 *                 example: |
 *                   {
 *                     "member_of_cooperative": true,
 *                     "name": "Local Farmers Cooperative",
 *                     "activities": "Crop farming, poultry"
 *                   }
 *               farmer_picture:
 *                 type: string
 *                 format: binary
 *                 description: Farmer's photograph (Required) *
 *               id_document_picture:
 *                 type: string
 *                 format: binary
 *                 description: ID document photograph (Required) *
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Farmer, farm, and affiliation data created successfully"
 *                 farmerId:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 */
router.post(
  '/api/farmer',
  authenticateToken,
  upload.fields([
    { name: 'farmer_picture', maxCount: 1 },
    { name: 'id_document_picture', maxCount: 1 },
  ]),
  validateFarmerData,
  farmerController.createFarmer
);

/**
 * @swagger
 * /api/farmer/{id}:
 *   put:
 *     summary: Update an existing farmer with farm and affiliation details
 *     tags: [Farmer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Farmer UUID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               farmer:
 *                 type: string
 *                 description: |
 *                   Farmer details in JSON format:
 *                   {
 *                     "first_name": "John", *
 *                     "middle_name": "Peter",
 *                     "last_name": "Doe", *
 *                     "gender": "Male", *
 *                     "date_of_birth": "1990-05-15", *
 *                     "phone_number": "+2347012345678", *
 *                     "alternate_phone_number": "+2347087654321",
 *                     "street_address": "124 Farm Road", *
 *                     "state": "Oyo",
 *                     "community": "Ibadan North",
 *                     "lga": "Ibadan",
 *                     "city": "Ibadan",
 *                     "id_type": "NationalID", *
 *                     "id_number": "12345678901" *
 *                   }
 *               farm:
 *                 type: string
 *                 description: |
 *                   Farm details in JSON format:
 *                   {
 *                     "farm_type": "Mixed", *
 *                     "ownership_status": "Owned", *
 *                     "lease_years": null,
 *                     "lease_months": null,
 *                     "area (ha)": 3.0, *
 *                     "crop_type": "Cassava, Maize",
 *                     "crop_area (ha)": 2.0,
 *                     "livestock_type": "Poultry",
 *                     "number_of_animals": 150,
 *                     "farm_latitude": 7.992079, *
 *                     "farm_longitude": 3.565551, *
 *                     "farm_geometry": "POLYGON((7.992079 3.565551, 7.992179 3.565551, 7.992179 3.565651, 7.992079 3.565651, 7.992079 3.565551))" *
 *                   }
 *               affiliation:
 *                 type: string
 *                 description: |
 *                   Affiliation details in JSON format:
 *                   {
 *                     "member_of_cooperative": true, *
 *                     "name": "Local Farmers Cooperative",
 *                     "activities": "Crop farming, poultry, and maize cultivation"
 *                   }
 *               farmer_picture:
 *                 type: string
 *                 format: binary
 *                 description: Farmer's photograph (Optional during update)
 *               id_document_picture:
 *                 type: string
 *                 format: binary
 *                 description: ID document photograph (Optional during update)
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Farmer data updated successfully"
 *                 farmerId:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Farmer not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/api/farmer/:id',
  authenticateToken,
  upload.fields([
    { name: 'farmer_picture', maxCount: 1 },
    { name: 'id_document_picture', maxCount: 1 },
  ]),
  validateFarmerData,
  farmerController.updateFarmer
);

/**
 * @swagger
 * /api/farms/geometries:
 *   get:
 *     summary: Get all farm geometries
 *     tags: [Farm]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/api/farms/geometries', authenticateToken, farmerController.getFarmGeometries);

/**
 * @swagger
 * /api/farmer/{id}:
 *   get:
 *     summary: Get farmer by ID
 *     tags: [Farmer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Farmer UUID
 *     responses:
 *       200:
 *         description: Farmer details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 date_of_birth:
 *                   type: string
 *                   format: date
 *                 phone_number:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Farmer not found
 */
router.get('/api/farmer/:id', authenticateToken, farmerController.getFarmerById);

module.exports = router;