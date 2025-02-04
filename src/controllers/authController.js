const authService = require('../services/authService');

/**
 * Handle user login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Email and password are required'
      });
    }

    const authData = await authService.login(email, password);
    res.status(200).json(authData);
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message === 'User not found' || error.message === 'Invalid password') {
      return res.status(401).json({
        error: 'Authentication failed',
        details: 'Invalid email or password'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

/**
 * Create new enumerator (admin only)
 */
const createEnumerator = async (req, res) => {
  try {
    // Check if the requester is admin
    if (req.user.role !== 'administrator') {
      return res.status(403).json({
        error: 'Forbidden',
        details: 'Only administrators can create new users'
      });
    }

    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Email, username and password are required'
      });
    }

    const user = await authService.createEnumerator({ email, username, password });
    res.status(201).json({
      message: 'Enumerator created successfully',
      user
    });
  } catch (error) {
    console.error('Create enumerator error:', error);
    
    if (error.message.includes('duplicate key')) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'Email or username already exists'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

/**
 * Reset user password
 */
const resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Current password and new password are required'
      });
    }

    const user = await authService.resetPassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      message: 'Password reset successful',
      user
    });
  } catch (error) {
    console.error('Password reset error:', error);
    
    if (error.message === 'Current password is incorrect') {
      return res.status(401).json({
        error: 'Authentication failed',
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

module.exports = {
  login,
  createEnumerator,
  resetPassword
};