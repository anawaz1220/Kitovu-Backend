const db = require('../db');
const path = require('path');

const createFarmer = async (req, res) => {
//   console.log('Request Body:', req.body); // Log the request body
//   console.log('Uploaded Files:', req.files); // Log the uploaded files

  try {
    // Parse JSON strings into objects
    const farmer = JSON.parse(req.body.farmer);
    const farm = JSON.parse(req.body.farm);
    const affiliation = JSON.parse(req.body.affiliation);

    // Check if required fields are present
    const requiredFarmerFields = [
      'first_name', 'last_name', 'gender', 'date_of_birth', 'phone_number',
      'street_address', 'id_type', 'id_number',
    ];
    const requiredFarmFields = [
      'farm_type', 'ownership_status', 'area', 'farm_latitude', 'farm_longitude', 'farm_geometry',
    ];
    const requiredAffiliationFields = ['member_of_cooperative'];

    // Validate farmer fields
    const missingFarmerFields = requiredFarmerFields.filter(field => !farmer[field]);
    if (missingFarmerFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required farmer fields',
        missingFields: missingFarmerFields,
      });
    }

    // Validate farm fields
    const missingFarmFields = requiredFarmFields.filter(field => !farm[field]);
    if (missingFarmFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required farm fields',
        missingFields: missingFarmFields,
      });
    }

    // Validate affiliation fields
    const missingAffiliationFields = requiredAffiliationFields.filter(field => !affiliation[field]);
    if (missingAffiliationFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required affiliation fields',
        missingFields: missingAffiliationFields,
      });
    }

    // Check if files are uploaded
    if (!req.files || !req.files['farmer_picture'] || !req.files['id_document_picture']) {
      return res.status(400).json({
        error: 'Missing required files',
        missingFiles: ['farmer_picture', 'id_document_picture'],
      });
    }

    // Start a transaction
    await db.query('BEGIN');

    // Get file paths for uploaded images
    const farmerPicturePath = req.files['farmer_picture'][0].path;
    const idDocumentPicturePath = req.files['id_document_picture'][0].path;

    // Insert into farmer table
    const farmerQuery = `
      INSERT INTO farmer (
        first_name, middle_name, last_name, gender, date_of_birth, phone_number, alternate_phone_number,
        street_address, state, community, lga, city, farmer_picture, id_type, id_number, id_document_picture
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id;
    `;
    const farmerValues = [
      farmer.first_name, farmer.middle_name, farmer.last_name, farmer.gender, farmer.date_of_birth,
      farmer.phone_number, farmer.alternate_phone_number, farmer.street_address, farmer.state,
      farmer.community, farmer.lga, farmer.city, farmerPicturePath, farmer.id_type,
      farmer.id_number, idDocumentPicturePath,
    ];
    const farmerResult = await db.query(farmerQuery, farmerValues);
    const farmerId = farmerResult.rows[0].id;

    // Insert into farm table
    const farmQuery = `
      INSERT INTO farm (
        farmer_id, farm_type, ownership_status, lease_years, lease_months, area,
        crop_type, crop_area, livestock_type, number_of_animals, farm_latitude, farm_longitude, farm_geometry
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, ST_GeomFromText($13, 4326));
    `;
    const farmValues = [
      farmerId, farm.farm_type, farm.ownership_status, farm.lease_years, farm.lease_months, farm.area,
      farm.crop_type, farm.crop_area, farm.livestock_type, farm.number_of_animals, farm.farm_latitude,
      farm.farm_longitude, farm.farm_geometry,
    ];
    await db.query(farmQuery, farmValues);

    // Insert into farmer_affiliation table
    const affiliationQuery = `
      INSERT INTO farmer_affiliation (
        farmer_id, member_of_cooperative, name, activities
      ) VALUES ($1, $2, $3, $4);
    `;
    const affiliationValues = [
      farmerId, affiliation.member_of_cooperative, affiliation.name, affiliation.activities,
    ];
    await db.query(affiliationQuery, affiliationValues);

    // Commit the transaction
    await db.query('COMMIT');

    res.status(201).json({ message: 'Farmer, farm, and affiliation data created successfully' });
  } catch (error) {
    // Rollback the transaction in case of error
    await db.query('ROLLBACK');
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


const getFarmGeometries = async (req, res) => {
    try {
      // Query to retrieve all farm geometries in GeoJSON format
      const query = `
        SELECT ST_AsGeoJSON(farm_geometry) AS geometry
        FROM farm;
      `;
  
      const result = await db.query(query);
  
      // Extract geometries from the result
      const geometries = result.rows.map(row => JSON.parse(row.geometry));
  
      res.status(200).json({
        message: 'Farm geometries retrieved successfully',
        geometries: geometries,
      });
    } catch (error) {
      console.error('Error retrieving farm geometries:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };

module.exports = { createFarmer, getFarmGeometries};