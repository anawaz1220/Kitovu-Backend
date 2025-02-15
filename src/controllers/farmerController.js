const farmerService = require("../services/farmerService");


const createFarmer = async (req, res) => {
  try {
    const { farmer, farms, affiliation } = req.validatedData;
    const userId = req.user.userId; // Get user ID from JWT token

    const farmerId = await farmerService.createFarmer(
      farmer,
      farms,
      affiliation,
      req.files,
      userId
    );

    res.status(201).json({
      message: "Farmer, farm, and affiliation data created successfully",
      farmerId,
    });
  } catch (error) {
    console.error("Error creating farmer:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const updateFarmer = async (req, res) => {
  try {
    const farmerId = req.params.id;
    const { farmer, farms, affiliation } = req.validatedData;
    const userId = req.user.userId; // Get user ID from JWT token

    await farmerService.updateFarmer(
      farmerId,
      farmer,
      farms,
      affiliation,
      req.files,
      userId
    );

    res.status(200).json({
      message: "Farmer data updated successfully",
      farmerId,
    });
  } catch (error) {
    console.error("Error:", error);
    if (error.message === "Farmer not found") {
      return res.status(404).json({ error: "Farmer not found" });
    }
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const getFarmGeometries = async (req, res) => {
  try {
    const geometries = await farmerService.getFarmGeometries();

    res.status(200).json({
      message: "Farm geometries retrieved successfully",
      geometries,
    });
  } catch (error) {
    console.error("Error retrieving farm geometries:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const getFarmerById = async (req, res) => {
  try {
    const farmer = await farmerService.getFarmerById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }
    res.status(200).json(farmer);
  } catch (error) {
    console.error("Error retrieving farmer:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

module.exports = {
  createFarmer,
  updateFarmer,
  updateFarmer,
  getFarmGeometries,
  getFarmerById,
  getFarmerById,
};
