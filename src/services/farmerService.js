const db = require('../db');

class FarmerService {
  async createFarmer(farmerData, farms, affiliationData, files) {
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');

      // Insert farmer (your existing code)
      const farmerResult = await client.query(farmerQuery, farmerValues);
      const farmerId = farmerResult.rows[0].id;

      // Insert multiple farms
      const farmQuery = `
        INSERT INTO farm (
          farmer_id, farm_type, ownership_status, lease_years, lease_months,
          area, crop_type, crop_area, livestock_type, number_of_animals,
          farm_latitude, farm_longitude, farm_geometry
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, ST_GeomFromText($13, 4326))
        RETURNING id;
      `;

      // Insert each farm
      for (const farmData of farms) {
        const farmValues = [
          farmerId,
          farmData.farm_type,
          farmData.ownership_status,
          farmData.lease_years,
          farmData.lease_months,
          farmData.area,
          farmData.crop_type,
          farmData.crop_area,
          farmData.livestock_type,
          farmData.number_of_animals,
          farmData.farm_latitude,
          farmData.farm_longitude,
          farmData.farm_geometry
        ];

        await client.query(farmQuery, farmValues);
      }

      // Insert affiliation
      const affiliationQuery = `
        INSERT INTO farmer_affiliation (
          farmer_id, member_of_cooperative, name, activities
        ) VALUES ($1, $2, $3, $4);
      `;

      const affiliationValues = [
        farmerId,
        affiliationData.member_of_cooperative,
        affiliationData.name,
        affiliationData.activities
      ];

      await client.query(affiliationQuery, affiliationValues);

      await client.query('COMMIT');
      return farmerId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get all farm geometries
   */
  async getFarmGeometries() {
    const query = `
      SELECT 
        f.id,
        ST_AsGeoJSON(f.farm_geometry) AS geometry,
        f.farm_type,
        f.area
      FROM farm f;
    `;
  
    const result = await db.query(query);
    return result.rows.map(row => ({
      id: row.id,
      geometry: JSON.parse(row.geometry),
      farm_type: row.farm_type,
      area: row.area
    }));
  }

  /**
   * Get farmer by ID with tracking info
   */
  async getFarmerById(id) {
    const query = `
      SELECT 
        f.*,
        fa.member_of_cooperative, fa.name as cooperative_name, fa.activities,
        fm.*,
        creator.username as created_by_username,
        updater.username as updated_by_username
      FROM farmer f
      LEFT JOIN farmer_affiliation fa ON f.id = fa.farmer_id
      LEFT JOIN farm fm ON f.id = fm.farmer_id
      LEFT JOIN users creator ON f.created_by = creator.id
      LEFT JOIN users updater ON f.updated_by = updater.id
      WHERE f.id = $1;
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = new FarmerService();