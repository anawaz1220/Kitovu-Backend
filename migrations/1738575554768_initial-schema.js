exports.up = (pgm) => {
    // Enable PostGIS
    pgm.sql('CREATE EXTENSION IF NOT EXISTS postgis;');
  
    // Create farmer table
    pgm.createTable('farmer', {
      id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
      first_name: { type: 'varchar(100)', notNull: true },
      middle_name: { type: 'varchar(100)' },
      last_name: { type: 'varchar(100)', notNull: true },
      gender: { type: 'varchar(10)', notNull: true },
      date_of_birth: { type: 'date', notNull: true },
      phone_number: { type: 'varchar(15)', notNull: true },
      alternate_phone_number: { type: 'varchar(15)' },
      street_address: { type: 'text', notNull: true },
      state: { type: 'varchar(100)' },
      community: { type: 'varchar(100)' },
      lga: { type: 'varchar(100)' },
      city: { type: 'varchar(100)' },
      farmer_picture: { type: 'text', notNull: true },
      id_type: { type: 'varchar(50)', notNull: true },
      id_number: { type: 'varchar(50)', notNull: true },
      id_document_picture: { type: 'text', notNull: true }
    });
  
    // Create farm table
    pgm.createTable('farm', {
      id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
      farmer_id: { type: 'uuid', notNull: true, references: 'farmer', onDelete: 'CASCADE' },
      farm_type: { type: 'varchar(100)', notNull: true },
      ownership_status: { type: 'varchar(50)', notNull: true },
      lease_years: { type: 'integer' },
      lease_months: { type: 'integer' },
      area: { type: 'numeric(10,2)', notNull: true },
      crop_type: { type: 'varchar(100)' },
      crop_area: { type: 'numeric(10,2)' },
      livestock_type: { type: 'varchar(100)' },
      number_of_animals: { type: 'integer' },
      farm_latitude: { type: 'double precision' },
      farm_longitude: { type: 'double precision' }
    });
  
    // Add PostGIS column to farm
    pgm.sql('ALTER TABLE farm ADD COLUMN farm_geometry geometry(Polygon,4326);');
  
    // Create farmer_affiliation table
    pgm.createTable('farmer_affiliation', {
      id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
      farmer_id: { type: 'uuid', notNull: true, references: 'farmer', onDelete: 'CASCADE' },
      member_of_cooperative: { type: 'boolean', notNull: true },
      name: { type: 'varchar(255)' },
      activities: { type: 'text' }
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('farmer_affiliation');
    pgm.dropTable('farm');
    pgm.dropTable('farmer');
  };