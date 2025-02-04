const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
  /**
   * Login user with email and password
   */
  async login(email, password) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };
  }

  /**
   * Create new enumerator (admin only)
   */
  async createEnumerator(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const query = `
      INSERT INTO users (email, username, password, role)
      VALUES ($1, $2, $3, 'enumerator')
      RETURNING id, email, username, role;
    `;

    const result = await db.query(query, [
      data.email,
      data.username,
      hashedPassword
    ]);

    return result.rows[0];
  }

  /**
   * Reset password
   */
  async resetPassword(userId, currentPassword, newPassword) {
    // Verify current password
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const userResult = await db.query(userQuery, [userId]);
    const user = userResult.rows[0];

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = `
      UPDATE users 
      SET password = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2
      RETURNING id, email, username, role;
    `;

    const result = await db.query(updateQuery, [hashedPassword, userId]);
    return result.rows[0];
  }
}

module.exports = new AuthService();