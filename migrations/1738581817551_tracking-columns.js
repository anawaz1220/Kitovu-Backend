exports.up = (pgm) => {
    // Add tracking columns to farm table
    pgm.addColumns('farm', {
      created_by: { type: 'uuid', references: 'users' },
      updated_by: { type: 'uuid', references: 'users' },
      created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
      updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
    });
  
    // Add tracking columns to farmer_affiliation table
    pgm.addColumns('farmer_affiliation', {
      created_by: { type: 'uuid', references: 'users' },
      updated_by: { type: 'uuid', references: 'users' },
      created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
      updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
    });
  
    // Add trigger functions to update updated_at timestamp
    pgm.sql(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
  
      -- Trigger for farmer table
      CREATE TRIGGER update_farmer_updated_at
          BEFORE UPDATE ON farmer
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
  
      -- Trigger for farm table
      CREATE TRIGGER update_farm_updated_at
          BEFORE UPDATE ON farm
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
  
      -- Trigger for farmer_affiliation table
      CREATE TRIGGER update_farmer_affiliation_updated_at
          BEFORE UPDATE ON farmer_affiliation
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);
  };
  
  exports.down = (pgm) => {
    // Remove triggers
    pgm.sql(`
      DROP TRIGGER IF EXISTS update_farmer_updated_at ON farmer;
      DROP TRIGGER IF EXISTS update_farm_updated_at ON farm;
      DROP TRIGGER IF EXISTS update_farmer_affiliation_updated_at ON farmer_affiliation;
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `);
  
    // Remove tracking columns from farm
    pgm.dropColumns('farm', ['created_by', 'updated_by', 'created_at', 'updated_at']);
  
    // Remove tracking columns from farmer_affiliation
    pgm.dropColumns('farmer_affiliation', ['created_by', 'updated_by', 'created_at', 'updated_at']);
  };