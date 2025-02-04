/**
 * Validates required fields in farmer data
 */
const validateFarmerData = (req, res, next) => {
  try {
    const farmer = JSON.parse(req.body.farmer);
    const farm = JSON.parse(req.body.farm);
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
      'user_latitude',  // New required field
      'user_longitude'  // New required field
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

    // Validate farm fields
    const missingFarmFields = requiredFarmFields.filter(field => !farm[field]);
    if (missingFarmFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required farm fields',
        missingFields: missingFarmFields
      });
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

    // Validate files
    if (!req.files || !req.files['farmer_picture'] || !req.files['id_document_picture']) {
      return res.status(400).json({
        error: 'Missing required files',
        missingFiles: ['farmer_picture', 'id_document_picture']
      });
    }

    // Add parsed data to request object
    req.validatedData = {
      farmer,
      farm,
      affiliation
    };

    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid JSON data',
      details: error.message
    });
  }
};

module.exports = {
  validateFarmerData
};