const bcrypt = require("bcryptjs");

exports.up = async (pgm) => {
  // Create users table
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    email: { type: "varchar(255)", notNull: true, unique: true },
    username: { type: "varchar(100)", notNull: true, unique: true },
    password: { type: "varchar(100)", notNull: true },
    role: {
      type: "varchar(20)",
      notNull: true,
      check: "role IN ('administrator', 'enumerator')",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Add tracking columns to farmer
  pgm.addColumns("farmer", {
    created_by: { type: "uuid", references: "users" },
    updated_by: { type: "uuid", references: "users" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash("K!tovu@dm!n2024", 10);
  pgm.sql(`
    INSERT INTO users (email, username, password, role)
    VALUES ('admin@kitovu.com.ng', 'admin', '${hashedPassword}', 'administrator')
  `);
};

exports.down = (pgm) => {
  pgm.dropColumns("farmer", [
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
  ]);
  pgm.dropTable("users");
};
