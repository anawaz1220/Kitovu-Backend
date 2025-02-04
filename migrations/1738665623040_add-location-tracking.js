exports.up = (pgm) => {
    // Step 1: Add columns allowing NULL
    pgm.addColumns('farmer', {
      user_latitude: { 
        type: 'double precision', 
        notNull: false  // Initially allow NULL
      },
      user_longitude: { 
        type: 'double precision', 
        notNull: false  // Initially allow NULL
      }
    });
  
    // Step 2: Update existing records with default values (using center of Nigeria as default)
    pgm.sql(`
      UPDATE farmer 
      SET 
        user_latitude = 9.0820, 
        user_longitude = 8.6753
      WHERE user_latitude IS NULL OR user_longitude IS NULL;
    `);
  
    // Step 3: Now make the columns NOT NULL
    pgm.alterColumn('farmer', 'user_latitude', {
      notNull: true
    });
    pgm.alterColumn('farmer', 'user_longitude', {
      notNull: true
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropColumns('farmer', [
      'user_latitude',
      'user_longitude'
    ]);
  };