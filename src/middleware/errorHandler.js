// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    // Handle specific error types
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        error: 'Authentication failed',
        details: 'Invalid or expired token'
      });
    }
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.message
      });
    }
  
    // Default error
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  };
  
  module.exports = errorHandler;
  
  