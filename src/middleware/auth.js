const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Verify JWT token middleware
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required',
      details: 'No token provided'
    });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user; // Add user info to request
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Authentication failed',
      details: 'Invalid or expired token'
    });
  }
};

/**
 * Check if user is admin middleware
 */
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'administrator') {
    return res.status(403).json({
      error: 'Forbidden',
      details: 'This action requires administrator privileges'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin
};