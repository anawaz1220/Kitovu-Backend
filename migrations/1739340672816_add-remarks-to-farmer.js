exports.up = (pgm) => {
    pgm.addColumn('farmer', {
      remarks: { 
        type: 'text', 
        notNull: false 
      }
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropColumn('farmer', ['remarks']);
  };