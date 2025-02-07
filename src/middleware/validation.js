/**
 * Validates required fields in farmer data
 */
const validateFarmerData = (req, res, next) => {
  try {
    const farmer = JSON.parse(req.body.farmer);
    const farms = JSON.parse(req.body.farm); // Now expecting an array
    const affiliation = JSON.parse(req.body.affiliation);

    // Required farmer fields
    const requiredFarmerFields = [
      'first_name',
      'last_name',
      'gender',
      'date_of_birth',
      'phone_number',
      'street_address',
      'id_type',
      'id_number',
      'user_latitude',  
      'user_longitude'  
    ];

    // Required farm fields
    const requiredFarmFields = [
      'farm_type',
      'ownership_status',
      'area',
      'farm_latitude',
      'farm_longitude',
      'farm_geometry'
    ];

    // Required affiliation fields
    const requiredAffiliationFields = ['member_of_cooperative'];

    // Validate farmer fields
    const missingFarmerFields = requiredFarmerFields.filter(field => !farmer[field]);
    if (missingFarmerFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required farmer fields',
        missingFields: missingFarmerFields
      });
    }

    // Validate location coordinates
    if (isNaN(parseFloat(farmer.user_latitude)) || isNaN(parseFloat(farmer.user_longitude))) {
      return res.status(400).json({
        error: 'Invalid location coordinates',
        details: 'user_latitude and user_longitude must be valid numbers'
      });
    }

    // Validate farms array
    if (!Array.isArray(farms)) {
      return res.status(400).json({
        error: 'Invalid farm data',
        details: 'farm must be an array of farm objects'
      });
    }

    if (farms.length === 0) {
      return res.status(400).json({
        error: 'Invalid farm data',
        details: 'At least one farm must be provided'
      });
    }

    // Validate each farm
    for (const [index, farm] of farms.entries()) {
      // Check required fields
      const missingFarmFields = requiredFarmFields.filter(field => !farm[field]);
      if (missingFarmFields.length > 0) {
        return res.status(400).json({
          error: `Missing required fields in farm ${index + 1}`,
          missingFields: missingFarmFields
        });
      }

      // Validate farm coordinates
      if (isNaN(parseFloat(farm.farm_latitude)) || isNaN(parseFloat(farm.farm_longitude))) {
        return res.status(400).json({
          error: `Invalid farm coordinates in farm ${index + 1}`,
          details: 'farm_latitude and farm_longitude must be valid numbers'
        });
      }

      // Validate area
      if (isNaN(parseFloat(farm.area)) || parseFloat(farm.area) <= 0) {
        return res.status(400).json({
          error: `Invalid area in farm ${index + 1}`,
          details: 'area must be a positive number'
        });
      }

      // Validate geometry format (basic check)
      if (!farm.farm_geometry.startsWith('MULTIPOLYGON')) {
        return res.status(400).json({
          error: `Invalid geometry format in farm ${index + 1}`,
          details: 'farm_geometry must be in MULTIPOLYGON format'
        });
      }
    }

    // Validate affiliation fields
    const missingAffiliationFields = requiredAffiliationFields.filter(
      field => affiliation[field] === undefined
    );
    if (missingAffiliationFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required affiliation fields',
        missingFields: missingAffiliationFields
      });
    }

    // Validate files for new farmer creation (if not updating)
    if (!req.params.id) {  // Only check for required files during creation
      if (!req.files || !req.files['farmer_picture'] || !req.files['id_document_picture']) {
        return res.status(400).json({
          error: 'Missing required files',
          details: 'farmer_picture and id_document_picture are required'
        });
      }
    }

    // Add parsed data to request object
    req.validatedData = {
      farmer,
      farms,  // Now an array of farms
      affiliation
    };

    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(400).json({
      error: 'Invalid JSON data',
      details: error.message
    });
  }
};

module.exports = {
  validateFarmerData
};