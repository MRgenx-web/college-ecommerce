// Central place that loads and exposes environment variables.
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error(
    'Missing required environment variable: JWT_SECRET. Copy .env.example to .env and set it.'
  );
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbPath: process.env.DB_PATH || './src/database/ecommerce.db',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
