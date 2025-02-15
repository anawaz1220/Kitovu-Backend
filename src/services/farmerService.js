const db = require("../db");

class FarmerService {
  async createFarmer(farmerData, farms, affiliationData, files, userId) {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // Insert farmer
      const farmerQuery = `
        INSERT INTO farmer (
          first_name, middle_name, last_name, gender, date_of_birth, phone_number,
          alternate_phone_number, street_address, state, community, lga, city,
          farmer_picture, id_type, id_number, id_document_picture, user_latitude, user_longitude,
          remarks, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING id;
      `;

      // Verify files exist before accessing them
      if (!files.farmer_picture || !files.farmer_picture[0] || !files.id_document_picture || !files.id_document_picture[0]) {
        throw new Error('Required files are missing');
      }

      const farmerValues = [
        farmerData.first_name,
        farmerData.middle_name || null,
        farmerData.last_name,
        farmerData.gender,
        farmerData.date_of_birth,
        farmerData.phone_number,
        farmerData.alternate_phone_number || null,
        farmerData.street_address,
        farmerData.state,
        farmerData.community || null,
        farmerData.lga,
        farmerData.city,
        files.farmer_picture[0].path,
        farmerData.id_type,
        farmerData.id_number,
        files.id_document_picture[0].path,
        farmerData.user_latitude,
        farmerData.user_longitude,
        farmerData.remarks || null,
        userId
      ];

      const farmerResult = await client.query(farmerQuery, farmerValues);
      const farmerId = farmerResult.rows[0].id;

      // Insert farms
      const farmQuery = `
      INSERT INTO farm (
        farmer_id, farm_type, ownership_status, lease_years, lease_months,
        area, crop_type, crop_area, livestock_type, number_of_animals,
        farm_latitude, farm_longitude, farm_geometry, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, ST_GeomFromText($13, 4326), $14, $14)
      RETURNING id;
    `;

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
          farmData.farm_geometry,
          userId
        ];

        await client.query(farmQuery, farmValues);
      }

      // Insert affiliation
      const affiliationQuery = `
      INSERT INTO farmer_affiliation (
        farmer_id, member_of_cooperative, name, activities, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $5);
    `;

      const affiliationValues = [
        farmerId,
        affiliationData.member_of_cooperative,
        affiliationData.name,
        affiliationData.activities,
        userId
      ];

      await client.query(affiliationQuery, affiliationValues);

      await client.query("COMMIT");
      return farmerId;
    } catch (error) {
      await client.query("ROLLBACK");
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
    return result.rows.map((row) => ({
      id: row.id,
      geometry: JSON.parse(row.geometry),
      farm_type: row.farm_type,
      area: row.area,
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
