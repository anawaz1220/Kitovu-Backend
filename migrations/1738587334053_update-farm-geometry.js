exports.up = (pgm) => {
    // First drop the existing column
    pgm.dropColumn('farm', 'farm_geometry');
    
    // Add new column with MULTIPOLYGON type
    pgm.sql('ALTER TABLE farm ADD COLUMN farm_geometry geometry(MULTIPOLYGON,4326);');
  };
  
  exports.down = (pgm) => {
    // First drop the MULTIPOLYGON column
    pgm.dropColumn('farm', 'farm_geometry');
    
    // Add back original POLYGON column
    pgm.sql('ALTER TABLE farm ADD COLUMN farm_geometry geometry(POLYGON,4326);');
  };